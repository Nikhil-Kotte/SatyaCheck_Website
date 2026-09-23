import { useEffect, useRef } from "react";
import * as THREE from "three";
import { mountScene, SIMPLEX_3D } from "./engine";

const vertex = /* glsl */ `
${SIMPLEX_3D}
uniform float uTime;
uniform float uAmp;
uniform float uSize;
uniform float uPixelRatio;
attribute float aRand;
varying float vDisp;
varying float vRand;
varying float vFacing;

void main() {
  vec3 n = normalize(position);
  float t = uTime;
  float noise = snoise(n * 1.7 + vec3(0.0, t * 0.22, t * 0.12));
  // Latitude ripples travelling over the surface, like sound leaving a speaker.
  float ripple = sin(n.y * 11.0 - t * 3.2 + noise * 2.0);
  float disp = noise * 0.16 + ripple * 0.07 * uAmp * (0.6 + 0.4 * noise);
  vec3 p = n * (1.55 + disp);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.55 + aRand * 0.9) / -mv.z;

  vDisp = disp;
  vRand = aRand;
  // Points facing the camera are brighter than those on the far side.
  vFacing = dot(normalize(normalMatrix * n), vec3(0.0, 0.0, 1.0));
}
`;

const fragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uDark;
varying float vDisp;
varying float vRand;
varying float vFacing;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d);
  vec3 col = mix(uColorA, uColorB, clamp(vDisp * 3.2 + 0.45 + vRand * 0.15, 0.0, 1.0));
  float depth = mix(0.18, 1.0, smoothstep(-0.6, 0.8, vFacing));
  float alpha = a * depth * mix(0.85, 0.95, uDark);
  gl_FragColor = vec4(col, alpha);
}
`;

const ringVertex = /* glsl */ `
uniform float uTime;
attribute float aT;
varying float vT;
void main() {
  vT = aT;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ringFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uColor;
uniform float uOpacity;
uniform float uSpeed;
varying float vT;
void main() {
  // A bright comet travelling around a faint ring.
  float head = fract(uTime * uSpeed);
  float dist = fract(vT - head + 1.0);
  float tail = smoothstep(0.35, 0.0, 1.0 - dist) ;
  float glow = pow(max(tail, 0.0), 3.0);
  gl_FragColor = vec4(uColor, uOpacity * (0.18 + glow * 1.4));
}
`;

function fibonacciSphere(count: number) {
  const positions = new Float32Array(count * 3);
  const rand = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * r;
    rand[i] = Math.random();
  }
  return { positions, rand };
}

function makeRing(radius: number, speed: number, segments = 256) {
  const pos = new Float32Array((segments + 1) * 3);
  const t = new Float32Array(segments + 1);
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * radius;
    pos[i * 3 + 1] = 0;
    pos[i * 3 + 2] = Math.sin(a) * radius;
    t[i] = i / segments;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aT", new THREE.BufferAttribute(t, 1));
  const mat = new THREE.ShaderMaterial({
    vertexShader: ringVertex,
    fragmentShader: ringFragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color() },
      uOpacity: { value: 0.9 },
      uSpeed: { value: speed },
    },
  });
  return { line: new THREE.Line(geo, mat), geo, mat };
}

/**
 * The hero's 3D centrepiece: a sphere of particles that ripples like a voice
 * speaking, wrapped by two scanning rings. Leans toward the cursor.
 */
export default function VoiceOrb({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return mountScene(el, ({ scene, camera, renderer, isMobile }) => {
      camera.position.set(0, 0, 6.2);

      const group = new THREE.Group();
      scene.add(group);

      const { positions, rand } = fibonacciSphere(isMobile ? 4200 : 8000);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
      const mat = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: 0.5 },
          uSize: { value: isMobile ? 22 : 26 },
          uPixelRatio: { value: renderer.getPixelRatio() },
          uColorA: { value: new THREE.Color() },
          uColorB: { value: new THREE.Color() },
          uDark: { value: 0 },
        },
      });
      const points = new THREE.Points(geo, mat);
      group.add(points);

      const ringA = makeRing(2.15, 0.12);
      ringA.line.rotation.set(1.15, 0.2, 0.3);
      const ringB = makeRing(2.45, -0.08);
      ringB.line.rotation.set(1.9, -0.4, -0.2);
      group.add(ringA.line, ringB.line);

      const rot = new THREE.Vector2(0, 0);

      return {
        update(time, pointer) {
          // A speech-like envelope: syllables inside phrases, with pauses.
          const phrase = Math.max(0, Math.sin(time * 0.55));
          const syllable = Math.abs(Math.sin(time * 5.3) * Math.sin(time * 2.1 + 1.2));
          mat.uniforms.uAmp.value = 0.25 + phrase * syllable * 1.35;
          mat.uniforms.uTime.value = time;
          ringA.mat.uniforms.uTime.value = time;
          ringB.mat.uniforms.uTime.value = time;

          rot.x += (pointer.y * 0.25 - rot.x) * 0.04;
          rot.y += (pointer.x * 0.45 - rot.y) * 0.04;
          group.rotation.x = rot.x;
          group.rotation.y = time * 0.08 + rot.y;
          ringA.line.rotation.z = 0.3 + time * 0.05;
          ringB.line.rotation.z = -0.2 - time * 0.04;
        },
        onTheme(dark) {
          mat.uniforms.uDark.value = dark ? 1 : 0;
          mat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
          mat.needsUpdate = true;
          (mat.uniforms.uColorA.value as THREE.Color).set(dark ? "#3d4bff" : "#1e2bfa");
          (mat.uniforms.uColorB.value as THREE.Color).set(dark ? "#a58bff" : "#7d86ff");
          for (const r of [ringA, ringB]) {
            (r.mat.uniforms.uColor.value as THREE.Color).set(dark ? "#8c96ff" : "#1e2bfa");
            r.mat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
            r.mat.needsUpdate = true;
          }
        },
        dispose() {
          geo.dispose();
          mat.dispose();
          ringA.geo.dispose();
          ringA.mat.dispose();
          ringB.geo.dispose();
          ringB.mat.dispose();
        },
      };
    });
  }, []);

  return <div ref={ref} className={className} aria-hidden="true" />;
}

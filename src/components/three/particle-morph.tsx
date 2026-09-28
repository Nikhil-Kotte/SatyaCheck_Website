import { useEffect, useRef } from "react";
import * as THREE from "three";
import { mountScene, SIMPLEX_3D } from "./engine";

/*
 * One cloud of particles that morphs between three shapes as `progress`
 * moves from 0 to 2:
 *   0  a voice waveform (several strands, like a recording)
 *   1  a voiceprint globe (latitude and longitude rings: numbers, not audio)
 *   2  a shield with a check mark (every call protected)
 * Particles swirl through noise mid-morph and settle on each shape.
 */

const vertex = /* glsl */ `
${SIMPLEX_3D}
uniform float uTime;
uniform float uProgress;
uniform float uSize;
uniform float uPixelRatio;
attribute vec3 aWave;
attribute vec3 aGlobe;
attribute vec3 aShield;
attribute float aCheck;
attribute float aRand;
varying float vCheck;
varying float vRand;
varying float vDepth;

void main() {
  float a = smoothstep(0.0, 1.0, clamp(uProgress, 0.0, 1.0));
  float b = smoothstep(0.0, 1.0, clamp(uProgress - 1.0, 0.0, 1.0));
  vec3 p = mix(mix(aWave, aGlobe, a), aShield, b);

  // Swirl hardest halfway between shapes, calm when a shape is formed.
  float between = sin(3.14159 * fract(clamp(uProgress, 0.0, 1.999)));
  vec3 n = vec3(
    snoise(p * 0.9 + vec3(uTime * 0.25, 0.0, aRand * 4.0)),
    snoise(p * 0.9 + vec3(0.0, uTime * 0.25, aRand * 7.0)),
    snoise(p * 0.9 + vec3(aRand * 3.0, 0.0, uTime * 0.25))
  );
  p += n * (0.025 + between * 0.5);

  // The waveform keeps "speaking" while it is formed.
  float speak = (1.0 - a) * sin(p.x * 3.2 - uTime * 3.0) * 0.08;
  p.y += speak;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.6 + aRand * 0.8) * (1.0 + aCheck * b * 0.8) / -mv.z;
  vCheck = aCheck * b;
  vRand = aRand;
  vDepth = clamp(-mv.z / 8.0, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uCheck;
uniform float uDark;
varying float vCheck;
varying float vRand;
varying float vDepth;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.05, d);
  vec3 col = mix(uColorA, uColorB, vRand);
  col = mix(col, uCheck, vCheck);
  alpha *= mix(0.95, 0.55, vDepth) * mix(0.9, 1.0, uDark);
  gl_FragColor = vec4(col, alpha);
}
`;

function buildShapes(count: number) {
  const wave = new Float32Array(count * 3);
  const globe = new Float32Array(count * 3);
  const shield = new Float32Array(count * 3);
  const check = new Float32Array(count);
  const rand = new Float32Array(count);

  // Waveform: 7 strands, loud in the middle, quiet at the ends.
  for (let i = 0; i < count; i++) {
    const strand = i % 7;
    const x = (Math.random() * 2 - 1) * 2.6;
    const env = Math.exp(-x * x * 0.45);
    const y = env * (Math.sin(x * 4.2 + strand * 0.6) * 0.55 + Math.sin(x * 9.0 + strand) * 0.18);
    wave[i * 3] = x;
    wave[i * 3 + 1] = y + (Math.random() - 0.5) * 0.03;
    wave[i * 3 + 2] = (strand - 3) * 0.07;
    rand[i] = Math.random();
  }

  // Voiceprint globe: points on latitude and longitude rings.
  const R = 1.55;
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    let lat: number;
    let lon: number;
    if (i % 2 === 0) {
      lat = (Math.round((Math.random() * 2 - 1) * 6) / 6) * (Math.PI / 2) * 0.92; // 13 latitude rings
      lon = t;
    } else {
      lon = Math.round((t / (Math.PI * 2)) * 16) * ((Math.PI * 2) / 16); // 16 meridians
      lat = (Math.random() * 2 - 1) * (Math.PI / 2);
    }
    globe[i * 3] = R * Math.cos(lat) * Math.cos(lon);
    globe[i * 3 + 1] = R * Math.sin(lat);
    globe[i * 3 + 2] = R * Math.cos(lat) * Math.sin(lon);
  }

  // Shield: a filled crest with a slight dome, plus a bright check mark.
  const halfWidth = (y: number) => (y > 0.35 ? 1.25 : 1.25 * Math.pow(Math.max(0, (y + 1.75) / 2.1), 0.72));
  const checkPts: [number, number][] = [
    [-0.55, 0.05],
    [-0.12, -0.42],
    [0.62, 0.62],
  ];
  const onCheck = (u: number): [number, number] => {
    const seg = u < 0.35 ? 0 : 1;
    const f = seg === 0 ? u / 0.35 : (u - 0.35) / 0.65;
    const [ax, ay] = checkPts[seg];
    const [bx, by] = checkPts[seg + 1];
    return [ax + (bx - ax) * f, ay + (by - ay) * f];
  };
  const checkShare = 0.16;
  for (let i = 0; i < count; i++) {
    if (Math.random() < checkShare) {
      const [x, y] = onCheck(Math.random());
      shield[i * 3] = x + (Math.random() - 0.5) * 0.12;
      shield[i * 3 + 1] = y + (Math.random() - 0.5) * 0.12;
      shield[i * 3 + 2] = 0.42 + Math.random() * 0.05;
      check[i] = 1;
      continue;
    }
    let x = 0;
    let y = 0;
    for (let k = 0; k < 20; k++) {
      y = -1.75 + Math.random() * (1.55 + 1.75);
      const top = 1.55 - 0.12 * Math.cos((x / 1.25) * Math.PI) - 0.12; // gentle notch at the top edge
      x = (Math.random() * 2 - 1) * 1.3;
      if (Math.abs(x) <= halfWidth(y) && y <= top) break;
    }
    // Denser at the rim so the outline reads clearly.
    const rim = Math.random() < 0.35;
    if (rim) x = Math.sign(x || 1) * halfWidth(y);
    const dome = 0.3 * (1 - (x * x) / 1.6);
    shield[i * 3] = x;
    shield[i * 3 + 1] = y;
    shield[i * 3 + 2] = dome + (Math.random() - 0.5) * 0.06;
  }

  return { wave, globe, shield, check, rand };
}

type Props = {
  className?: string;
  /** Returns 0..2; read every frame, so it can follow scroll without re-rendering. */
  getProgress: () => number;
};

export default function ParticleMorph({ className, getProgress }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const progressRef = useRef(getProgress);
  useEffect(() => {
    progressRef.current = getProgress;
  }, [getProgress]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return mountScene(el, ({ scene, camera, renderer, isMobile }) => {
      camera.position.set(0, 0, 6.4);
      const group = new THREE.Group();
      scene.add(group);

      const count = isMobile ? 5000 : 9000;
      const shapes = buildShapes(count);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(shapes.wave, 3));
      geo.setAttribute("aWave", new THREE.BufferAttribute(shapes.wave, 3));
      geo.setAttribute("aGlobe", new THREE.BufferAttribute(shapes.globe, 3));
      geo.setAttribute("aShield", new THREE.BufferAttribute(shapes.shield, 3));
      geo.setAttribute("aCheck", new THREE.BufferAttribute(shapes.check, 1));
      geo.setAttribute("aRand", new THREE.BufferAttribute(shapes.rand, 1));
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);

      const mat = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uSize: { value: isMobile ? 24 : 28 },
          uPixelRatio: { value: renderer.getPixelRatio() },
          uColorA: { value: new THREE.Color() },
          uColorB: { value: new THREE.Color() },
          uCheck: { value: new THREE.Color() },
          uDark: { value: 0 },
        },
      });
      group.add(new THREE.Points(geo, mat));

      let shown = 0;
      let spin = 0;
      let last = 0;
      const rot = new THREE.Vector2();
      return {
        update(time, pointer) {
          const dt = Math.min(0.05, time - last);
          last = time;
          // Ease toward the scroll position so fast scrolling still looks smooth.
          shown += (progressRef.current() - shown) * Math.min(1, dt * 5);
          mat.uniforms.uProgress.value = shown;
          mat.uniforms.uTime.value = time;

          // The flat waveform only sways (never seen edge-on), the globe spins,
          // and the shield turns back to face the viewer.
          const toGlobe = Math.min(1, Math.max(0, shown));
          const settle = Math.min(1, Math.max(0, shown - 1));
          spin += dt * 0.35 * toGlobe * (1 - settle);
          if (settle > 0) {
            const home = Math.round(spin / (Math.PI * 2)) * Math.PI * 2;
            spin += (home - spin) * Math.min(1, dt * 3 * settle);
          }
          const sway = Math.sin(time * 0.5) * 0.3 * (1 - toGlobe);
          rot.x += (pointer.y * 0.18 - rot.x) * 0.05;
          rot.y += (pointer.x * 0.3 - rot.y) * 0.05;
          group.rotation.x = rot.x + 0.12 * toGlobe * (1 - settle);
          group.rotation.y = spin + sway + rot.y;
        },
        onTheme(dark) {
          mat.uniforms.uDark.value = dark ? 1 : 0;
          mat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
          mat.needsUpdate = true;
          (mat.uniforms.uColorA.value as THREE.Color).set(dark ? "#3d4bff" : "#1e2bfa");
          (mat.uniforms.uColorB.value as THREE.Color).set(dark ? "#a58bff" : "#7d86ff");
          (mat.uniforms.uCheck.value as THREE.Color).set(dark ? "#86efac" : "#15803d");
        },
        dispose() {
          geo.dispose();
          mat.dispose();
        },
      };
    });
  }, []);

  return <div ref={ref} className={className} aria-hidden="true" />;
}

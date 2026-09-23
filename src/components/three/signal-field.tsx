import { useEffect, useRef } from "react";
import * as THREE from "three";
import { mountScene, SIMPLEX_3D } from "./engine";

const vertex = /* glsl */ `
${SIMPLEX_3D}
uniform float uTime;
uniform float uDepth;
varying float vFade;
varying float vScan;
varying float vHeight;

void main() {
  vec3 p = position;
  float t = uTime;
  // Voice energy is concentrated in the middle of the field, like a waveform.
  float env = exp(-p.x * p.x * 0.045);
  float n = snoise(vec3(p.x * 0.35, p.z * 0.22 - t * 0.35, t * 0.15));
  float syll = abs(sin(p.x * 1.6 + t * 1.8 + p.z * 0.4));
  float h = (n * 0.9 + syll * 0.55) * env * 1.4;
  p.y += h;

  // A scan line sweeps from front to back.
  float scanZ = -mod(t * 3.2, uDepth + 6.0) + 3.0;
  vScan = smoothstep(1.4, 0.0, abs(p.z - scanZ));
  vFade = smoothstep(-uDepth, -uDepth * 0.35, p.z) * smoothstep(3.0, 0.0, p.z);
  vHeight = h;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragment = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uHot;
varying float vFade;
varying float vScan;
varying float vHeight;

void main() {
  vec3 col = mix(uBase, uHot, clamp(vScan + vHeight * 0.35, 0.0, 1.0));
  float alpha = vFade * (0.28 + vScan * 0.72 + clamp(vHeight, 0.0, 1.0) * 0.25);
  gl_FragColor = vec4(col, alpha);
}
`;

/**
 * A field of waveform lines receding into the distance with a scan line
 * sweeping through it: the "listening" visual behind the pipeline panel.
 * Always rendered on the dark control-plane background.
 */
export default function SignalField({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return mountScene(
      el,
      ({ scene, camera, isMobile }) => {
        camera.position.set(0, 3.1, 4.2);
        camera.lookAt(0, 0, -6);

        const rows = isMobile ? 26 : 44;
        const cols = isMobile ? 110 : 190;
        const width = 26;
        const depth = 28;

        const mat = new THREE.ShaderMaterial({
          vertexShader: vertex,
          fragmentShader: fragment,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: {
            uTime: { value: 0 },
            uDepth: { value: depth },
            uBase: { value: new THREE.Color("#2a36d8") },
            uHot: { value: new THREE.Color("#b9c1ff") },
          },
        });

        const geos: THREE.BufferGeometry[] = [];
        for (let r = 0; r < rows; r++) {
          const pos = new Float32Array(cols * 3);
          const z = -(r / (rows - 1)) * depth + 2;
          for (let c = 0; c < cols; c++) {
            pos[c * 3] = (c / (cols - 1) - 0.5) * width;
            pos[c * 3 + 1] = 0;
            pos[c * 3 + 2] = z;
          }
          const geo = new THREE.BufferGeometry();
          geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
          geos.push(geo);
          scene.add(new THREE.Line(geo, mat));
        }

        return {
          update(time, pointer) {
            mat.uniforms.uTime.value = time;
            camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.03;
            camera.lookAt(0, 0, -6);
          },
          onTheme() {
            /* The panel is dark in both themes. */
          },
          dispose() {
            geos.forEach((g) => g.dispose());
            mat.dispose();
          },
        };
      },
      55
    );
  }, []);

  return <div ref={ref} className={className} aria-hidden="true" />;
}

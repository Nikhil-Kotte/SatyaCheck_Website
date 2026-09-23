import * as THREE from "three";

/** Ashima 3D simplex noise (MIT). */
export const SIMPLEX_3D = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

export type SceneHooks = {
  /** Called every frame with elapsed seconds. */
  update: (time: number, pointer: THREE.Vector2) => void;
  /** Called on mount and whenever the site theme changes. */
  onTheme: (dark: boolean, renderer: THREE.WebGLRenderer) => void;
  onResize?: (width: number, height: number) => void;
  dispose: () => void;
};

type Setup = (ctx: {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  isMobile: boolean;
}) => SceneHooks;

/**
 * Mounts a transparent WebGL canvas into `container` and runs `setup`.
 * Handles resize, pointer tracking, theme changes, reduced motion, and
 * pauses rendering while the canvas is off screen or the tab is hidden.
 * Returns a cleanup function.
 */
export function mountScene(container: HTMLElement, setup: Setup, fov = 45): () => void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
  } catch {
    return () => undefined; // No WebGL: the CSS glow behind the canvas is enough.
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  const hooks = setup({ scene, camera, renderer, isMobile });

  const pointer = new THREE.Vector2(0, 0);
  const onPointer = (e: PointerEvent) => {
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    hooks.onResize?.(w, h);
    if (reduce) renderOnce();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  const isDark = () => document.documentElement.classList.contains("dark");
  const mo = new MutationObserver(() => {
    hooks.onTheme(isDark(), renderer);
    if (reduce) renderOnce();
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  hooks.onTheme(isDark(), renderer);

  const clock = new THREE.Clock();
  let raf = 0;
  let visible = true;
  let running = false;

  function renderOnce() {
    hooks.update(2.5, pointer);
    renderer.render(scene, camera);
  }

  const loop = () => {
    raf = requestAnimationFrame(loop);
    hooks.update(clock.getElapsedTime(), pointer);
    renderer.render(scene, camera);
  };
  const start = () => {
    if (running || reduce) return;
    running = true;
    clock.start();
    loop();
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    },
    { rootMargin: "100px" }
  );
  io.observe(container);

  const onVisibility = () => {
    if (document.hidden) stop();
    else if (visible) start();
  };
  document.addEventListener("visibilitychange", onVisibility);

  resize();
  if (reduce) renderOnce();

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    mo.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pointermove", onPointer);
    hooks.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}

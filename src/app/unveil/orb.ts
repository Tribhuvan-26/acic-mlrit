/* Three.js energy core: shader sphere with a fresnel rim, a soft halo, three tilted rings and a
   particle field. All motion is driven by `params`, which GSAP tweens from the component.
   Loaded with a dynamic import only after the visitor clicks, so the page itself stays light. */

import * as THREE from "three";

export type OrbParams = {
  intensity: number;  // 0..1.4 brightness of core + halo
  ringSpeed: number;  // ring rotation speed
  inflow: number;     // 0..1 particles drifting to the centre
  explode: number;    // 0..1 outward blast
  scale: number;      // overall size
  frozen: boolean;    // hold time still (the beat before the blast)
};

const ORANGE = new THREE.Color("#e8521a");
const DEEP = new THREE.Color("#a8350b");
const LIGHT = new THREE.Color("#ffb38a");

const coreVert = /* glsl */ `
  varying vec3 vNormal; varying vec3 vPos; varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPos = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`;

const coreFrag = /* glsl */ `
  uniform float uTime; uniform float uIntensity; uniform float uFade;
  uniform vec3 uDeep; uniform vec3 uMid; uniform vec3 uLight;
  varying vec3 vNormal; varying vec3 vPos; varying vec3 vView;
  float wave(vec3 p, float t) {
    return sin(p.x * 3.1 + t * 1.3) * sin(p.y * 3.7 - t * 1.1) * sin(p.z * 2.9 + t * 0.9)
         + 0.5 * sin(p.x * 7.0 - t * 2.1 + p.y * 5.0) * sin(p.z * 6.0 + t * 1.7);
  }
  void main() {
    float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
    float n = wave(vPos * 1.4, uTime) * 0.5 + 0.5;
    vec3 col = mix(uDeep, uMid, n);
    col = mix(col, uLight, smoothstep(0.65, 1.0, n) * 0.8);
    float hot = smoothstep(0.55, 1.4, uIntensity);
    col = mix(col, vec3(1.0, 0.93, 0.86), hot * (1.0 - fres) * 0.85);
    col *= 0.55 + uIntensity * 0.8;
    col += fres * mix(uMid, vec3(1.0), 0.35) * (0.6 + uIntensity * 1.2);
    gl_FragColor = vec4(col, uFade);
  }`;

const haloFrag = /* glsl */ `
  uniform float uIntensity; uniform float uFade; uniform vec3 uMid;
  varying vec3 vNormal; varying vec3 vView;
  void main() {
    float d = max(dot(vNormal, vView), 0.0);
    float a = pow(d, 2.6) * (0.25 + uIntensity * 0.9);
    gl_FragColor = vec4(mix(uMid, vec3(1.0, 0.85, 0.75), 0.3) * a, a * uFade);
  }`;

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, "rgba(255,255,255,1)");
  r.addColorStop(0.3, "rgba(255,190,150,.8)");
  r.addColorStop(1, "rgba(232,82,26,0)");
  g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class OrbScene {
  params: OrbParams = { intensity: 0, ringSpeed: 0.3, inflow: 0, explode: 0, scale: 0.4, frozen: false };

  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  private group = new THREE.Group();
  private coreMat: THREE.ShaderMaterial;
  private haloMat: THREE.ShaderMaterial;
  private rings: THREE.Mesh[] = [];
  private ringMats: THREE.MeshBasicMaterial[] = [];
  private points: THREE.Points;
  private pointMat: THREE.PointsMaterial;
  private dirs: Float32Array;
  private radii: Float32Array;
  private speeds: Float32Array;
  private count: number;
  private raf = 0;
  private time = 0;
  private last = 0;
  private disposables: { dispose(): void }[] = [];

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.set(0, 0, 7);
    this.scene.add(this.group);

    const uniforms = {
      uTime: { value: 0 }, uIntensity: { value: 0 }, uFade: { value: 1 },
      uDeep: { value: DEEP }, uMid: { value: ORANGE }, uLight: { value: LIGHT },
    };

    const coreGeo = new THREE.IcosahedronGeometry(1, 48);
    this.coreMat = new THREE.ShaderMaterial({ uniforms, vertexShader: coreVert, fragmentShader: coreFrag, transparent: true });
    this.group.add(new THREE.Mesh(coreGeo, this.coreMat));

    const haloGeo = new THREE.SphereGeometry(1.7, 48, 48);
    this.haloMat = new THREE.ShaderMaterial({
      uniforms: { uIntensity: uniforms.uIntensity, uFade: uniforms.uFade, uMid: uniforms.uMid },
      vertexShader: coreVert, fragmentShader: haloFrag,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide,
    });
    this.group.add(new THREE.Mesh(haloGeo, this.haloMat));

    // three thin rings at different tilts; a few bright beads ride on them
    const ringSpec: [number, number, number, number][] = [
      [1.55, 0.012, 1.15, 0.2], [1.95, 0.008, -0.5, 0.9], [2.4, 0.006, 0.35, -0.6],
    ];
    ringSpec.forEach(([r, tube, tx, tz], i) => {
      const geo = new THREE.TorusGeometry(r, tube, 8, 220);
      const mat = new THREE.MeshBasicMaterial({ color: i === 1 ? LIGHT : ORANGE, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.set(tx, 0, tz);
      const beadGeo = new THREE.SphereGeometry(0.035, 12, 12);
      for (let b = 0; b < 3; b++) {
        const bead = new THREE.Mesh(beadGeo, mat);
        const a = (b / 3) * Math.PI * 2 + i;
        bead.position.set(Math.cos(a) * r, Math.sin(a) * r, 0);
        ring.add(bead);
      }
      this.rings.push(ring); this.ringMats.push(mat);
      this.group.add(ring);
      this.disposables.push(geo, beadGeo, mat);
    });

    // particle field on a shell around the core
    this.count = window.innerWidth < 600 ? 500 : 1100;
    const pos = new Float32Array(this.count * 3);
    this.dirs = new Float32Array(this.count * 3);
    this.radii = new Float32Array(this.count);
    this.speeds = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) {
      const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      this.dirs.set([s * Math.cos(th), s * Math.sin(th), u], i * 3);
      this.radii[i] = 1.4 + Math.random() * 4.5;
      this.speeds[i] = 0.6 + Math.random() * 0.8;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const tex = dotTexture();
    this.pointMat = new THREE.PointsMaterial({ size: 0.07, map: tex, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, color: LIGHT });
    this.points = new THREE.Points(pGeo, this.pointMat);
    this.scene.add(this.points);

    this.disposables.push(coreGeo, this.coreMat, haloGeo, this.haloMat, pGeo, tex, this.pointMat);
    this.resize();
  }

  resize() {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // keep the orb a similar size on tall phones
    this.camera.position.z = w / h < 0.8 ? 9.5 : 7;
    this.camera.updateProjectionMatrix();
  }

  start() {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const p = this.params;
    const step = p.frozen ? 0 : dt;
    this.time += step;

    const ex = p.explode;
    const u = this.coreMat.uniforms;
    u.uTime.value = this.time;
    u.uIntensity.value = p.intensity + ex * 0.8;
    u.uFade.value = 1 - ex;

    this.group.scale.setScalar(p.scale * (1 + ex * 2.6));
    this.group.rotation.y += step * 0.15;
    this.rings.forEach((r, i) => { r.rotation.z += step * p.ringSpeed * (i % 2 ? -1 : 1) * (1 + i * 0.35); });
    this.ringMats.forEach((m) => { m.opacity = (0.35 + Math.min(1, p.intensity) * 0.5) * (1 - ex); });

    // particles: drift inward with inflow, fly outward on explode
    const pos = this.points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < this.count; i++) {
      let r = this.radii[i];
      if (ex > 0) r += step * this.speeds[i] * (6 + ex * 26);
      else {
        r -= step * this.speeds[i] * (0.15 + p.inflow * 2.2);
        if (r < 1.1) r = 4 + Math.random() * 2;
      }
      this.radii[i] = r;
      const o = i * 3, sw = Math.sin(this.time * 0.6 + i) * 0.05;
      arr[o] = this.dirs[o] * r + sw; arr[o + 1] = this.dirs[o + 1] * r; arr[o + 2] = this.dirs[o + 2] * r;
    }
    pos.needsUpdate = true;
    this.pointMat.opacity = (0.35 + Math.min(1, p.intensity) * 0.55) * (1 - Math.max(0, ex - 0.3) / 0.7);
    this.pointMat.size = 0.06 + ex * 0.06;

    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.tick);
  };

  dispose() {
    cancelAnimationFrame(this.raf); this.raf = 0;
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
  }
}

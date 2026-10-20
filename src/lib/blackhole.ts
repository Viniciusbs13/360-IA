import * as THREE from 'three';

/* Buraco negro ray-traced em um único fragment shader + bloom HDR em 2 passes.
   Inspirado na abordagem dos renderers "optimized black hole": os raios são
   dobrados pela gravidade a cada passo; quando cruzam o plano do disco entre
   r_in e r_out acumulam a emissão do disco (bandas por ruído, temperatura por
   raio, doppler/beaming pelo lado que se aproxima); o que cai no horizonte fica
   preto; o resto amostra um fundo de estrelas com a direção final (lenteada). */

const QUAD_VERT = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const BH_FRAG = /* glsl */ `
  precision highp float;
  uniform vec2 uRes; uniform float uTime; uniform vec3 uCam; uniform float uFov;
  uniform vec3 uGold; uniform vec3 uCyan; uniform float uOffset;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float hash3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; } return v; }

  vec3 stars(vec3 d) {
    vec3 col = vec3(0.0);
    // two layers of sparse points on a cube-ish grid
    for (int l = 0; l < 2; l++) {
      float s = l == 0 ? 90.0 : 160.0;
      vec3 g = floor(d * s); vec3 f = fract(d * s) - 0.5;
      float h = hash3(g + float(l) * 3.1);
      float r = length(f);
      float m = smoothstep(0.06, 0.0, r) * step(0.985 - float(l) * 0.01, h);
      vec3 tint = mix(vec3(0.85, 0.9, 1.0), vec3(1.0, 0.85, 0.6), hash3(g * 1.7));
      col += tint * m * (0.6 + 0.9 * hash3(g * 2.3));
    }
    // faint milky band
    float band = exp(-abs(d.y + 0.25 * d.x) * 6.0) * 0.035 * (0.5 + fbm(d.xz * 8.0));
    return col + vec3(0.55, 0.6, 0.8) * band;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y; uv.y -= uOffset;
    vec3 target = vec3(0.0, 0.0, 0.0);
    vec3 fw = normalize(target - uCam);
    vec3 rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(rt, fw);
    vec3 v = normalize(fw * uFov + uv.x * rt + uv.y * up);
    vec3 p = uCam;
    vec3 col = vec3(0.0);
    float trans = 1.0;
    const float RS = 1.0;        // horizon radius
    const float RIN = 1.9;       // disk inner edge (just outside the photon sphere region)
    const float ROUT = 6.5;      // disk outer edge

    for (int i = 0; i < 120; i++) {
      float r = length(p);
      if (r < RS) { trans = 0.0; break; }
      if (r > 40.0 && dot(p, v) > 0.0) break;
      float dt = clamp(r * 0.1, 0.03, 0.6);
      vec3 acc = -p * (1.2 / (r * r * r));          // gravitational bending
      vec3 v2 = normalize(v + acc * dt);
      vec3 p2 = p + v2 * dt;

      if (p.y * p2.y < 0.0) {
        float t = p.y / (p.y - p2.y);
        vec3 hit = mix(p, p2, t);
        float rr = length(hit.xz);
        if (rr > RIN && rr < ROUT) {
          float ang = atan(hit.z, hit.x);
          float omega = 1.1 / pow(rr, 1.5);
          float a1 = ang + uTime * omega;
          // banded, turbulent disk
          float bands = fbm(vec2(rr * 1.6, a1 * 2.2));
          float fine = fbm(vec2(rr * 6.0 - uTime * 0.2, a1 * 9.0));
          float shape = smoothstep(ROUT, ROUT - 2.4, rr) * smoothstep(RIN, RIN + 0.55, rr);
          float dens = shape * (0.25 + 0.75 * bands) * (0.7 + 0.3 * fine);
          float temp = clamp(1.0 - (rr - RIN) / (ROUT - RIN), 0.0, 1.0);
          float t2 = temp * temp;
          // color: deep gold outside -> bright gold -> white-hot inside
          vec3 dcol = mix(uGold * 0.55, uGold * 1.35, temp);
          dcol = mix(dcol, vec3(1.0, 0.95, 0.85), t2 * 0.55);
          // doppler beaming: side moving towards the camera is brighter and cooler-tinted (cyan accent)
          vec3 tang = normalize(vec3(-hit.z, 0.0, hit.x));
          float dop = dot(tang, -v2);
          float beam = pow(1.0 + 0.5 * dop, 2.2);
          dcol = mix(dcol, dcol * (0.75 + 0.6 * uCyan), clamp(dop, 0.0, 1.0) * 0.45);
          float emis = dens * beam * (0.25 + 2.2 * t2);
          col += trans * dcol * emis;
          trans *= 1.0 - clamp(dens * 0.9, 0.0, 1.0);
          if (trans < 0.02) break;
        }
      }
      p = p2; v = v2;
    }
    if (trans > 0.005) col += trans * stars(normalize(v)) * 1.2;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const BRIGHT_FRAG = /* glsl */ `
  precision highp float; uniform sampler2D tex; uniform vec2 uRes; uniform float uThresh;
  void main() { vec3 c = texture2D(tex, gl_FragCoord.xy / uRes).rgb; float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    gl_FragColor = vec4(c * smoothstep(uThresh, uThresh + 0.6, l), 1.0); }
`;
const BLUR_FRAG = /* glsl */ `
  precision highp float; uniform sampler2D tex; uniform vec2 uRes; uniform vec2 uDir;
  void main() { vec2 uv = gl_FragCoord.xy / uRes; vec2 px = uDir / uRes;
    float w[5]; w[0] = 0.227; w[1] = 0.194; w[2] = 0.121; w[3] = 0.054; w[4] = 0.016;
    vec3 c = texture2D(tex, uv).rgb * w[0];
    for (int i = 1; i < 5; i++) { c += texture2D(tex, uv + px * float(i) * 1.5).rgb * w[i]; c += texture2D(tex, uv - px * float(i) * 1.5).rgb * w[i]; }
    gl_FragColor = vec4(c, 1.0); }
`;
const COMP_FRAG = /* glsl */ `
  precision highp float; uniform sampler2D tex; uniform sampler2D bloom; uniform vec2 uRes; uniform float uBloom; uniform float uExposure;
  vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
  void main() { vec2 uv = gl_FragCoord.xy / uRes; vec3 c = texture2D(tex, uv).rgb + texture2D(bloom, uv).rgb * uBloom;
    c = aces(c * uExposure);
    float vig = smoothstep(1.25, 0.35, length(uv - 0.5) * 1.3); c *= mix(0.55, 1.0, vig);
    // subtle grain so gradients don't band
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5; c += g * 0.012;
    gl_FragColor = vec4(c, 1.0); }
`;

export type BlackHoleRenderer = { dispose: () => void; setState: (s: { scroll: number; mouse: { x: number; y: number }; active: boolean }) => void };

export function createBlackHole(canvas: HTMLCanvasElement): BlackHoleRenderer {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 1);
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const sceneScale = 0.7;   // ray tracing resolution relative to CSS px * dpr
  const bloomScale = 0.25;

  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.PlaneGeometry(2, 2);
  const mk = (frag: string, uniforms: Record<string, THREE.IUniform>) => new THREE.ShaderMaterial({ vertexShader: QUAD_VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false });

  const uBH = { uRes: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 }, uCam: { value: new THREE.Vector3(0, 2, 10) }, uFov: { value: 3.2 }, uOffset: { value: 0.16 }, uGold: { value: new THREE.Color('#d9a85a') }, uCyan: { value: new THREE.Color('#5fe3e8') } };
  const uBright = { tex: { value: null as THREE.Texture | null }, uRes: { value: new THREE.Vector2(1, 1) }, uThresh: { value: 0.75 } };
  const uBlur = { tex: { value: null as THREE.Texture | null }, uRes: { value: new THREE.Vector2(1, 1) }, uDir: { value: new THREE.Vector2(1, 0) } };
  const uComp = { tex: { value: null as THREE.Texture | null }, bloom: { value: null as THREE.Texture | null }, uRes: { value: new THREE.Vector2(1, 1) }, uBloom: { value: 0.9 }, uExposure: { value: 0.72 } };

  const mats = { bh: mk(BH_FRAG, uBH), bright: mk(BRIGHT_FRAG, uBright), blur: mk(BLUR_FRAG, uBlur), comp: mk(COMP_FRAG, uComp) };
  const scene = new THREE.Scene();
  const mesh = new THREE.Mesh(quad, mats.bh);
  mesh.frustumCulled = false;
  scene.add(mesh);

  const rtOpts: THREE.RenderTargetOptions = { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false, stencilBuffer: false };
  let rtScene = new THREE.WebGLRenderTarget(1, 1, rtOpts);
  let rtA = new THREE.WebGLRenderTarget(1, 1, rtOpts);
  let rtB = new THREE.WebGLRenderTarget(1, 1, rtOpts);

  const state = { scroll: 0, mouse: { x: 0, y: 0 }, active: false };
  const smooth = { scroll: 0, mx: 0, my: 0 };
  let portrait = false;

  function resize() {
    const w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
    renderer.setPixelRatio(1);
    renderer.setSize(Math.round(w * dpr), Math.round(h * dpr), false);
    const sw = Math.max(2, Math.round(w * dpr * sceneScale)), sh = Math.max(2, Math.round(h * dpr * sceneScale));
    const bw = Math.max(2, Math.round(w * dpr * bloomScale)), bh = Math.max(2, Math.round(h * dpr * bloomScale));
    rtScene.setSize(sw, sh); rtA.setSize(bw, bh); rtB.setSize(bw, bh);
    uBH.uRes.value.set(sw, sh); uBH.uFov.value = 3.2 * Math.max(1, (h / w) * 0.9); portrait = h > w; uBright.uRes.value.set(bw, bh); uBlur.uRes.value.set(bw, bh); uComp.uRes.value.set(Math.round(w * dpr), Math.round(h * dpr));
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const clock = new THREE.Clock();
  let raf = 0, running = true, lastFrame = 0;
  const pass = (m: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null) => { mesh.material = m; renderer.setRenderTarget(target); renderer.render(scene, cam); };

  function frame(now: number) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (!state.active) return;
    if (now - lastFrame < 1000 / 60) return;
    lastFrame = now;
    const t = clock.getElapsedTime();
    // smoothing
    smooth.scroll += (state.scroll - smooth.scroll) * 0.06;
    smooth.mx += (state.mouse.x - smooth.mx) * 0.05;
    smooth.my += (state.mouse.y - smooth.my) * 0.05;
    // camera orbit: from above (hero) down to nearly edge-on; mouse yaws/pitches a little
    const s = smooth.scroll;
    const elev = 0.58 - s * 0.44 - smooth.my * 0.07;
    const yaw = 0.35 + smooth.mx * 0.18 + t * 0.01;
    const dist = 40.0 - s * 10.0;
    uBH.uCam.value.set(Math.cos(elev) * Math.sin(yaw) * dist, Math.sin(elev) * dist, Math.cos(elev) * Math.cos(yaw) * dist);
    uBH.uOffset.value = (0.14 - s * 0.12) * (portrait ? 0.25 : 1);
    uBH.uTime.value = t;

    pass(mats.bh, rtScene);
    uBright.tex.value = rtScene.texture; pass(mats.bright, rtA);
    for (let i = 0; i < 2; i++) {
      uBlur.tex.value = rtA.texture; uBlur.uDir.value.set(1, 0); pass(mats.blur, rtB);
      uBlur.tex.value = rtB.texture; uBlur.uDir.value.set(0, 1); pass(mats.blur, rtA);
    }
    uComp.tex.value = rtScene.texture; uComp.bloom.value = rtA.texture; pass(mats.comp, null);
  }
  raf = requestAnimationFrame(frame);

  return {
    setState: (s) => { state.scroll = s.scroll; state.mouse = s.mouse; state.active = s.active; },
    dispose: () => {
      running = false; cancelAnimationFrame(raf); ro.disconnect();
      [rtScene, rtA, rtB].forEach((r) => r.dispose()); quad.dispose(); Object.values(mats).forEach((m) => m.dispose()); renderer.dispose();
    },
  };
}

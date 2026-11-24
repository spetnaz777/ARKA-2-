/* Hero signature: a point-cloud moon that assembles from scattered data,
   resolves into the photoreal NASA moon, with two orbit rings of particles
   flowing around it. Plain WebGL1, ~3 KB gz, no libraries.
   Lazy-loaded after first paint; never runs under reduced motion, Save-Data
   or on low-power devices (the static moon is the fallback). Pauses when
   off-screen or when the tab is hidden. Reacts to cursor (--mx/--my on the
   hero) and scroll (--p on the scene). */

const VS = `
attribute vec3 aPos; attribute vec3 aSeed; attribute float aKind;
uniform float uT, uRot, uTiltX, uTiltY, uAsm, uAspect, uScale, uTime;
varying float vA; varying float vRing;
mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s, 0.,1.,0., s,0.,c);}
mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0., 0.,c,s, 0.,-s,c);}
void main(){
  vec3 p; vRing = step(0.5, aKind);
  if (aKind < 0.5) {
    // sphere point; assembles from a scattered seed
    vec3 scatter = aPos * (1.8 + aSeed.x * 1.6) + (aSeed - 0.5) * 1.2;
    float k = smoothstep(0., 1., clamp(uAsm * 1.25 - aSeed.y * 0.25, 0., 1.));
    p = mix(scatter, aPos, k);
    p = rx(uTiltX) * ry(uRot + uTiltY) * p;
    vA = (0.28 + 0.72 * smoothstep(-0.3, 0.9, p.z)) * k;
  } else {
    // orbit particle: angle flows with time
    float ring = step(1.5, aKind);
    float a = aPos.x + uTime * (0.10 + aSeed.x * 0.05) * (ring > 0.5 ? -1. : 1.);
    float r = ring > 0.5 ? 1.34 : 1.16;
    p = vec3(cos(a) * r, sin(a) * r * 0.05, sin(a) * r);
    p = rx(ring > 0.5 ? 0.42 : 0.18) * p;
    p = rx(uTiltX * 0.6) * ry(uTiltY * 0.6) * p;
    vA = (0.35 + 0.65 * smoothstep(-0.6, 0.8, p.z)) * smoothstep(0.4, 1.0, uAsm) * (0.55 + aSeed.y * 0.45);
  }
  float persp = 2.6 / (3.2 - p.z);
  gl_Position = vec4(p.x * persp * uScale / uAspect, p.y * persp * uScale, 0., 1.);
  gl_PointSize = (aKind < 0.5 ? 2.1 : 2.0) * persp * uT;
}`;
const FS = `
precision mediump float; varying float vA; varying float vRing; uniform float uFade;
void main(){ vec2 c = gl_PointCoord - .5; float d = dot(c,c); if (d > .25) discard;
  gl_FragColor = vec4(vec3(0.93,0.95,1.0), vA * mix(uFade, 1.0, vRing) * smoothstep(.25,.0,d)); }`;

export function startHeroGL(canvas: HTMLCanvasElement, hero: HTMLElement, scene: HTMLElement, assemble = true): () => void {
  const ctx = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: "low-power" });
  if (!ctx) return () => {};
  const gl: WebGLRenderingContext = ctx;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return () => {};
  gl.useProgram(prog);

  // geometry: fibonacci sphere + two orbit rings (deterministic seeds)
  const N = 2600, R1 = 420, R2 = 300, T = N + R1 + R2;
  const pos = new Float32Array(T * 3), seed = new Float32Array(T * 3), kind = new Float32Array(T);
  let s = 1337;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i;
    pos.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3);
    seed.set([rnd(), rnd(), rnd()], i * 3);
  }
  for (let i = 0; i < R1 + R2; i++) {
    const j = N + i;
    pos.set([rnd() * Math.PI * 2, 0, 0], j * 3);
    seed.set([rnd(), rnd(), rnd()], j * 3);
    kind[j] = i < R1 ? 1 : 2;
  }
  const buf = (data: Float32Array, name: string, size: number) => {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  };
  buf(pos, "aPos", 3);
  buf(seed, "aSeed", 3);
  buf(kind, "aKind", 1);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = { T: U("uT"), Rot: U("uRot"), TiltX: U("uTiltX"), TiltY: U("uTiltY"), Asm: U("uAsm"), Aspect: U("uAspect"), Scale: U("uScale"), Time: U("uTime"), Fade: U("uFade") };
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  let dpr = 1, w = 0, h = 0;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  let visible = true, raf = 0, start = -1, last = performance.now(), time = 0, rot = 0;
  const html = document.documentElement;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(frame);
  });
  io.observe(canvas);
  const onVis = () => { if (!document.hidden && visible && !raf) raf = requestAnimationFrame(frame); };
  document.addEventListener("visibilitychange", onVis);

  function frame(now: number) {
    raf = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    if (start < 0 && !html.classList.contains("intro-pending")) start = now;
    const t = start < 0 ? 0 : (now - start) / 1000;
    const asm = !assemble || html.classList.contains("intro-skip") ? 1 : Math.min(1, t / 1.6);
    if (t > 1.25) hero.classList.add("gl-resolved");
    // inline custom props (set by the parallax / scene hooks): reading them from
    // getComputedStyle every frame forced a full style recalc and caused stutter
    const mx = parseFloat(hero.style.getPropertyValue("--mx")) || 0;
    const my = parseFloat(hero.style.getPropertyValue("--my")) || 0;
    const p = parseFloat(scene.style.getPropertyValue("--p")) || 0;
    rot += dt * 0.12;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(u.T, dpr);
    gl.uniform1f(u.Rot, rot + p * 2.2);
    gl.uniform1f(u.TiltX, 0.22 + my * 0.16);
    gl.uniform1f(u.TiltY, mx * 0.22);
    gl.uniform1f(u.Asm, asm);
    gl.uniform1f(u.Aspect, w / Math.max(1, h));
    gl.uniform1f(u.Scale, 0.62);
    gl.uniform1f(u.Time, time);
    // the cloud fades back once the photoreal moon has resolved, rings stay
    gl.uniform1f(u.Fade, assemble ? 1.0 - 0.55 * Math.min(1, Math.max(0, (t - 1.2) / 1.2)) : 0.45 * Math.min(1, t / 1.2));
    gl.drawArrays(gl.POINTS, 0, T);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVis);
  };
}

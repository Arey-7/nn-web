"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Program,
  Mesh,
  Texture,
  Raycast,
  Vec2,
  Vec3,
  Mat4,
} from "ogl";
import { PRINT_INDEX, accentVars, type Campaign } from "../content/work";
import { scrollState } from "../lib/smooth-scroll";

const SPACING = 3.4; // gap between planes along Z
const NEAR = 4.5; // planes past this have gone by the camera

// Fewer planes and a lower pixel ratio on a phone — the corridor reads the
// same at this scale and the render loop costs a fraction of the battery.
const settings = () => {
  const small = window.innerWidth < 768;
  return { count: small ? 10 : 18, dpr: Math.min(window.devicePixelRatio, small ? 1.5 : 2) };
};

// GLSL 3.00 ES — `#version` must be the very first characters in the source,
// so these strings deliberately start flush against the backtick.
const vertex = /* glsl */ `#version 300 es
in vec3 position;
in vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uVelocity;
out vec2 vUv;

void main() {
  vUv = uv;
  vec3 p = position;
  // The sheet bows as you scroll, like paper pulled through a press.
  p.z += sin(p.x * 3.14159) * uVelocity * 0.45;
  p.z += sin(p.y * 2.0 + uTime * 0.4) * 0.03;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragment = /* glsl */ `#version 300 es
precision highp float;
uniform sampler2D tMap;
uniform float uFade;
uniform float uColour;
uniform float uVelocity;
uniform float uHover;
uniform float uDim;
in vec2 vUv;
out vec4 fragColor;

void main() {
  // Channel split scaled by scroll speed.
  float a = clamp(uVelocity, -1.0, 1.0) * 0.012;
  vec3 c;
  c.r = texture(tMap, vUv + vec2(a, 0.0)).r;
  c.g = texture(tMap, vUv).g;
  c.b = texture(tMap, vUv - vec2(a, 0.0)).b;

  // Distant work is grey; it regains its colour as it reaches the reader, and
  // a tile under the pointer comes fully forward wherever it happens to be.
  float grey = dot(c, vec3(0.299, 0.587, 0.114));
  c = mix(vec3(grey), c, max(uColour, uHover));

  // A hovered tile lifts; everything else steps back so the target is
  // unambiguous before the reader commits to a click.
  c += uHover * 0.05;
  fragColor = vec4(c, uFade * (1.0 - uDim * 0.55) * (1.0 + uHover * 0.25));
}
`;

const wrap = (z: number, depth: number) => {
  let v = z;
  while (v > NEAR) v -= depth;
  while (v < NEAR - depth) v += depth;
  return v;
};

/** Everything the corridor hangs off a plane beyond what OGL puts there. */
type Tile = Mesh & {
  baseZ: number;
  baseW: number;
  baseH: number;
  ready: boolean;
  hover: number;
  campaign: Campaign;
  alt: string;
};

type Hover = { campaign: Campaign; alt: string } | null;

type Props = { onReady?: () => void; onUnsupported?: () => void };

export default function HeroCanvas({ onReady, onUnsupported }: Props) {
  const holder = useRef<HTMLDivElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  // Picking is a pointer affordance, so it is only wired up for pointers that
  // can hover. On touch there is no way to show a target before committing to
  // it, and a stray tap during a scroll would hijack the page.
  const [interactive, setInteractive] = useState(false);
  const [hover, setHover] = useState<Hover>(null);

  useEffect(() => {
    const node = holder.current;
    if (!node) return;

    const bail = () => {
      setFailed(true);
      onUnsupported?.();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bail();
      return;
    }

    const { count: COUNT, dpr } = settings();
    const DEPTH = COUNT * SPACING;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: true, antialias: false, dpr });
    } catch {
      bail();
      return;
    }

    const gl = renderer.gl;
    // The shaders are GLSL 3.00; OGL silently falls back to a WebGL1 context
    // when WebGL2 is unavailable, and those would not compile.
    if (!gl || !renderer.isWebgl2) {
      bail();
      return;
    }
    gl.clearColor(0, 0, 0, 0);
    node.appendChild(gl.canvas);
    gl.canvas.style.cssText = "width:100%;height:100%;display:block";

    const camera = new Camera(gl, { fov: 42, near: 0.1, far: DEPTH + 20 });
    const scene = new Transform();
    const geometry = new Plane(gl, { widthSegments: 20, heightSegments: 20 });

    const picks = Array.from(
      { length: COUNT },
      (_, i) => PRINT_INDEX[i % PRINT_INDEX.length]
    );

    const meshes = picks.map(({ piece, campaign }, i) => {
      // WebGL2 handles mipmaps on non-power-of-two textures, which these are.
      // They matter here: planes shrink a long way into the distance and
      // shimmer badly when minified without them.
      const texture = new Texture(gl, {
        generateMipmaps: true,
        minFilter: gl.LINEAR_MIPMAP_LINEAR,
        magFilter: gl.LINEAR,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
      });
      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          tMap: { value: texture },
          uTime: { value: 0 },
          uFade: { value: 0 },
          uColour: { value: 0 },
          uVelocity: { value: 0 },
          uHover: { value: 0 },
          uDim: { value: 0 },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });

      const mesh = new Mesh(gl, { geometry, program }) as Tile;
      mesh.setParent(scene);
      mesh.campaign = campaign;
      mesh.alt = piece.alt;
      mesh.ready = false;
      mesh.hover = 0;
      mesh.baseW = 1;
      mesh.baseH = 1;

      // A ring rather than a scatter: the work streams past around the edges
      // of the frame and leaves the middle clear for the headline.
      const angle = i * 2.39996;
      const radius = 3.5 + (i % 4) * 0.5;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = Math.sin(angle) * radius * 0.58;
      mesh.baseZ = -i * SPACING;
      mesh.rotation.z = Math.cos(angle) * 0.07;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = piece.tile;
      // decode() keeps the JPEG off the main thread, and the stagger spreads
      // eighteen texture uploads over a few frames instead of stalling one.
      img
        .decode()
        .then(
          () =>
            new Promise<void>((done) =>
              setTimeout(() => {
                texture.image = img;
                const h = 2.4;
                mesh.baseH = h;
                mesh.baseW = (h * img.naturalWidth) / img.naturalHeight;
                mesh.scale.set(mesh.baseW, mesh.baseH, 1);
                // Only a tile that has something on it can be picked.
                mesh.ready = true;
                done();
              }, i * 40)
            )
        )
        .catch(() => {});

      return mesh;
    });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = node;
      renderer.setSize(w, h);
      camera.perspective({ aspect: w / h });
    };
    resize();
    window.addEventListener("resize", resize);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, cx: -1, cy: -1, moved: false };
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.cx = e.clientX;
      pointer.cy = e.clientY;
      pointer.moved = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // ---- picking -------------------------------------------------------
    // The planes are flat quads, so rather than testing 800 triangles apiece
    // the ray is pushed into each tile's own space and met with z = 0. That is
    // exact for a quad and cheap enough to run every frame the pointer moves.
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const raycast = new Raycast();
    const ndc = new Vec2();
    const inv = new Mat4();
    const rayO = new Vec3();
    const rayD = new Vec3();
    let picked: Tile | null = null;

    const pickAt = (clientX: number, clientY: number): Tile | null => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      ndc.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -(((clientY - rect.top) / rect.height) * 2 - 1)
      );
      raycast.castMouse(camera, ndc);

      let best: Tile | null = null;
      let bestT = Infinity;
      for (const mesh of meshes) {
        // A tile that has faded out is not there as far as the reader is
        // concerned, so it must not be there for the pointer either.
        if (!mesh.ready || mesh.program.uniforms.uFade.value < 0.25) continue;

        inv.inverse(mesh.worldMatrix);
        rayO.copy(raycast.origin).applyMatrix4(inv);
        rayD.copy(raycast.direction).transformDirection(inv);
        if (Math.abs(rayD.z) < 1e-6) continue;

        const t = -rayO.z / rayD.z;
        if (t <= 0 || t >= bestT) continue;

        // Plane geometry is a unit quad about the origin; the scale that sizes
        // it to the artwork is already in the matrix.
        const hx = rayO.x + rayD.x * t;
        const hy = rayO.y + rayD.y * t;
        if (Math.abs(hx) > 0.5 || Math.abs(hy) > 0.5) continue;

        best = mesh;
        bestT = t;
      }
      return best;
    };

    const applyPick = (next: Tile | null) => {
      if (next === picked) return;
      picked = next;
      gl.canvas.style.cursor = next ? "pointer" : "";
      node.dataset.hovering = next ? "true" : "false";
      setHover(next ? { campaign: next.campaign, alt: next.alt } : null);
      // Warm the route while the reader is still deciding.
      if (next) router.prefetch(`/projects/${next.campaign.slug}`);
    };

    const onClick = (e: MouseEvent) => {
      if (!canHover.matches) return;
      const hit = pickAt(e.clientX, e.clientY);
      if (hit) router.push(`/projects/${hit.campaign.slug}`);
    };

    const onLeave = () => applyPick(null);

    const syncHover = () => setInteractive(canHover.matches);
    syncHover();
    canHover.addEventListener("change", syncHover);
    node.addEventListener("click", onClick);
    window.addEventListener("blur", onLeave);
    document.addEventListener("pointerleave", onLeave);

    // The caption trails the pointer rather than sitting on it, and is kept
    // clear of the viewport edges so it never opens off screen.
    const placeCaption = () => {
      const el = caption.current;
      if (!el) return;
      const w = el.offsetWidth || 300;
      const h = el.offsetHeight || 120;
      const x = Math.min(Math.max(pointer.cx + 26, 12), window.innerWidth - w - 12);
      const y = Math.min(Math.max(pointer.cy + 22, 12), window.innerHeight - h - 12);
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    // Only burn frames while the hero is actually on screen. Dropping the pick
    // on the way out matters as much as stopping the loop: the render loop is
    // what clears a hover, so scrolling away mid-hover would otherwise leave
    // the caption stranded over the rest of the page.
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) applyPick(null);
      },
      { threshold: 0 }
    );
    io.observe(node);

    let frame = 0;
    let travel = 0;
    let smoothVelocity = 0;
    const start = performance.now();

    const render = () => {
      frame = requestAnimationFrame(render);
      if (!visible) return;

      const time = (performance.now() - start) / 1000;
      const raw = scrollState.velocity || 0;
      smoothVelocity += (raw * 0.06 - smoothVelocity) * 0.08;

      // Constant drift, plus whatever the reader adds by scrolling.
      travel += 0.012 + raw * 0.004;

      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;
      scene.rotation.y = -pointer.x * 0.12;
      scene.rotation.x = pointer.y * 0.08;

      for (const mesh of meshes) {
        const z = wrap(mesh.baseZ + travel, DEPTH);
        mesh.position.z = z;

        // Fade in from the far plane, and out as it sweeps past the camera.
        const depth = (NEAR - z) / DEPTH; // 0 near .. 1 far
        const fadeFar = 1 - Math.pow(Math.max(0, depth - 0.55) / 0.45, 1.6);
        const fadeNear = Math.min(1, Math.max(0, (NEAR - z) / 3.2));
        const u = mesh.program.uniforms;
        u.uFade.value = Math.max(0, Math.min(1, fadeFar)) * fadeNear;
        u.uColour.value = Math.max(0, 1 - depth * 2.1);
        u.uTime.value = time;
        u.uVelocity.value = smoothVelocity;
      }

      // Matrices have to be current before the ray is cast against them, or
      // the pointer tests a frame that is no longer on screen.
      scene.updateMatrixWorld();

      if (canHover.matches && pointer.moved) {
        pointer.moved = false;
        applyPick(pickAt(pointer.cx, pointer.cy));
      }

      for (const mesh of meshes) {
        const want = mesh === picked ? 1 : 0;
        mesh.hover += (want - mesh.hover) * 0.14;
        if (mesh.hover < 0.001) mesh.hover = 0;
        const u = mesh.program.uniforms;
        u.uHover.value = mesh.hover;
        u.uDim.value = picked && mesh !== picked ? 1 - mesh.hover : 0;
        if (mesh.ready) {
          const pop = 1 + mesh.hover * 0.05;
          mesh.scale.set(mesh.baseW * pop, mesh.baseH * pop, 1);
        }
      }

      if (picked) placeCaption();

      renderer.render({ scene, camera });
    };

    render();
    onReady?.();

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      canHover.removeEventListener("change", syncHover);
      node.removeEventListener("click", onClick);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("pointerleave", onLeave);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [onReady, onUnsupported, router]);

  if (failed) return null;

  return (
    <>
      <div
        ref={holder}
        aria-hidden="true"
        data-webgl="hero"
        className={`absolute inset-0 -z-10 ${
          interactive ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />

      {/* The corridor is decorative to assistive tech — every campaign in it is
          reachable through Selected work and /projects — so the caption is
          hidden too rather than announcing a target only a mouse can reach. */}
      <div
        ref={caption}
        aria-hidden="true"
        style={hover ? accentVars(hover.campaign) : undefined}
        className={`pointer-events-none fixed left-0 top-0 z-95 w-76 border border-line bg-paper-raised/95 p-5 backdrop-blur-sm transition-opacity duration-300 ${
          hover ? "opacity-100" : "opacity-0"
        }`}
      >
        {hover && (
          <>
            <div className="flex items-center gap-3">
              <span className="ca-bg h-px w-8" />
              <span className="text-label ca-text">
                {hover.campaign.discipline}
                {hover.campaign.year ? ` · ${hover.campaign.year}` : ""}
              </span>
            </div>
            <p className="mt-4 text-label text-ink-muted">
              {hover.campaign.client}
            </p>
            <p className="mt-2 text-display text-2xl leading-tight text-ink">
              {hover.campaign.headline}
            </p>
            <p className="mt-4 text-label text-ink-faint">
              Click to open the case study
            </p>
          </>
        )}
      </div>
    </>
  );
}

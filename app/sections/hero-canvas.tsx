"use client";

import { useEffect, useRef, useState } from "react";
import { Renderer, Camera, Transform, Plane, Program, Mesh, Texture } from "ogl";
import { ALL_PRINT } from "../content/work";
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
in vec2 vUv;
out vec4 fragColor;

void main() {
  // Channel split scaled by scroll speed.
  float a = clamp(uVelocity, -1.0, 1.0) * 0.012;
  vec3 c;
  c.r = texture(tMap, vUv + vec2(a, 0.0)).r;
  c.g = texture(tMap, vUv).g;
  c.b = texture(tMap, vUv - vec2(a, 0.0)).b;

  // Distant work is grey; it regains its colour as it reaches the reader.
  float grey = dot(c, vec3(0.299, 0.587, 0.114));
  c = mix(vec3(grey), c, uColour);

  fragColor = vec4(c, uFade);
}
`;

const wrap = (z: number, depth: number) => {
  let v = z;
  while (v > NEAR) v -= depth;
  while (v < NEAR - depth) v += depth;
  return v;
};

type Props = { onReady?: () => void; onUnsupported?: () => void };

export default function HeroCanvas({ onReady, onUnsupported }: Props) {
  const holder = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

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
      (_, i) => ALL_PRINT[i % ALL_PRINT.length]
    );

    const meshes = picks.map((piece, i) => {
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
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });

      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);

      // A ring rather than a scatter: the work streams past around the edges
      // of the frame and leaves the middle clear for the headline.
      const angle = i * 2.39996;
      const radius = 3.5 + (i % 4) * 0.5;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.y = Math.sin(angle) * radius * 0.58;
      (mesh as unknown as { baseZ: number }).baseZ = -i * SPACING;
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
                mesh.scale.set((h * img.naturalWidth) / img.naturalHeight, h, 1);
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

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Only burn frames while the hero is actually on screen.
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => (visible = entry.isIntersecting),
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
        const base = (mesh as unknown as { baseZ: number }).baseZ;
        const z = wrap(base + travel, DEPTH);
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

      renderer.render({ scene, camera });
    };

    render();
    onReady?.();

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [onReady, onUnsupported]);

  if (failed) return null;

  return (
    <div
      ref={holder}
      aria-hidden="true"
      data-webgl="hero"
      className="pointer-events-none absolute inset-0 -z-10"
    />
  );
}

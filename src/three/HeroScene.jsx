import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import Gem from "./Gem.jsx";
import Studio from "./Studio.jsx";

const FONT = "/fonts/ArchivoExpanded-Black.ttf";
const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const expoOut = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const smooth = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };

// Pinned-scroll choreography, p in 0..1:
//   0 → 0.75  the crystal travels along the wordmark row, refracting each letter
//   0.75 → 1  word and crystal lift away together, handing over to the next section
const PASS_END = 0.75;
const WORD_Z = -1.6;

function useLayout() {
  const { viewport, camera } = useThree();
  const vp = viewport.getCurrentViewport(camera, [0, 0, WORD_Z]);
  const mobile = vp.width < vp.height;
  return { vp, mobile, rowY: vp.height * (mobile ? 0.25 : 0.2) };
}

function Wordmark({ progress }) {
  const ref = useRef();
  const { vp, mobile, rowY } = useLayout();
  const [scale, setScale] = useState(0);

  // Fit the word to the frame once troika has measured it.
  const fit = (text) => {
    const [x0, y0, x1, y1] = text.textRenderInfo.blockBounds;
    const s = Math.min((vp.width * (mobile ? 0.9 : 0.88)) / (x1 - x0), (vp.height * 0.36) / ((y1 - y0) * 0.78));
    setScale(s);
  };

  useFrame(() => {
    if (!ref.current) return;
    const out = smooth(PASS_END, 1, progress.current);
    ref.current.position.y = rowY + out * vp.height * 0.25;
    ref.current.fillOpacity = 1 - out;
  });

  return (
    <Text
      ref={ref}
      font={FONT}
      fontSize={1}
      scale={scale}
      letterSpacing={-0.02}
      position={[0, rowY, WORD_Z]}
      color="#edebe6"
      material-toneMapped={false}
      anchorX="center"
      anchorY="middle"
      onSync={fit}
      key={`${vp.width.toFixed(2)}x${vp.height.toFixed(2)}`}
    >
      LUMEN
    </Text>
  );
}

function Crystal({ progress }) {
  const group = useRef();
  const gem = useRef();
  const start = useRef(null);
  const { viewport } = useThree();
  const { vp, mobile, rowY } = useLayout();

  useFrame((state, dt) => {
    if (start.current === null) start.current = state.clock.elapsedTime;
    const intro = expoOut(Math.min((state.clock.elapsedTime - start.current) / 2.2, 1));
    const p = progress.current;
    const pass = smooth(0, PASS_END, p);
    const fly = smooth(PASS_END, 1, p);
    const k = reduced ? 0.15 : 1;
    const px = reduced ? 0 : state.pointer.x;
    const py = reduced ? 0 : state.pointer.y;

    // Glide from the right of the word to its left, then rise out of frame.
    const startX = vp.width * (mobile ? 0.18 : 0.2);
    const endX = -vp.width * (mobile ? 0.22 : 0.36);
    const rowAtZero = rowY * (6 / (6 - WORD_Z));
    const follow = 1 - fly;
    const tx = (THREE.MathUtils.lerp(startX, endX, pass) * (6 / (6 - WORD_Z)) + px * viewport.width * 0.22) * follow;
    const ty = (rowAtZero + py * viewport.height * 0.14) * follow + fly * viewport.height * 0.75;
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, tx, 2.5, dt);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, ty, 2.5, dt);
    group.current.position.z = 0.4 + fly * 1.4;

    gem.current.rotation.y += dt * (0.22 + pass * 0.6) * k;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.42 - py * 0.35 + fly * 1.1, 4, dt);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -0.18 + px * 0.25 + pass * 0.4, 4, dt);

    const size = Math.min(viewport.height * 0.19, mobile ? 0.34 : 0.9);
    group.current.scale.setScalar(size * (0.35 + 0.65 * intro));
    gem.current.rotation.x = (1 - intro) * -2.4;
  });

  return (
    <group ref={group}>
      <group ref={gem}>
        <Gem quality={mobile ? "low" : "high"} />
      </group>
    </group>
  );
}

export default function HeroScene() {
  const wrap = useRef();
  const progress = useRef(0);
  const [visible, setVisible] = useState(true);
  const [mobile] = useState(() => innerWidth < 760);

  useEffect(() => {
    const track = wrap.current.closest(".hero-track");
    const hero = wrap.current.closest(".hero");
    const onScroll = () => {
      const r = track.getBoundingClientRect();
      const range = Math.max(r.height - innerHeight, 1);
      const p = clamp01(-r.top / range);
      progress.current = p;
      hero.style.setProperty("--p", p.toFixed(4));
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(wrap.current);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); io.disconnect(); };
  }, []);

  return (
    <div className="hero-canvas" ref={wrap} aria-hidden="true">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={mobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#0b0b0c"]} />
        <Suspense fallback={null}>
          <Wordmark progress={progress} />
          <Crystal progress={progress} />
          <Studio />
        </Suspense>
      </Canvas>
    </div>
  );
}

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Gem from "./Gem.jsx";
import Studio from "./Studio.jsx";

const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// Thin light bars behind the glass: refraction splits them into spectra.
function LightBars() {
  const bars = [-1.1, -0.35, 0.4, 1.15];
  return bars.map((y, i) => (
    <mesh key={y} position={[3.2, y, -2.5]}>
      <planeGeometry args={[6.5, i % 2 ? 0.025 : 0.06]} />
      <meshBasicMaterial color="#edebe6" toneMapped={false} />
    </mesh>
  ));
}

function Cluster() {
  const g = useRef();
  const wide = useThree((st) => st.viewport.width > 6);
  const gems = [
    { p: [-0.9, 0.2, 0], s: 0.9, r: [0.5, 0, 0.2] },
    { p: [0.9, -0.35, 0.4], s: 0.6, r: [-0.4, 0, -0.3] },
    { p: [0.3, 0.95, -0.6], s: 0.38, r: [0.9, 0, 0.5] },
  ];
  const refs = useRef([]);
  useFrame((state, dt) => {
    const k = reduced ? 0.1 : 1;
    g.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25 * k) * 0.35 + state.pointer.x * 0.3 * k;
    g.current.rotation.x = -state.pointer.y * 0.2 * k;
    refs.current.forEach((m, i) => m && (m.rotation.y += dt * (0.3 + i * 0.15) * k));
  });
  return (
    <group ref={g} position={[wide ? 2.3 : 0.6, wide ? 0 : -0.6, 0]} scale={wide ? 1 : 0.7}>
      {gems.map((d, i) => (
        <group key={i} position={d.p} rotation={d.r} scale={d.s} ref={(el) => (refs.current[i] = el)}>
          <Gem quality="low" segments={10} />
        </group>
      ))}
    </group>
  );
}

export default function CtaScene() {
  const wrap = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);
  return (
    <div className="cta-canvas" ref={wrap} aria-hidden="true">
      {visible && (
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 35 }}>
          <color attach="background" args={["#0b0b0c"]} />
          <Suspense fallback={null}>
            <LightBars />
            <Cluster />
            <Studio />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import Gem, { GlassMaterial, makeDiamondGeometry } from "./Gem.jsx";
import Studio from "./Studio.jsx";
import { WebPane, Knot, AdStack, Backdrop } from "./ServicesScene.jsx";

const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const FLARE = "#ff5a1f";

// Small solid crystals: metal-bright facets without the cost of real refraction.
function Shard({ accent, ...props }) {
  const geo = useMemo(() => makeDiamondGeometry(8), []);
  return (
    <mesh geometry={geo} {...props}>
      {accent
        ? <meshStandardMaterial color={FLARE} emissive="#ff4a10" emissiveIntensity={1.2} roughness={0.25} flatShading toneMapped={false} />
        : <meshStandardMaterial color="#c9c5bd" metalness={0.6} roughness={0.08} envMapIntensity={1.6} flatShading />}
    </mesh>
  );
}

// Pricing: one glass diamond held above a stack of smaller solid ones.
function Stack({ quality }) {
  return (
    <group>
      <group position={[0, 0.55, 0]} scale={0.95}><Gem quality={quality} /></group>
      <Shard position={[-0.75, -0.75, 0.2]} scale={0.42} rotation={[0.3, 0, 0.4]} />
      <Shard position={[0.7, -0.85, -0.1]} scale={0.36} rotation={[-0.2, 0.5, -0.3]} accent />
      <Shard position={[0.05, -1.15, 0.4]} scale={0.28} rotation={[0.6, 0.2, 0.1]} />
    </group>
  );
}

// Process: a glass ring with four steps, as crystals, travelling around it.
function Orbit({ quality }) {
  const ring = useMemo(() => new THREE.TorusGeometry(1.25, 0.09, 24, 120), []);
  const steps = useRef();
  useFrame((_, dt) => { if (!reduced) steps.current.rotation.z += dt * 0.35; });
  return (
    <group rotation={[0.9, 0.2, 0]}>
      <mesh geometry={ring}><GlassMaterial quality={quality} thickness={0.4} /></mesh>
      <group ref={steps}>
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2;
          return <Shard key={i} position={[Math.cos(a) * 1.25, Math.sin(a) * 1.25, 0]} scale={0.24} rotation={[a, 0.4, 0]} accent={i === 3} />;
        })}
      </group>
    </group>
  );
}

// Questions: a glass halo around one solid crystal.
function Halo({ quality }) {
  const torus = useMemo(() => new THREE.TorusGeometry(1.1, 0.32, 32, 96), []);
  return (
    <group>
      <mesh geometry={torus} rotation={[0.5, 0.3, 0]}><GlassMaterial quality={quality} thickness={1} /></mesh>
      <Shard scale={0.45} rotation={[0.4, 0, 0.2]} accent />
    </group>
  );
}

function Contact({ quality }) {
  return <group scale={1.15}><Gem quality={quality} /></group>;
}

const SCENES = { ideas: WebPane, services: Knot, ads: AdStack, price: Stack, process: Orbit, faq: Halo, contact: Contact };

// Turns slowly, floats, and leans toward the pointer; scales in once on arrival.
function Stage({ variant, quality }) {
  const g = useRef();
  const intro = useRef(0);
  const fit = useThree((st) => Math.min(st.viewport.width / 3.4, st.viewport.height / 3, 1.2));
  const Obj = SCENES[variant] || Contact;
  useFrame((state, dt) => {
    intro.current = THREE.MathUtils.damp(intro.current, 1, 2.5, dt);
    const k = reduced ? 0 : 1;
    const t = state.clock.elapsedTime;
    g.current.scale.setScalar(fit * (0.6 + 0.4 * intro.current));
    g.current.rotation.y = (1 - intro.current) * -1.5 + Math.sin(t * 0.3) * 0.35 * k + state.pointer.x * 0.35 * k;
    g.current.rotation.x = -state.pointer.y * 0.2 * k;
    g.current.position.y = Math.sin(t * 0.8) * 0.08 * k;
  });
  return <group ref={g}><Obj quality={quality} /></group>;
}

export default function PageScene({ variant }) {
  const wrap = useRef();
  const [visible, setVisible] = useState(true);
  const [mobile] = useState(() => innerWidth < 760);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);
  return (
    <div className="page-canvas" ref={wrap} aria-hidden="true">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={mobile ? [1, 1.25] : [1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#0b0b0c"]} />
        <Suspense fallback={null}>
          <Backdrop />
          <Stage variant={variant} quality="low" />
          {!reduced && <Sparkles count={mobile ? 16 : 30} scale={[5, 3.5, 2]} size={2.4} speed={0.25} opacity={0.6} color="#ffd2bd" />}
          <Studio />
        </Suspense>
      </Canvas>
    </div>
  );
}

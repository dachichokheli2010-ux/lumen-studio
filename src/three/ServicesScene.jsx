import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { GlassMaterial } from "./Gem.jsx";
import Studio from "./Studio.jsx";

const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const FLARE = "#ff5a1f";
const BONE = "#edebe6";

// Flat bone shapes; seen through glass they refract into a layout.
function Bar({ w, h, x = 0, y = 0, z = 0, color = BONE }) {
  return (
    <mesh position={[x, y, z]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

// 01 — a glass browser pane floating over a wireframe page.
function WebPane({ quality }) {
  return (
    <group rotation={[0.08, -0.32, 0.02]}>
      <group position={[0, 0, -0.35]}>
        <Bar w={2.3} h={0.04} y={0.66} />
        <Bar w={1.2} h={0.16} x={-0.52} y={0.3} />
        <Bar w={0.9} h={0.16} x={-0.67} y={0.06} />
        <Bar w={0.6} h={0.05} x={-0.82} y={-0.14} color="#9b978f" />
        {[-0.75, 0, 0.75].map((x) => <Bar key={x} w={0.62} h={0.42} x={x} y={-0.52} color="#3a3a3d" />)}
      </group>
      <RoundedBox args={[2.6, 1.7, 0.14]} radius={0.08} smoothness={4}>
        <GlassMaterial quality={quality} backside={false} thickness={0.2} envMapIntensity={0.55} chromaticAberration={0.35} anisotropicBlur={0.02} />
      </RoundedBox>
      <mesh position={[-0.7, -0.22, 0.11]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.07, 0.36, 6, 16]} />
        <meshBasicMaterial color={FLARE} toneMapped={false} />
      </mesh>
    </group>
  );
}

// 02 — a glass knot: continuous curvature shows off real-time refraction.
function Knot({ quality }) {
  const geo = useMemo(() => new THREE.TorusKnotGeometry(0.62, 0.22, 220, 36), []);
  return (
    <mesh geometry={geo} rotation={[0.4, 0, 0]}>
      <GlassMaterial quality={quality} thickness={1.1} />
    </mesh>
  );
}

// 03 — a fanned stack of story-format ads; the front one is the call to action.
function AdStack({ quality }) {
  const play = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.07, -0.09); s.lineTo(0.1, 0); s.lineTo(-0.07, 0.09); s.closePath();
    return new THREE.ShapeGeometry(s);
  }, []);
  return (
    <group>
      <RoundedBox args={[0.95, 1.7, 0.06]} radius={0.06} position={[-0.62, 0.1, -0.5]} rotation={[0, 0.25, 0.16]}>
        <GlassMaterial quality={quality} backside={false} thickness={0.3} envMapIntensity={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.95, 1.7, 0.06]} radius={0.06} position={[0.62, 0.05, -0.3]} rotation={[0, -0.25, -0.14]}>
        <GlassMaterial quality={quality} backside={false} thickness={0.3} envMapIntensity={0.6} />
      </RoundedBox>
      <group position={[0, -0.05, 0.15]} rotation={[0, 0, 0.02]}>
        <RoundedBox args={[0.98, 1.74, 0.06]} radius={0.06}>
          <meshPhysicalMaterial color={FLARE} roughness={0.28} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.2} />
        </RoundedBox>
        <group position={[0, 0, 0.035]}>
          <Bar w={0.62} h={0.09} x={-0.08} y={0.5} color="#0b0b0c" />
          <Bar w={0.44} h={0.09} x={-0.17} y={0.37} color="#0b0b0c" />
          <mesh position={[0, -0.02, 0]}>
            <circleGeometry args={[0.2, 40]} />
            <meshBasicMaterial color="#0b0b0c" toneMapped={false} />
          </mesh>
          <mesh geometry={play} position={[0.01, -0.02, 0.001]}>
            <meshBasicMaterial color={FLARE} toneMapped={false} />
          </mesh>
          <Bar w={0.7} h={0.16} y={-0.6} color={BONE} />
        </group>
      </group>
    </group>
  );
}

const OBJECTS = [WebPane, Knot, AdStack];

// Scales in on activation, out on exit; unmounted once hidden so idle glass costs nothing.
function Slot({ on, Obj, quality, onHidden }) {
  const g = useRef();
  const s = useRef(0);
  useFrame((state, dt) => {
    s.current = THREE.MathUtils.damp(s.current, on ? 1 : 0, on ? 4 : 7, dt);
    const e = s.current;
    g.current.scale.setScalar(Math.max(e, 0.0001));
    g.current.rotation.y = (1 - e) * (on ? -1.2 : 1.2) + (Obj === Knot && !reduced ? state.clock.elapsedTime * 0.25 : 0);
    g.current.position.y = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
    if (!on && e < 0.01) onHidden();
  });
  return <group ref={g}><Obj quality={quality} /></group>;
}

function Stage({ active, quality }) {
  const root = useRef();
  const fit = useThree((st) => Math.min(st.viewport.width / 3.3, st.viewport.height / 2.6, 1.15));
  const [mounted, setMounted] = useState(() => new Set([active]));
  useEffect(() => setMounted((m) => (m.has(active) ? m : new Set([...m, active]))), [active]);
  const hide = (i) => setMounted((m) => {
    if (!m.has(i)) return m;
    const n = new Set(m); n.delete(i); return n;
  });

  useFrame((state, dt) => {
    const k = reduced ? 0 : 1;
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, state.pointer.x * 0.35 * k, 3, dt);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -state.pointer.y * 0.2 * k, 3, dt);
  });

  return (
    <group ref={root} scale={fit}>
      {OBJECTS.map((Obj, i) => mounted.has(i) && (
        <Slot key={i} Obj={Obj} on={active === i} quality={quality} onHidden={() => hide(i)} />
      ))}
    </group>
  );
}

// Light bars behind the stage give the glass something to bend.
function Backdrop() {
  const ys = [-1.3, -0.55, 0.2, 0.95];
  return ys.map((y, i) => (
    <mesh key={y} position={[0, y, -2.6]}>
      <planeGeometry args={[12, i === 2 ? 0.05 : 0.02]} />
      <meshBasicMaterial color={i === 1 ? FLARE : BONE} toneMapped={false} transparent opacity={i === 1 ? 0.9 : 0.55} />
    </mesh>
  ));
}

export default function ServicesScene({ active }) {
  const wrap = useRef();
  const [visible, setVisible] = useState(false);
  const [mobile] = useState(() => innerWidth < 760);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);
  return (
    <div className="svc-canvas" ref={wrap} aria-hidden="true">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={mobile ? [1, 1.25] : [1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#0b0b0c"]} />
        <Suspense fallback={null}>
          <Backdrop />
          <Stage active={active} quality="low" />
          <Studio />
        </Suspense>
      </Canvas>
    </div>
  );
}

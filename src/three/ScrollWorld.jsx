import { Suspense, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { makeDiamondGeometry } from "./Gem.jsx";
import Studio from "./Studio.jsx";

const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const INK = "#0b0b0c";
const DEPTH = 140; // length of the tunnel the camera travels down
const RINGS = 7;

// Seeded so the world is the same on every visit.
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Crystals keep clear of the tunnel's axis, so copy in the middle of the screen stays readable.
function makeCrystals(count, seed) {
  const r = rng(seed);
  return Array.from({ length: count }, () => {
    const a = r() * Math.PI * 2;
    const rad = 4 + r() * 7;
    return {
      p: new THREE.Vector3(Math.cos(a) * rad * 1.25, Math.sin(a) * rad * 0.75, 4 - r() * DEPTH),
      s: 0.12 + Math.pow(r(), 2.2) * 0.75,
      rot: new THREE.Euler(r() * 6, r() * 6, r() * 6),
      spin: (r() - 0.5) * 0.6,
      bob: r() * 6,
    };
  });
}

function Crystals({ count, seed, accent }) {
  const mesh = useRef();
  const geo = useMemo(() => makeDiamondGeometry(8), []);
  const items = useMemo(() => makeCrystals(count, seed), [count, seed]);
  const m = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    items.forEach((it, i) => {
      m.position.set(it.p.x, it.p.y + Math.sin(t * 0.4 + it.bob) * 0.25, it.p.z);
      m.rotation.set(it.rot.x + t * it.spin, it.rot.y + t * it.spin * 0.7, it.rot.z);
      m.scale.setScalar(it.s);
      m.updateMatrix();
      mesh.current.setMatrixAt(i, m.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geo, undefined, count]} frustumCulled={false}>
      {accent ? (
        <meshStandardMaterial color="#ff5a1f" emissive="#ff4a10" emissiveIntensity={1.3} roughness={0.25} metalness={0.2} flatShading toneMapped={false} />
      ) : (
        <meshStandardMaterial color="#b8b4ac" roughness={0.1} metalness={0.55} envMapIntensity={1.6} flatShading />
      )}
    </instancedMesh>
  );
}

// Thin light rings the camera passes through, one per stretch of the page.
function Rings() {
  const group = useRef();
  useFrame((_, dt) => {
    if (reduced) return;
    group.current.children.forEach((c, i) => { c.rotation.z += dt * (i % 2 ? 0.05 : -0.04); });
  });
  return (
    <group ref={group}>
      {Array.from({ length: RINGS }, (_, i) => (
        <mesh key={i} position={[0, 0, -12 - i * (DEPTH / RINGS)]} rotation={[0, 0, i * 0.7]}>
          <torusGeometry args={[i % 3 === 1 ? 5.4 : 6.2, i % 3 === 1 ? 0.014 : 0.009, 6, 128, Math.PI * (i % 2 ? 1.6 : 2)]} />
          <meshBasicMaterial color={i % 3 === 1 ? "#ff5a1f" : "#edebe6"} transparent opacity={i % 3 === 1 ? 0.9 : 0.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Dust({ count }) {
  const geo = useMemo(() => {
    const r = rng(7);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (r() - 0.5) * 26;
      pos[i * 3 + 1] = (r() - 0.5) * 16;
      pos[i * 3 + 2] = 6 - r() * (DEPTH + 10);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
  return (
    <points geometry={geo}>
      <pointsMaterial color="#edebe6" size={0.045} sizeAttenuation transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

// The light at the end of the tunnel, plus warm glows along the way.
function glowTexture(inner, outer) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.35, outer);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Glows() {
  const warm = useMemo(() => glowTexture("rgba(255,214,190,1)", "rgba(255,90,31,0.35)"), []);
  const soft = useMemo(() => glowTexture("rgba(255,120,60,0.6)", "rgba(255,90,31,0.12)"), []);
  const spots = [
    { z: -DEPTH - 6, s: 70, tex: warm },
    { z: -40, s: 26, x: -9, y: 4, tex: soft },
    { z: -78, s: 30, x: 10, y: -5, tex: soft },
    { z: -112, s: 24, x: -7, y: -4, tex: soft },
  ];
  return spots.map((g, i) => (
    <sprite key={i} position={[g.x || 0, g.y || 0, g.z]} scale={g.s}>
      <spriteMaterial map={g.tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} fog={false} toneMapped={false} />
    </sprite>
  ));
}

// The camera's depth follows page scroll; the pointer and scroll speed lean it gently.
function Rig({ progress }) {
  const { camera } = useThree();
  const last = useRef(0);
  const lean = useRef(0);
  useFrame((state, dt) => {
    const p = progress.current;
    const z = 8 - p * (DEPTH - 6);
    const v = (p - last.current) / Math.max(dt, 1 / 120);
    last.current = p;
    lean.current = THREE.MathUtils.damp(lean.current, THREE.MathUtils.clamp(v * 6, -0.25, 0.25), 3, dt);
    const k = reduced ? 0 : 1;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 4, dt);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, state.pointer.x * 0.8 * k, 2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, state.pointer.y * 0.5 * k, 2, dt);
    camera.rotation.z = lean.current * k + Math.sin(p * Math.PI * 4) * 0.08 * k;
  });
  return null;
}

// Sections that paint their own 3D scene; the world pauses behind them so only one scene renders.
const COVERS = [".svc-sticky", ".contact-stage"];

export default function ScrollWorld() {
  const progress = useRef(0);
  const [shown, setShown] = useState(false);
  const [running, setRunning] = useState(false);
  const [mobile] = useState(() => innerWidth < 760);
  const [dpr, setDpr] = useState(() => (innerWidth < 760 ? 0.85 : Math.min(devicePixelRatio, 1.25)));

  useLayoutEffect(() => {
    const on = () => {
      const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
      progress.current = Math.min(Math.max(scrollY / max, 0), 1);
      const covered = COVERS.some((sel) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top < innerHeight * 0.35 && r.bottom > innerHeight * 0.65;
      });
      const past = scrollY > innerHeight * 0.9;
      setShown(past);
      setRunning(past && !covered); // a covered world holds its last frame
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); };
  }, []);

  return (
    <div className={`world${shown ? " is-awake" : ""}`} aria-hidden="true">
      <Canvas
        frameloop={running ? "always" : "never"}
        dpr={dpr}
        camera={{ position: [0, 0, 8], fov: 55, near: 0.1, far: 160 }}
        gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
      >
        <color attach="background" args={[INK]} />
        <fog attach="fog" args={[INK, 8, 42]} />
        {/* If frames drop, render the background at a lower resolution rather than stutter. */}
        <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(0.6, d * 0.75))} />
        <Suspense fallback={null}>
          <Glows />
          <Crystals count={mobile ? 36 : 80} seed={11} />
          <Crystals count={mobile ? 5 : 10} seed={29} accent />
          <Rings />
          <Dust count={mobile ? 450 : 1000} />
          <Studio />
          <Rig progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
}

import { useMemo } from "react";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";

// Refraction samples a lifted ground so internal facets read as smoky glass, not holes.
const GLASS_GROUND = new THREE.Color("#2a2a2d");

// Shared glass: one tuning for every transmissive object on the page.
export function GlassMaterial({ quality = "high", ...props }) {
  const hi = quality === "high";
  return (
    <MeshTransmissionMaterial
      backside
      backsideThickness={0.35}
      background={GLASS_GROUND}
      envMapIntensity={1.6}
      samples={hi ? 6 : 4}
      resolution={hi ? 512 : 256}
      transmission={1}
      thickness={0.75}
      roughness={0.02}
      ior={1.55}
      chromaticAberration={0.9}
      anisotropicBlur={0.12}
      distortion={0.15}
      distortionScale={0.4}
      temporalDistortion={0.05}
      clearcoat={1}
      attenuationDistance={2.4}
      attenuationColor="#ffffff"
      color="#ffffff"
      {...props}
    />
  );
}

// Round brilliant: table, crown, girdle, pavilion. Neighbouring rings sit half a step apart,
// so each band splits into the triangular star, kite and pavilion facets of a real cut.
const CUT = [
  [0.56, 0.3, 0], // table edge
  [0.82, 0.16, 0.5], // crown
  [1.0, 0.03, 0], // girdle top
  [1.0, -0.03, 0], // girdle bottom
  [0.5, -0.47, 0.5], // pavilion
];
const TABLE_Y = 0.3;
const CULET_Y = -0.88;

export function makeDiamondGeometry(n = 16) {
  const ring = ([r, y, phase]) =>
    Array.from({ length: n }, (_, i) => {
      const a = ((i + phase) / n) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
    });
  const rings = CUT.map(ring);
  const table = new THREE.Vector3(0, TABLE_Y, 0);
  const culet = new THREE.Vector3(0, CULET_Y, 0);
  const pos = [];
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), mid = new THREE.Vector3();
  // Wind every face outward: the solid is convex around the origin.
  const tri = (a, b, c) => {
    ab.subVectors(b, a); ac.subVectors(c, a);
    mid.copy(a).add(b).add(c);
    const out = ab.cross(ac).dot(mid) > 0;
    for (const v of out ? [a, b, c] : [a, c, b]) pos.push(v.x, v.y, v.z);
  };
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    tri(table, rings[0][i], rings[0][j]);
    for (let k = 0; k < rings.length - 1; k++) {
      const A = rings[k], B = rings[k + 1];
      const pa = CUT[k][2], pb = CUT[k + 1][2];
      if (pa === pb) { tri(A[i], B[i], B[j]); tri(A[i], B[j], A[j]); }
      else if (pb > pa) { tri(A[i], B[i], A[j]); tri(A[j], B[i], B[j]); }
      else { tri(B[i], A[i], B[j]); tri(A[i], A[j], B[j]); }
    }
    tri(rings[rings.length - 1][i], rings[rings.length - 1][j], culet);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.translate(0, -(TABLE_Y + CULET_Y) / 2, 0);
  g.computeVertexNormals();
  return g;
}

export default function Gem({ quality = "high", segments = 16, ...props }) {
  const geometry = useMemo(() => makeDiamondGeometry(segments), [segments]);
  return (
    <mesh geometry={geometry} {...props}>
      <GlassMaterial quality={quality} />
    </mesh>
  );
}

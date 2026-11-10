import { useMemo } from "react";
import * as THREE from "three";
import { MeshTransmissionMaterial } from "@react-three/drei";

// Refraction samples a lifted ground so internal facets read as smoky glass, not holes.
const GLASS_GROUND = new THREE.Color("#2a2a2d");

// Brilliant-cut silhouette, lathed with few segments so every facet catches light.
function makeGemGeometry(segments = 12) {
  const profile = [
    new THREE.Vector2(0.0001, 0.58),
    new THREE.Vector2(0.56, 0.58),
    new THREE.Vector2(0.98, 0.2),
    new THREE.Vector2(1.0, 0.12),
    new THREE.Vector2(0.0001, -1.05),
  ];
  const g = new THREE.LatheGeometry(profile, segments).toNonIndexed();
  g.computeVertexNormals();
  return g;
}

export default function Gem({ quality = "high", segments = 12, ...props }) {
  const geometry = useMemo(() => makeGemGeometry(segments), [segments]);
  const hi = quality === "high";
  return (
    <mesh geometry={geometry} {...props}>
      <MeshTransmissionMaterial
        backside
        backsideThickness={0.35}
        background={GLASS_GROUND}
        envMapIntensity={1.6}
        samples={hi ? 10 : 6}
        resolution={hi ? 768 : 512}
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
      />
    </mesh>
  );
}

import { Environment, Lightformer } from "@react-three/drei";

// Local light rig (no HDR download): softboxes give the glass its highlights and spectral edges;
// one flare-orange ring is the only place the accent enters the 3D.
export default function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <group rotation={[-Math.PI / 3, 0, 1]}>
        <Lightformer form="rect" intensity={6} position={[0, 5, -9]} scale={[10, 10, 1]} />
        <Lightformer form="rect" intensity={3} position={[0, -4, 6]} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
        <Lightformer form="rect" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[50, 2, 1]} />
        <Lightformer form="rect" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
        <Lightformer form="ring" color="#ff5a1f" intensity={4} position={[-6, 2, 4]} scale={3} />
        <Lightformer form="ring" color="#c7d8ff" intensity={3} position={[6, -2, 4]} scale={3} />
      </group>
    </Environment>
  );
}

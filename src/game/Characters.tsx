import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { VENDOR_POS } from "./colliders";

export function PlayerMesh({ color = "#2d4a6a" }: { color?: string }) {
  return (
    <group>
      <mesh position={[0, 0.95, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.85, 6, 10]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.28, 12, 10]} />
        <meshStandardMaterial color="#c4a882" />
      </mesh>
      <mesh position={[0, 1.88, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.32, 0.28, 8]} />
        <meshStandardMaterial color="#6a7380" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.05, 0.12]}>
        <boxGeometry args={[0.62, 0.7, 0.18]} />
        <meshStandardMaterial color="#12232c" />
      </mesh>
      <mesh position={[0.08, 1.08, 0.22]}>
        <circleGeometry args={[0.12, 10]} />
        <meshStandardMaterial color="#d8a645" />
      </mesh>
      <mesh position={[0.42, 0.95, -0.05]} rotation={[0.2, 0, -0.4]} castShadow>
        <boxGeometry args={[0.12, 0.7, 0.12]} />
        <meshStandardMaterial color="#8a9098" metalness={0.5} />
      </mesh>
    </group>
  );
}

export function KeeperMesh() {
  const chest = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!chest.current) return;
    chest.current.position.y = 1.15 + Math.sin(state.clock.elapsedTime * 1.6) * 0.12;
    chest.current.rotation.y = state.clock.elapsedTime * 0.4;
  });
  return (
    <group>
      <mesh position={[0, 0.95, 0]} castShadow>
        <capsuleGeometry args={[0.38, 1.05, 6, 12]} />
        <meshStandardMaterial color="#1a3340" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.05, 0.18]}>
        <boxGeometry args={[0.72, 0.9, 0.12]} />
        <meshStandardMaterial color="#12232c" />
      </mesh>
      <mesh position={[0, 1.05, 0.25]}>
        <boxGeometry args={[0.55, 0.08, 0.04]} />
        <meshStandardMaterial color="#d8a645" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.3, 12, 10]} />
        <meshStandardMaterial color="#cbb89a" />
      </mesh>
      <mesh position={[0, 2.12, 0]} rotation={[0.15, 0, 0]} castShadow>
        <coneGeometry args={[0.42, 0.7, 8]} />
        <meshStandardMaterial color="#0b171e" />
      </mesh>
      <mesh position={[0.42, 1.15, 0]} rotation={[0.3, 0, -0.25]}>
        <cylinderGeometry args={[0.045, 0.045, 1.8, 6]} />
        <meshStandardMaterial color="#6b4517" metalness={0.6} />
      </mesh>
      <mesh position={[0.55, 2.0, 0.15]}>
        <torusGeometry args={[0.12, 0.035, 8, 14]} />
        <meshStandardMaterial color="#d8a645" metalness={0.8} roughness={0.25} />
      </mesh>
      <group ref={chest} position={[-0.55, 1.15, 0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.28, 0.28]} />
          <meshStandardMaterial color="#d8a645" metalness={0.75} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.02, 0.15]}>
          <boxGeometry args={[0.12, 0.08, 0.04]} />
          <meshStandardMaterial color="#6b4517" />
        </mesh>
      </group>
      <pointLight position={[0, 1.6, 0.4]} color="#f0c86d" intensity={3.2} distance={6} />
    </group>
  );
}

export function VendorMesh() {
  return (
    <group position={[VENDOR_POS.x, 0, VENDOR_POS.z]}>
      <PlayerMesh color="#4a3a28" />
      <Html position={[0, 2.4, 0]} center distanceFactor={10} style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: "Alegreya, serif",
            color: "#f0c86d",
            fontSize: 13,
            textShadow: "0 1px 4px #000",
            whiteSpace: "nowrap",
          }}
        >
          WOC Broker
        </div>
      </Html>
    </group>
  );
}

export function SummonRing({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    if (!active) {
      ref.current.scale.setScalar(0.01);
      return;
    }
    const m = ref.current.material as THREE.MeshBasicMaterial;
    ref.current.rotation.z += dt * 1.4;
    const s = ref.current.scale.x;
    ref.current.scale.setScalar(Math.min(2.4, s + dt * 3.2));
    m.opacity = Math.max(0, 0.7 - (ref.current.scale.x / 2.4) * 0.7);
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} scale={0.01}>
      <ringGeometry args={[0.7, 1.05, 32]} />
      <meshBasicMaterial color="#d8a645" transparent opacity={0.7} side={THREE.DoubleSide} />
    </mesh>
  );
}

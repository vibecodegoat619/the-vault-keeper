import { useMemo } from "react";
import * as THREE from "three";
import { BUILDINGS, STALL } from "./colliders";
import { cobbleTex, dirtTex, grassTex, thatchTex, woodTex } from "./textures";

function Building({
  box,
  h,
  color,
  roof,
}: {
  box: { minX: number; maxX: number; minZ: number; maxZ: number };
  h: number;
  color: string;
  roof: string;
}) {
  const w = box.maxX - box.minX;
  const d = box.maxZ - box.minZ;
  const cx = (box.minX + box.maxX) / 2;
  const cz = (box.minZ + box.maxZ) / 2;
  const wood = woodTex();
  wood.repeat.set(2, 2);
  return (
    <group position={[cx, 0, cz]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} map={wood} roughness={0.85} />
      </mesh>
      <mesh position={[0, h + 0.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[Math.max(w, d) * 0.72, 1.8, 4]} />
        <meshStandardMaterial color={roof} map={thatchTex()} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.2, d / 2 + 0.02]}>
        <planeGeometry args={[0.9, 1.6]} />
        <meshStandardMaterial color="#1a120c" />
      </mesh>
      <mesh position={[-w * 0.25, 2.1, d / 2 + 0.03]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshStandardMaterial color="#d8c07a" emissive="#8a6a20" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.26, 1.4, 6]} />
        <meshStandardMaterial color="#4a3424" />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <coneGeometry args={[1.15, 2.4, 7]} />
        <meshStandardMaterial color="#2f5a28" />
      </mesh>
      <mesh position={[0, 3.1, 0]} castShadow>
        <coneGeometry args={[0.8, 1.6, 7]} />
        <meshStandardMaterial color="#3a6e30" />
      </mesh>
    </group>
  );
}

function Lantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 2.2, 6]} />
        <meshStandardMaterial color="#2a2420" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[0.38, 0.46, 0.38]} />
        <meshStandardMaterial color="#d8a645" emissive="#d8a645" emissiveIntensity={0.55} />
      </mesh>
      <pointLight position={[0, 2.3, 0]} color="#ffc56a" intensity={4.5} distance={9} />
    </group>
  );
}

export function Town() {
  const grass = useMemo(() => {
    const t = grassTex();
    t.repeat.set(18, 18);
    return t;
  }, []);
  const dirt = useMemo(() => {
    const t = dirtTex();
    t.repeat.set(8, 2);
    return t;
  }, []);
  const cobble = useMemo(() => {
    const t = cobbleTex();
    t.repeat.set(6, 6);
    return t;
  }, []);

  const trees: [number, number, number][] = [
    [-8, 0, -8],
    [8.5, 0, -9],
    [-9, 0, 7],
    [9, 0, 7.5],
    [-19, 0, 6],
    [19, 0, -10],
    [-7, 0, 19],
    [7, 0, 19],
    [-20, 0, -16],
    [20, 0, 18],
  ];

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[64, 64]} />
        <meshStandardMaterial map={grass} color="#4a6a34" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 4]} receiveShadow>
        <planeGeometry args={[4.4, 18]} />
        <meshStandardMaterial map={dirt} color="#7a5a38" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <circleGeometry args={[5.4, 24]} />
        <meshStandardMaterial map={cobble} color="#6a6458" />
      </mesh>

      {BUILDINGS.map((b) => (
        <Building key={b.name} box={b.box} h={b.h} color={b.color} roof={b.roof} />
      ))}

      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.35, 0]} receiveShadow>
          <cylinderGeometry args={[1.55, 1.7, 0.7, 16]} />
          <meshStandardMaterial color="#8a8374" />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.95, 0.95, 0.3, 16]} />
          <meshStandardMaterial color="#4a7aa8" transparent opacity={0.75} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.12, 0.16, 1.3, 8]} />
          <meshStandardMaterial color="#c4b590" metalness={0.5} />
        </mesh>
      </group>

      <group position={[(STALL.minX + STALL.maxX) / 2, 0, (STALL.minZ + STALL.maxZ) / 2]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[3.2, 1.4, 1.6]} />
          <meshStandardMaterial color="#5a3c28" />
        </mesh>
        <mesh position={[0, 2.0, 0]} rotation={[0, 0, 0.08]} castShadow>
          <boxGeometry args={[3.6, 0.12, 2.0]} />
          <meshStandardMaterial color="#926321" />
        </mesh>
        <mesh position={[0, 1.55, 0.82]}>
          <planeGeometry args={[1.4, 0.7]} />
          <meshStandardMaterial color="#12232c" />
        </mesh>
      </group>

      {trees.map((p, i) => (
        <Tree key={i} position={p} />
      ))}
      <Lantern position={[-4.2, 0, 3.4]} />
      <Lantern position={[4.2, 0, 3.4]} />
      <Lantern position={[-4.2, 0, -3.8]} />
      <Lantern position={[4.2, 0, -3.8]} />
      <Lantern position={[6.9, 0, 6.4]} />

      {[-10, -5, 5, 10].map((x) => (
        <mesh key={`fence-${x}`} position={[x, 0.45, 21.2]}>
          <boxGeometry args={[3.6, 0.9, 0.18]} />
          <meshStandardMaterial color="#4a3828" />
        </mesh>
      ))}
    </group>
  );
}

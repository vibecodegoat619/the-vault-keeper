import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Town } from "./Town";
import { KeeperMesh, PlayerMesh, SummonRing, VendorMesh } from "./Characters";
import { resolveMove, VENDOR_POS } from "./colliders";
import {
  bindInput,
  consumeLook,
  held,
  isRmb,
  setInjectedKeys,
  touchLook,
  touchMove,
} from "./input";
import { useGame } from "@/store/game-store";

const _desired = new THREE.Vector3();
const RADIUS = 0.45;
const WALK = 4.85;
const TURN = 2.3;

function PlayerRig() {
  const group = useRef<THREE.Group>(null);
  const yaw = useRef(0);
  const speed = useRef(0);
  const velY = useRef(0);
  const grounded = useRef(true);
  const cam = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    const unbind = bindInput(gl.domElement);
    window.__controlsTest = {
      getYaw: () => yaw.current,
      getSpeed: () => speed.current,
      setKeys: (codes) => setInjectedKeys(codes.length ? codes : null),
    };
    return () => {
      unbind();
      delete window.__controlsTest;
      setInjectedKeys(null);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const g = group.current;
    if (!g) return;
    const k = held();
    const store = useGame.getState();

    const look = consumeLook();
    yaw.current -= look.x * 0.005;
    if (Math.abs(touchLook.x) > 0.05) yaw.current -= touchLook.x * 2.4 * dt;

    const rmb = isRmb();
    let steer = 0;
    if (!rmb) {
      if (k.has("KeyA") || k.has("ArrowLeft")) steer += 1;
      if (k.has("KeyD") || k.has("ArrowRight")) steer -= 1;
    }
    yaw.current += steer * TURN * dt;

    const fx = -Math.sin(yaw.current);
    const fz = -Math.cos(yaw.current);
    const rx = Math.cos(yaw.current);
    const rz = -Math.sin(yaw.current);

    let mx = 0;
    let mz = 0;
    if (k.has("KeyW") || k.has("ArrowUp")) {
      mx += fx;
      mz += fz;
    }
    if (k.has("KeyS") || k.has("ArrowDown")) {
      mx -= fx;
      mz -= fz;
    }
    if (rmb && (k.has("KeyA") || k.has("ArrowLeft"))) {
      mx -= rx;
      mz -= rz;
    }
    if (rmb && (k.has("KeyD") || k.has("ArrowRight"))) {
      mx += rx;
      mz += rz;
    }
    if (k.has("KeyQ")) {
      mx -= rx;
      mz -= rz;
    }
    if (k.has("KeyE")) {
      mx += rx;
      mz += rz;
    }
    if (Math.abs(touchMove.x) > 0.08 || Math.abs(touchMove.y) > 0.08) {
      mx += fx * -touchMove.y + rx * touchMove.x;
      mz += fz * -touchMove.y + rz * touchMove.x;
    }
    const len = Math.hypot(mx, mz);
    if (len > 1) {
      mx /= len;
      mz /= len;
    }
    const moved = resolveMove(g.position.x, g.position.z, mx * WALK * dt, mz * WALK * dt, RADIUS);
    g.position.x = moved.x;
    g.position.z = moved.z;
    g.rotation.y = yaw.current;
    speed.current = len * WALK;

    if (k.has("Space") && grounded.current) {
      velY.current = 5.4;
      grounded.current = false;
    }
    velY.current -= 18 * dt;
    g.position.y += velY.current * dt;
    if (g.position.y <= 0) {
      g.position.y = 0;
      velY.current = 0;
      grounded.current = true;
    }

    _desired.set(g.position.x - fx * 7.4, g.position.y + 2.55, g.position.z - fz * 7.4);
    cam.position.lerp(_desired, 1 - Math.exp(-7 * dt));
    cam.lookAt(g.position.x, g.position.y + 1.32, g.position.z);

    const dxv = g.position.x - VENDOR_POS.x;
    const dzv = g.position.z - VENDOR_POS.z;
    let target: typeof store.interact = "none";
    if (dxv * dxv + dzv * dzv < 3.6 * 3.6) target = "vendor";
    if (store.summoned && store.summonPos) {
      const dxk = g.position.x - store.summonPos.x;
      const dzk = g.position.z - store.summonPos.z;
      if (dxk * dxk + dzk * dzk < 3.8 * 3.8) target = "keeper";
    }
    if (target !== store.interact) store.setInteract(target);

    if (store.summoned && store.summonUntil && performance.now() > store.summonUntil) {
      store.dismiss();
    }

    if (state.clock.elapsedTime % 0.12 < dt) {
      store.syncPlayer({ x: g.position.x, y: g.position.y, z: g.position.z }, yaw.current);
    }
  });

  return (
    <group ref={group} position={[0, 0, 8]}>
      <PlayerMesh />
      <Html position={[0, 2.35, 0]} center distanceFactor={9} style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: "Alegreya, serif",
            color: "#25c84a",
            fontSize: 13,
            textShadow: "0 1px 3px #000",
            whiteSpace: "nowrap",
          }}
        >
          Thorgar
        </div>
      </Html>
    </group>
  );
}

function KeeperRig() {
  const summoned = useGame((s) => s.summoned);
  const pos = useGame((s) => s.summonPos);
  const yaw = useGame((s) => s.summonYaw);
  if (!summoned || !pos) return null;
  return (
    <group position={[pos.x, 0, pos.z]} rotation={[0, yaw, 0]}>
      <SummonRing active={summoned} />
      <KeeperMesh />
      <Html position={[0, 2.55, 0]} center distanceFactor={9} style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: "Alegreya, serif",
            color: "#f0c86d",
            fontSize: 13,
            textShadow: "0 1px 4px #000",
            whiteSpace: "nowrap",
          }}
        >
          Bursar Claudius
        </div>
      </Html>
    </group>
  );
}

export function Scene() {
  return (
    <>
      <color attach="background" args={["#6a8aaa"]} />
      <fog attach="fog" args={["#9ab0c4", 22, 58]} />
      <hemisphereLight args={["#c8dcf0", "#3d4a2a", 0.72]} />
      <directionalLight
        position={[-14, 22, 10]}
        intensity={1.25}
        color="#ffe2b0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={2}
        shadow-camera-far={60}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />
      <Town />
      <VendorMesh />
      <PlayerRig />
      <KeeperRig />
    </>
  );
}

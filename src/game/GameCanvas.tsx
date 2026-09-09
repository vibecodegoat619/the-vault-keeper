import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";

export function GameCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 3.2, 14], fov: 52, near: 0.1, far: 120 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onContextMenu={(e) => e.preventDefault()}
      style={{ position: "absolute", inset: 0, touchAction: "none" }}
    >
      <Scene />
    </Canvas>
  );
}

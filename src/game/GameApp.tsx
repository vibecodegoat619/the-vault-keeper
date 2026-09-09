import { useEffect } from "react";
import { GameCanvas } from "./GameCanvas";
import { Hud } from "@/components/hud/Hud";
import { unlockAudio } from "./audio";

export function GameApp() {
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") unlockAudio();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-ink">
      <GameCanvas />
      <Hud />
    </main>
  );
}

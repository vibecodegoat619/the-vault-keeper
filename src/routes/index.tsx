import { useEffect, useState, type ComponentType } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TitleScreen } from "@/components/hud/TitleScreen";
import { useGame } from "@/store/game-store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const phase = useGame((s) => s.phase);
  const [Game, setGame] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (phase !== "playing") return;
    let cancelled = false;
    void import("@/game/GameApp").then((m) => {
      if (!cancelled) setGame(() => m.GameApp);
    });
    return () => {
      cancelled = true;
    };
  }, [phase]);

  if (phase === "title") return <TitleScreen />;
  if (!Game) {
    return (
      <main className="flex h-dvh items-end justify-center bg-ink pb-16">
        <p className="font-display text-gold">Opening the vale…</p>
      </main>
    );
  }
  return <Game />;
}

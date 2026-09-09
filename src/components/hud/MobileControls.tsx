import { useRef } from "react";
import { touchLook, touchMove } from "@/game/input";
import { sfxOpen, sfxSummon } from "@/game/audio";
import { useGame } from "@/store/game-store";

function Stick({
  onVec,
  className,
  label,
}: {
  onVec: (x: number, y: number) => void;
  className: string;
  label: string;
}) {
  const origin = useRef<{ x: number; y: number } | null>(null);
  const move = (e: React.PointerEvent) => {
    if (!origin.current) return;
    const dx = e.clientX - origin.current.x;
    const dy = e.clientY - origin.current.y;
    const m = Math.hypot(dx, dy) || 1;
    const cap = 42;
    const nx = (dx / m) * Math.min(1, m / cap);
    const ny = (dy / m) * Math.min(1, m / cap);
    onVec(nx, ny);
  };
  return (
    <button
      type="button"
      aria-label={label}
      className={`hit h-20 w-20 rounded-full border border-gold-border bg-panel/70 ${className}`}
      onPointerDown={(e) => {
        origin.current = { x: e.clientX, y: e.clientY };
        (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={move}
      onPointerUp={() => {
        origin.current = null;
        onVec(0, 0);
      }}
    />
  );
}

export function MobileControls() {
  const summon = useGame((s) => s.summon);
  const interact = useGame((s) => s.interact);
  const tryInteract = useGame((s) => s.tryInteract);
  const toggle = useGame((s) => s.toggleWindow);
  const permit = useGame((s) => s.permitOwned);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-between px-4 sm:hidden">
      <Stick
        label="Move"
        className="pointer-events-auto"
        onVec={(x, y) => {
          touchMove.x = x;
          touchMove.y = y;
        }}
      />
      <div className="pointer-events-auto flex flex-col items-end gap-2">
        <button
          className="hit min-h-11 rounded-full border border-gold-border bg-panel/80 px-4 font-display text-xs text-gold"
          onClick={() => {
            if (interact !== "none") {
              if (tryInteract() !== "none") sfxOpen();
            } else if (permit) {
              summon();
              sfxSummon();
            } else toggle("wallet");
          }}
        >
          {interact === "keeper" ? "Open" : interact === "vendor" ? "Buy" : permit ? "Summon" : "WOC"}
        </button>
        <Stick
          label="Look"
          className=""
          onVec={(x) => {
            touchLook.x = x;
            touchLook.y = 0;
          }}
        />
      </div>
    </div>
  );
}

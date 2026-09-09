import { ITEMS, type Slot } from "@/lib/items";
import { useGame } from "@/store/game-store";

export function SlotGrid({
  slots,
  from,
  compact,
}: {
  slots: Slot[];
  from: "bags" | "bank" | "vault" | "guild";
  compact?: boolean;
}) {
  const startDrag = useGame((s) => s.startDrag);
  const dropOn = useGame((s) => s.dropOn);
  const dragging = useGame((s) => s.dragging);

  return (
    <div
      className="grid gap-[3px]"
      style={{ gridTemplateColumns: `repeat(${from === "bags" ? 4 : 7}, 42px)` }}
    >
      {slots.map((slot, i) => {
        const def = slot ? ITEMS[slot.id] : null;
        const active = dragging?.from === from && dragging.index === i;
        return (
          <button
            key={`${from}-${i}`}
            type="button"
            className={`slot ${active ? "opacity-40" : ""}`}
            data-quality={def?.quality ?? "common"}
            title={def ? def.name : "Empty"}
            onPointerDown={(e) => {
              if (!slot) return;
              e.preventDefault();
              startDrag(from, i);
            }}
            onPointerUp={() => dropOn(from, i)}
          >
            {def ? (
              <>
                <img src={def.icon} alt="" crossOrigin="anonymous" />
                {slot && slot.count > 1 ? (
                  <span className="absolute right-0.5 bottom-0 font-mono text-[10px] text-parchment">
                    {slot.count}
                  </span>
                ) : null}
              </>
            ) : compact ? null : null}
          </button>
        );
      })}
    </div>
  );
}

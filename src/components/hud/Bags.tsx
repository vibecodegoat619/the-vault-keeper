import { formatMoney } from "@/lib/items";
import { useGame } from "@/store/game-store";
import { SlotGrid } from "./SlotGrid";

export function Bags() {
  const open = useGame((s) => s.windows.bags);
  const bags = useGame((s) => s.bags);
  const copper = useGame((s) => s.copper);
  const toggle = useGame((s) => s.toggleWindow);
  if (!open) return null;
  return (
    <div className="hit panel absolute right-3 bottom-28 z-30 w-[196px] p-3 sm:right-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-sm text-gold">Backpack</h2>
        <button className="text-faint hover:text-parchment" onClick={() => toggle("bags")} aria-label="Close bags">
          ×
        </button>
      </div>
      <div className="gold-rule mb-2" />
      <SlotGrid slots={bags} from="bags" />
      <p className="mt-2 font-mono text-[11px] text-gold">{formatMoney(copper)}</p>
    </div>
  );
}

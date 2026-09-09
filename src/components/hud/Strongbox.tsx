import { useGame } from "@/store/game-store";
import { SlotGrid } from "./SlotGrid";

const TABS = [
  { id: "bank", label: "Personal Bank" },
  { id: "vault", label: "Character Vault" },
  { id: "guild", label: "Guild Stash" },
] as const;

export function Strongbox() {
  const open = useGame((s) => s.windows.bank);
  const tab = useGame((s) => s.bankTab);
  const setTab = useGame((s) => s.setBankTab);
  const toggle = useGame((s) => s.toggleWindow);
  const dismiss = useGame((s) => s.dismiss);
  const bags = useGame((s) => s.bags);
  const bank = useGame((s) => s.bank);
  const vault = useGame((s) => s.vault);
  const guild = useGame((s) => s.guild);
  if (!open) return null;

  const slots = tab === "bank" ? bank : tab === "vault" ? vault : guild;
  const from = tab;
  const copy =
    tab === "bank"
      ? "Twenty-eight shelves bound to this character. The bursar keeps the key."
      : tab === "vault"
        ? "A private vault, sealed to Thorgar alone. Heirlooms rest here."
        : "Eastbrook Company stores. Bound items cannot be placed here.";

  return (
    <div className="hit panel absolute top-1/2 left-1/2 z-40 w-[min(560px,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-[46%] p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <img
          src="/art/keeper-sm.png"
          alt=""
          className="hidden h-28 w-28 shrink-0 object-contain sm:block"
          crossOrigin="anonymous"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-[11px] tracking-[0.18em] text-gold uppercase">
                The Gilded Strongbox
              </p>
              <h2 className="font-display text-xl text-parchment">Bursar Claudius</h2>
            </div>
            <button
              className="text-faint hover:text-parchment"
              onClick={() => toggle("bank")}
              aria-label="Close strongbox"
            >
              ×
            </button>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {copy}
          </p>
        </div>
      </div>

      <div className="gold-rule my-3" />

      <div className="mb-3 flex flex-wrap gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`min-h-9 rounded-[3px] border px-3 text-xs ${
              tab === t.id
                ? "border-gold bg-gold/15 text-gold-hover"
                : "border-gold-deep text-muted hover:text-parchment"
            }`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 overflow-x-auto sm:flex-row">
        <div>
          <p className="mb-1 text-[10px] tracking-wide text-faint uppercase">Strongbox</p>
          <SlotGrid slots={slots} from={from} />
        </div>
        <div>
          <p className="mb-1 text-[10px] tracking-wide text-faint uppercase">Bags</p>
          <SlotGrid slots={bags} from="bags" />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          className="min-h-10 rounded-[3px] border border-gold-deep px-3 text-xs text-muted hover:text-parchment"
          onClick={() => dismiss()}
        >
          Dismiss Bursar
        </button>
        <button
          className="min-h-10 rounded-[3px] border border-gold-border bg-gold/20 px-4 text-xs text-gold hover:bg-gold/30"
          onClick={() => toggle("bank")}
        >
          Close
        </button>
      </div>
    </div>
  );
}

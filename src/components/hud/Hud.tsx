import { useEffect, useMemo } from "react";
import { ITEMS, formatMoney } from "@/lib/items";
import { PERMIT_PRICE_WOC, formatWoc, getWocBalance } from "@/lib/woc/contract";
import { sfxOpen, sfxSummon } from "@/game/audio";
import { useGame } from "@/store/game-store";
import { Bags } from "./Bags";
import { Strongbox } from "./Strongbox";
import { WalletModal } from "./WalletModal";
import { MobileControls } from "./MobileControls";

export function Hud() {
  const copper = useGame((s) => s.copper);
  const bags = useGame((s) => s.bags);
  const permit = useGame((s) => s.permitOwned);
  const summoned = useGame((s) => s.summoned);
  const interact = useGame((s) => s.interact);
  const chat = useGame((s) => s.chat);
  const pos = useGame((s) => s.playerPos);
  const yaw = useGame((s) => s.playerYaw);
  const wallet = useGame((s) => s.wallet);
  const toggle = useGame((s) => s.toggleWindow);
  const summon = useGame((s) => s.summon);
  const tryInteract = useGame((s) => s.tryInteract);
  const windows = useGame((s) => s.windows);
  const cancelDrag = useGame((s) => s.cancelDrag);

  useEffect(() => {
    const up = () => {
      const d = useGame.getState().dragging;
      if (!d) return;
      window.setTimeout(() => {
        if (useGame.getState().dragging) cancelDrag();
      }, 0);
    };
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, [cancelDrag]);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const s = useGame.getState();
      if (e.code === "KeyB") s.toggleWindow("bags");
      if (e.code === "KeyH") s.toggleWindow("help");
      if (e.code === "Escape") s.closeTop();
      if (e.code === "Digit6" || e.code === "Numpad6") {
        s.summon();
        sfxSummon();
      }
      if (e.code === "KeyF") {
        if (s.tryInteract() !== "none") sfxOpen();
      }
    };
    window.addEventListener("keydown", onDown);
    return () => window.removeEventListener("keydown", onDown);
  }, []);

  const sigil = bags.find((s) => s?.id === "sigil") ?? null;
  const woc = wallet ? formatWoc(getWocBalance(wallet.publicKey)) : "—";

  const minimap = useMemo(() => {
    const s = 96;
    const scale = s / 48;
    const px = (pos.x + 24) * scale;
    const pz = (pos.z + 24) * scale;
    const ang = yaw;
    return { s, px, pz, ang };
  }, [pos, yaw]);

  return (
    <div className="hud-root absolute inset-0 z-10">
      <div className="hit absolute top-3 left-3 flex items-start gap-2">
        <div className="panel flex items-center gap-2 p-1.5 pr-3">
          <img
            src="/art/player-sm.png"
            alt=""
            className="h-12 w-12 object-contain"
            crossOrigin="anonymous"
          />
          <div>
            <p className="font-display text-sm leading-none text-parchment">Thorgar</p>
            <p className="mt-0.5 text-[10px] text-faint">Warrior · Eastbrook Vale</p>
            <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-[1px] bg-ink-950">
              <div className="h-full w-[78%] bg-hp" />
            </div>
            <div className="mt-0.5 h-1.5 w-28 overflow-hidden rounded-[1px] bg-ink-950">
              <div className="h-full w-[62%] bg-mana" />
            </div>
          </div>
        </div>
      </div>

      <div className="hit absolute top-3 right-3 flex flex-col items-end gap-2">
        <div
          className="panel relative overflow-hidden"
          style={{ width: minimap.s, height: minimap.s }}
        >
          <div className="absolute inset-[4px] rounded-full border border-gold-deep bg-[#1b3a28]">
            <div
              className="absolute h-2 w-2 rounded-full bg-quest"
              style={{
                left: Math.min(84, Math.max(8, minimap.px - 4)),
                top: Math.min(84, Math.max(8, minimap.pz - 4)),
              }}
            />
          </div>
          <p className="absolute bottom-0.5 left-0 w-full text-center font-display text-[9px] text-gold">
            Eastbrook
          </p>
        </div>
        <button
          className="panel flex min-h-10 items-center gap-2 px-3 text-xs text-gold hover:text-gold-hover"
          onClick={() => toggle("wallet")}
        >
          <img src="/icons/woc.png" alt="" className="h-6 w-6" crossOrigin="anonymous" />
          <span className="font-mono">{woc} WOC</span>
        </button>
        <p className="panel px-2 py-1 font-mono text-[11px] text-gold">{formatMoney(copper)}</p>
      </div>

      <div className="hit panel absolute bottom-44 left-3 max-h-24 w-[min(340px,calc(100vw-6rem))] overflow-hidden p-2 text-[11px] leading-snug sm:bottom-28 sm:max-h-32">
        {chat.slice(-6).map((l) => (
          <p
            key={l.id}
            className={
              l.kind === "loot"
                ? "text-legendary"
                : l.kind === "say"
                  ? "text-gold-hover"
                  : l.kind === "combat"
                    ? "text-danger"
                    : "text-muted"
            }
          >
            {l.text}
          </p>
        ))}
      </div>

      <div className="hit absolute bottom-3 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        {interact !== "none" ? (
          <button
            type="button"
            className="panel px-3 py-1 font-display text-xs text-gold hover:text-gold-hover"
            onClick={() => {
              if (tryInteract() !== "none") sfxOpen();
            }}
          >
            {interact === "keeper"
              ? "F  Open the Gilded Strongbox"
              : "F  Buy Call of the Vault-Keeper"}
          </button>
        ) : null}
        <div className="panel flex items-end gap-1 p-1.5">
          {Array.from({ length: 6 }, (_, i) => {
            const n = i + 1;
            const isSigil = n === 6;
            return (
              <button
                key={n}
                className={`slot ${isSigil && summoned ? "ring-1 ring-gold" : ""}`}
                data-quality={isSigil && sigil ? "legendary" : "common"}
                disabled={isSigil && !permit}
                onClick={() => {
                  if (isSigil) {
                    summon();
                    sfxSummon();
                  } else if (n === 1) toggle("bags");
                }}
                title={isSigil ? ITEMS.sigil.name : n === 1 ? "Backpack" : `Empty ${n}`}
              >
                {isSigil && (sigil || permit) ? (
                  <img src="/icons/sigil.png" alt="" crossOrigin="anonymous" />
                ) : n === 1 ? (
                  <img src="/icons/letter.png" alt="" className="opacity-70" crossOrigin="anonymous" />
                ) : null}
                <span className="absolute -bottom-0.5 left-0.5 font-mono text-[9px] text-faint">{n}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="hit absolute right-3 bottom-3 hidden flex-col gap-1 sm:flex">
        <IconBtn label="Bags (B)" onClick={() => toggle("bags")} />
        <IconBtn label="$WOC" onClick={() => toggle("wallet")} />
        <IconBtn label="Help (H)" onClick={() => toggle("help")} />
      </div>

      {windows.help ? <Help /> : null}
      <Bags />
      <Strongbox />
      <WalletModal />
      <MobileControls />
      <p className="sr-only">Price {PERMIT_PRICE_WOC}</p>
    </div>
  );
}

function IconBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="panel min-h-9 px-2 text-[10px] tracking-wide text-muted hover:text-parchment" onClick={onClick}>
      {label}
    </button>
  );
}

function Help() {
  const toggle = useGame((s) => s.toggleWindow);
  return (
    <div className="hit panel absolute top-1/2 left-1/2 z-30 w-[min(380px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 p-4 text-sm text-muted">
      <div className="flex justify-between">
        <h2 className="font-display text-lg text-parchment">Controls</h2>
        <button onClick={() => toggle("help")} aria-label="Close help">
          ×
        </button>
      </div>
      <ul className="mt-3 space-y-1 text-xs leading-relaxed">
        <li>W / S — run and backpedal</li>
        <li>A / D — turn (strafe while holding right mouse)</li>
        <li>Q / E — strafe · Space — jump · F — interact</li>
        <li>B — bags · 6 — summon Vault-Keeper · Esc — close</li>
        <li>Buy the sigil with $WOC, then press 6 anywhere in the vale.</li>
      </ul>
    </div>
  );
}

import { formatWoc, mintShort, PERMIT_PRICE_WOC, VAULT_KEEPER_PROGRAM_ID, WOC_MINT } from "@/lib/woc/contract";
import { getWocBalance } from "@/lib/woc/contract";
import { shortenKey } from "@/lib/woc/wallet";
import { sfxBuy, sfxError } from "@/game/audio";
import { useGame } from "@/store/game-store";

export function WalletModal() {
  const open = useGame((s) => s.windows.wallet || s.windows.vendor);
  const wallet = useGame((s) => s.wallet);
  const lastTx = useGame((s) => s.lastTx);
  const purchasing = useGame((s) => s.purchasing);
  const err = useGame((s) => s.purchaseError);
  const permit = useGame((s) => s.permitOwned);
  const connect = useGame((s) => s.connect);
  const disconnect = useGame((s) => s.disconnect);
  const buy = useGame((s) => s.buyPermit);
  if (!open) return null;

  const bal = wallet ? formatWoc(getWocBalance(wallet.publicKey)) : "—";

  return (
    <div className="hit panel-strong panel absolute top-1/2 left-1/2 z-40 w-[min(440px,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-[11px] tracking-[0.2em] text-gold uppercase">$WOC Permit</p>
          <h2 className="font-display text-xl text-parchment">Call of the Vault-Keeper</h2>
        </div>
        <button
          className="text-faint hover:text-parchment"
          onClick={() => {
            const s = useGame.getState();
            if (s.windows.wallet) s.toggleWindow("wallet");
            if (s.windows.vendor) s.toggleWindow("vendor");
          }}
          aria-label="Close wallet"
        >
          ×
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Pay {PERMIT_PRICE_WOC} $WOC to mint a Vault-Keeper permit. The game never
        sells power; this unlocks remote access to the Gilded Strongbox.
      </p>

      <div className="mt-4 rounded-[4px] border border-gold-deep bg-ink-950/80 p-3 font-mono text-[10px] leading-relaxed text-faint">
        <div>mint {WOC_MINT}</div>
        <div>program {VAULT_KEEPER_PROGRAM_ID}</div>
        <div>ix purchase_permit disc=1 price={PERMIT_PRICE_WOC} WOC</div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted">Wallet</span>
        <span className="font-mono text-parchment">
          {wallet?.connected ? shortenKey(wallet.publicKey, 5) : "Not connected"}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between text-sm">
        <span className="text-muted">$WOC ({mintShort()})</span>
        <span className="font-mono text-gold">{bal}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!wallet?.connected ? (
          <button
            className="min-h-11 rounded-[4px] border border-gold-border bg-gold px-4 font-display text-sm font-semibold text-ink"
            onClick={connect}
          >
            Connect Phantom (demo)
          </button>
        ) : (
          <>
            <button
              className="min-h-11 rounded-[4px] border border-gold-border bg-gold px-4 font-display text-sm font-semibold text-ink disabled:opacity-50"
              disabled={purchasing || permit}
              onClick={async () => {
                await buy();
                const s = useGame.getState();
                if (s.lastTx?.status === "finalized") sfxBuy();
                else sfxError();
              }}
            >
              {purchasing ? "Confirming…" : permit ? "Permit minted" : `Pay ${PERMIT_PRICE_WOC} $WOC`}
            </button>
            <button
              className="min-h-11 rounded-[4px] border border-gold-deep px-3 text-sm text-muted"
              onClick={disconnect}
            >
              Disconnect
            </button>
          </>
        )}
      </div>
      {err ? <p className="mt-2 text-xs text-danger">{err}</p> : null}

      {lastTx ? (
        <div className="mt-4 border-t border-gold-deep pt-3">
          <p className="text-[10px] tracking-wide text-faint uppercase">Last transaction</p>
          <p className="mt-1 font-mono text-[10px] break-all text-muted">
            {lastTx.signature}
          </p>
          <p className="mt-1 text-[11px] text-gold">
            slot {lastTx.slot} · {lastTx.status}
            {lastTx.error ? ` · ${lastTx.error}` : ""}
          </p>
          <pre className="mt-2 max-h-24 overflow-auto font-mono text-[10px] leading-relaxed text-faint">
            {lastTx.logs.join("\n")}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

import { unlockAudio } from "@/game/audio";
import { useGame } from "@/store/game-store";
import { WOC_MINT } from "@/lib/woc/contract";

export function TitleScreen() {
  const enter = useGame((s) => s.enterWorld);
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-end overflow-hidden">
      <img
        src="/art/title-splash.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        crossOrigin="anonymous"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15" />
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center px-5 pb-10 text-center sm:pb-14">
        <p className="font-display text-xs tracking-[0.28em] text-gold uppercase">
          World of ClaudeCraft
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-parchment sm:text-6xl">
          The Vault-Keeper
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          Summon Bursar Claudius on the road and open the Gilded Strongbox. The
          sigil is sealed in $WOC.
        </p>
        <button
          className="hit mt-7 min-h-11 rounded-[4px] border border-gold-border bg-gold px-8 py-2.5 font-display text-base font-semibold text-ink shadow-[0_0_18px_rgba(216,166,69,0.28)] transition hover:bg-gold-hover"
          onClick={() => {
            unlockAudio();
            enter();
          }}
        >
          Enter World
        </button>
        <p className="mt-5 max-w-sm font-mono text-[10px] leading-relaxed text-faint">
          $WOC {WOC_MINT}
        </p>
        <p className="mt-2 text-[11px] text-faint">
          WASD to move. Hold right mouse to look. F to interact.
        </p>
      </div>
    </div>
  );
}

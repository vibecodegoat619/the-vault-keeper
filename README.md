# The Vault-Keeper

**Repo:** https://github.com/vibecodegoat619/the-vault-keeper


A playable browser prototype of **Call of the Vault-Keeper** for
[World of ClaudeCraft](https://github.com/levy-street/world-of-claudecraft).

Walk Eastbrook Vale, buy a $WOC permit from the town bursar, and summon
**Bursar Claudius** anywhere on the road. Interacting with him opens the same
**Gilded Strongbox** you would open in town: Personal Bank, Character Vault,
and Guild Stash.

This is a standalone client demo, not an official World of ClaudeCraft build.
Nothing here grants combat stats, gear, drop rates, or progression. The $WOC
purchase is convenience only.

## Play

1. **Enter World** from the title screen.
2. Walk to the town bursar (gold marker). Press **F** and connect the demo
   wallet, then pay **50 $WOC** for *Call of the Vault-Keeper*.
3. Press **6** (or tap the sigil on the action bar) to summon Bursar Claudius.
4. Press **F** on the bursar to open the Gilded Strongbox. Drag items between
   bags, bank, vault, and guild stash.
5. The bursar packs up after three minutes. Dismiss him early with **6** again.

### Controls

| Input | Action |
| --- | --- |
| WASD / arrows | Move. A/D turn when the camera is not held. |
| Hold right mouse | Look. Strafe with A/D while held. |
| Space | Jump |
| F | Interact (bursar or vendor) |
| B | Bags |
| 6 | Summon / dismiss the Vault-Keeper |
| Esc | Close the top window |
| Touch | Left stick moves, right stick looks, F and 6 on the mobile bar |

## What this demonstrates

- **Remote Strongbox access** through a summoned NPC, not a teleport or a
  floating window. You still walk up and press F.
- **Account-bound permit** minted against the live $WOC mint
  (`3WjLscH2JsXLEFJZRA9z8ti8yRGxWGKbqymPd7UicRth`). The browser preview runs a
  deterministic simulated ledger so the purchase, signature, logs, and permit
  PDA are inspectable without a live wallet.
- **Storage rules.** Bound and unique items stay out of the guild stash. The
  Character Vault is private. The Personal Bank is the 28-slot character bank.
- **No pay-to-win.** The permit unlocks the summon. It does not change combat.

Proposed for World of ClaudeCraft as a quality-of-life $WOC sink. The filled
Feature request form lives in [FEATURE_REQUEST.md](./FEATURE_REQUEST.md).

## Run locally

Needs Node 22+.

```bash
npm install
npm run dev
```

Then open the URL the dev server prints. `npm run build` and `npm run typecheck`
are the production and type gates.

## Layout

```
src/game/          3D vale, characters, input, collision
src/components/hud Classic-era HUD, bags, Strongbox, wallet
src/lib/woc/       $WOC mint, permit program, simulated purchase
src/lib/items.ts   Item defs and bag / bank / vault / guild rules
src/store/         Game state
public/art         Title splash, player and bursar portraits
public/icons       Inventory icons
```

## License

MIT. World of ClaudeCraft is a separate project with its own license. This
prototype is an independent demo of a proposed feature.

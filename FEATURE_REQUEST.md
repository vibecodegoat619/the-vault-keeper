# Feature request for World of ClaudeCraft

This is the filled [Feature request](https://github.com/levy-street/world-of-claudecraft/blob/main/.github/ISSUE_TEMPLATE/feature_request.yml)
form, ready to file at
https://github.com/levy-street/world-of-claudecraft/issues/new/choose

---

### Before you start

- [x] I searched [existing issues](https://github.com/levy-street/world-of-claudecraft/issues) and didn't find a duplicate.

Searched open and closed issues for vault-keeper, bound bursar, portable banker, remote Strongbox, and field bank access. Personal bank (#492) and guild bank (#660) already shipped. The closest prior write-up is closed #3955 (not planned). This request is a new one: same player problem, backed by a playable in-world prototype rather than a sim-only sketch.

### What problem does this solve?

As a player, I can only open The Gilded Strongbox at a hub bursar. A full bags run in the field means a hearth or a long walk, even when I already own bank space and a guild chest. That is travel tax, not a skill check.

Classic-era MMOs sold this as a convenience reagent (portable banker, remote guild bank). World of ClaudeCraft already has the storage. It does not have a way to reach it off the road without selling power.

$WOC is already the convenience rail (flair, Daily Rewards, WOC Store). There is no corresponding sink that lets a holder call the bursar to them.

### Proposed solution

**Call of the Vault-Keeper.** A summonable NPC paid for in $WOC. Interacting opens the **same** Gilded Strongbox the town bursars open: Personal Bank, Character Vault, Guild Stash. Remote access is the product. The vault model does not change.

| | |
| --- | --- |
| Unlock | *Call of the Vault-Keeper*, 50 $WOC, account-wide, permanent, no combat stats |
| Call | Use the sigil from the action bar (slot 6 in the prototype). The bursar appears in front of the player |
| Interact | F / click opens The Gilded Strongbox |
| Duration | 3 minutes, then he packs up |
| Cooldown | 3 minutes from summon (the prototype uses a short demo cooldown) |
| Economy | SPL $WOC (`3WjLscH2JsXLEFJZRA9z8ti8yRGxWGKbqymPd7UicRth`). One permit per account. Replay-protected by signature |

**Guild Stash rules stay server-side.** Bound items, unique items, and quest papers are refused. Roster is enough for this first version; finer rank gates can follow #660.

**Nothing bought here grants stats, gear, drop rates, or progression.** Wallet linking stays optional and non-custodial. The game server never holds keys. The client sends "I used the permit here." The sim decides whether the bursar appears.

Playable reference (3D vale, WASD + touch, vendor purchase, summon, Strongbox drag-and-drop, simulated $WOC ledger):

https://github.com/vibecodegoat619/the-vault-keeper

This is a proposal, not a paste. A follow-up PR would port onto the existing seams:

- VaultKeeper -> `src/sim/` behind `SimContext`. New `IWorld` facet, implemented on both `Sim` and `ClientWorld`, pinned in `tests/world_api_parity.test.ts`.
- Permit item -> `src/sim/content/` (items, deeds). Wiki regen: `npm run wiki:content`.
- Strongbox tabs -> extend `src/ui/bank_window.ts` / `bank_view.ts`. Do not grow `hud.ts`.
- $WOC verify -> `server/http/` as a `RouteDef`. Observe the Solana signature, then grant the permit on the account row. Never trust a client-sent "I paid."
- Copy -> English keys in `src/ui/i18n.catalog/`. No em dashes, no emojis. Sim emits keys.

Suggested PR (against the current `release/vX.Y.Z` branch, never `main`):

```
feat(strongbox): add Call of the Vault-Keeper remote bank NPC

Players buy an account-wide permit for 50 $WOC and summon a bursar who
opens The Gilded Strongbox anywhere in the world. Convenience only: no
stats, no gear, no progression.
```

One NPC, one item, one window. Not the marketplace, not housing, not any other $WOC sink.

### Alternatives considered

- Town-only bankers (status quo). Works, but field access is still missing.
- Instant remote bank window, no NPC. Faster, but it skips the normal interact flow (proximity, F, a body in the world).
- Coin / Claudium price. Mixes this into the gold sink. $WOC is the existing convenience rail.
- Consumed reagent per summon. Turns QoL into a tax. This proposal: buy once.
- Per-character permit. Cleaner with per-character vaults, worse for alts. This proposal: account-wide.
- Closed #3955 used a 25 $WOC Strongbox Charter and a 2 minute / 3 minute timer. This request keeps the same player-facing idea, raises the price to 50 $WOC to match the playable prototype, and shows the summon as a real body in the world rather than a window that pops from a bag click.

### Area

Content (zones, dungeons, quests, items)

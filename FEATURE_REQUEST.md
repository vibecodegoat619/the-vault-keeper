# Feature request for World of ClaudeCraft

**Submit this form:** [Open Feature request (all fields filled)](https://github.com/levy-street/world-of-claudecraft/issues/new?template=feature_request.yml&title=Call%20of%20the%20Vault-Keeper%3A%20summon%20Bursar%20Claudius%20for%20remote%20Gilded%20Strongbox%20access&problem=As%20a%20player%2C%20I%20can%20only%20open%20The%20Gilded%20Strongbox%20at%20a%20hub%20bursar.%20A%20full%20bags%20run%20in%20the%20field%20means%20a%20hearth%20or%20a%20long%20walk%2C%20even%20when%20I%20already%20own%20bank%20space%20and%20a%20guild%20chest.%20That%20is%20travel%20tax%2C%20not%20a%20skill%20check.%0A%0AClassic-era%20MMOs%20sold%20this%20as%20a%20convenience%20reagent%20%28portable%20banker%2C%20remote%20guild%20bank%29.%20World%20of%20ClaudeCraft%20already%20has%20the%20storage.%20It%20does%20not%20have%20a%20way%20to%20reach%20it%20off%20the%20road%20without%20selling%20power.%0A%0A%24WOC%20is%20already%20the%20convenience%20rail%20%28flair%2C%20Daily%20Rewards%2C%20WOC%20Store%29.%20There%20is%20no%20corresponding%20sink%20that%20lets%20a%20holder%20call%20the%20bursar%20to%20them.%0A%0ASearched%20existing%20issues%3A%20personal%20bank%20%28%23492%29%20and%20guild%20bank%20%28%23660%29%20already%20shipped.%20Closest%20prior%20write-up%20is%20closed%20%233955%20%28not%20planned%29.%20This%20is%20a%20new%20request%20backed%20by%20a%20playable%20in-world%20prototype%3A%20https%3A%2F%2Fgithub.com%2Fvibecodegoat619%2Fthe-vault-keeper&proposal=Call%20of%20the%20Vault-Keeper.%20A%20summonable%20NPC%20paid%20for%20in%20%24WOC.%20Interacting%20opens%20the%20SAME%20Gilded%20Strongbox%20the%20town%20bursars%20open%3A%20Personal%20Bank%2C%20Character%20Vault%2C%20Guild%20Stash.%20Remote%20access%20is%20the%20product.%20The%20vault%20model%20does%20not%20change.%0A%0AUnlock%3A%20Call%20of%20the%20Vault-Keeper%2C%2050%20%24WOC%2C%20account-wide%2C%20permanent%2C%20no%20combat%20stats%0ACall%3A%20use%20the%20sigil%20from%20the%20action%20bar%20%28slot%206%20in%20the%20prototype%29.%20The%20bursar%20appears%20in%20front%20of%20the%20player%0AInteract%3A%20F%20%2F%20click%20opens%20The%20Gilded%20Strongbox%0ADuration%3A%203%20minutes%2C%20then%20he%20packs%20up%0ACooldown%3A%203%20minutes%20from%20summon%20%28the%20prototype%20uses%20a%20short%20demo%20cooldown%29%0AEconomy%3A%20SPL%20%24WOC%20%283WjLscH2JsXLEFJZRA9z8ti8yRGxWGKbqymPd7UicRth%29.%20One%20permit%20per%20account.%20Replay-protected%20by%20signature%0A%0AGuild%20Stash%20rules%20stay%20server-side.%20Bound%20items%2C%20unique%20items%2C%20and%20quest%20papers%20are%20refused.%0A%0ANothing%20bought%20here%20grants%20stats%2C%20gear%2C%20drop%20rates%2C%20or%20progression.%20Wallet%20linking%20stays%20optional%20and%20non-custodial.%20The%20game%20server%20never%20holds%20keys.%20The%20client%20sends%20%22I%20used%20the%20permit%20here.%22%20The%20sim%20decides%20whether%20the%20bursar%20appears.%0A%0APlayable%20reference%3A%20https%3A%2F%2Fgithub.com%2Fvibecodegoat619%2Fthe-vault-keeper%0A%0AThis%20is%20a%20proposal%2C%20not%20a%20paste.%20A%20follow-up%20PR%20would%20port%20onto%20existing%20seams%3A%0A-%20VaultKeeper%20-%3E%20src%2Fsim%2F%20behind%20SimContext.%20New%20IWorld%20facet%20on%20Sim%20and%20ClientWorld%2C%20pinned%20in%20tests%2Fworld_api_parity.test.ts%0A-%20Permit%20item%20-%3E%20src%2Fsim%2Fcontent%2F%20%28items%2C%20deeds%29.%20Wiki%20regen%3A%20npm%20run%20wiki%3Acontent%0A-%20Strongbox%20tabs%20-%3E%20extend%20src%2Fui%2Fbank_window.ts%20%2F%20bank_view.ts.%20Do%20not%20grow%20hud.ts%0A-%20%24WOC%20verify%20-%3E%20server%2Fhttp%2F%20as%20a%20RouteDef.%20Observe%20the%20Solana%20signature%2C%20then%20grant%20the%20permit%20on%20the%20account%20row.%20Never%20trust%20a%20client-sent%20%22I%20paid.%22%0A-%20Copy%20-%3E%20English%20keys%20in%20src%2Fui%2Fi18n.catalog%2F.%20No%20em%20dashes%2C%20no%20emojis.%20Sim%20emits%20keys.%0A%0ASuggested%20PR%20against%20the%20current%20release%2FvX.Y.Z%20branch%2C%20never%20main%3A%0A%0Afeat%28strongbox%29%3A%20add%20Call%20of%20the%20Vault-Keeper%20remote%20bank%20NPC%0A%0AOne%20NPC%2C%20one%20item%2C%20one%20window.%20Not%20the%20marketplace%2C%20not%20housing%2C%20not%20any%20other%20%24WOC%20sink.&alternatives=Town-only%20bankers%20%28status%20quo%29.%20Works%2C%20but%20field%20access%20is%20still%20missing.%0AInstant%20remote%20bank%20window%2C%20no%20NPC.%20Faster%2C%20but%20it%20skips%20the%20normal%20interact%20flow%20%28proximity%2C%20F%2C%20a%20body%20in%20the%20world%29.%0ACoin%20%2F%20Claudium%20price.%20Mixes%20this%20into%20the%20gold%20sink.%20%24WOC%20is%20the%20existing%20convenience%20rail.%0AConsumed%20reagent%20per%20summon.%20Turns%20QoL%20into%20a%20tax.%20This%20proposal%3A%20buy%20once.%0APer-character%20permit.%20Cleaner%20with%20per-character%20vaults%2C%20worse%20for%20alts.%20This%20proposal%3A%20account-wide.%0AClosed%20%233955%20used%20a%2025%20%24WOC%20Strongbox%20Charter%20and%20a%202%20minute%20%2F%203%20minute%20timer.%20This%20request%20keeps%20the%20same%20player-facing%20idea%2C%20raises%20the%20price%20to%2050%20%24WOC%20to%20match%20the%20playable%20prototype%2C%20and%20shows%20the%20summon%20as%20a%20real%20body%20in%20the%20world%20rather%20than%20a%20window%20that%20pops%20from%20a%20bag%20click.&area=Content%20%28zones%2C%20dungeons%2C%20quests%2C%20items%29)

That link opens the official Feature request template on levy-street/world-of-claudecraft with every field already filled. Check **Before you start**, then Submit.

The GitHub App connected to this account can write to **vibecodegoat619** repositories, but it cannot create issues on levy-street's repo (the app is not installed there).

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

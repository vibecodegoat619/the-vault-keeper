export type Quality = "poor" | "common" | "uncommon" | "rare" | "epic" | "legendary";

export type ItemId =
  | "sigil"
  | "ore"
  | "herb"
  | "potion"
  | "sword"
  | "tabard"
  | "letter"
  | "strongbox";

export type ItemDef = {
  id: ItemId;
  name: string;
  icon: string;
  quality: Quality;
  stack: number;
  bound?: boolean;
  unique?: boolean;
  guildForbidden?: boolean;
  flavor: string;
};

export const ITEMS: Record<ItemId, ItemDef> = {
  sigil: {
    id: "sigil",
    name: "Call of the Vault-Keeper",
    icon: "/icons/sigil.png",
    quality: "legendary",
    stack: 1,
    bound: true,
    unique: true,
    guildForbidden: true,
    flavor:
      "A bronze vault-key bound in $WOC. Use from the action bar to summon Bursar Claudius anywhere in the world.",
  },
  ore: {
    id: "ore",
    name: "Copper Ore",
    icon: "/icons/ore.png",
    quality: "common",
    stack: 20,
    flavor: "Rough copper from the Vale dig. The town smith will take a stack.",
  },
  herb: {
    id: "herb",
    name: "Valeleaf",
    icon: "/icons/herb.png",
    quality: "common",
    stack: 20,
    flavor: "A common herb of Eastbrook Vale. Smells of crushed mint and rain.",
  },
  potion: {
    id: "potion",
    name: "Healing Draught",
    icon: "/icons/potion.png",
    quality: "uncommon",
    stack: 5,
    flavor: "Restores a modest amount of health. The glass is still warm.",
  },
  sword: {
    id: "sword",
    name: "Worn Shortsword",
    icon: "/icons/sword.png",
    quality: "common",
    stack: 1,
    flavor: "A starter blade. The fuller is nicked from wolf hide.",
  },
  tabard: {
    id: "tabard",
    name: "Eastbrook Company Tabard",
    icon: "/icons/tabard.png",
    quality: "rare",
    stack: 1,
    bound: true,
    flavor: "Guild colours. Folded with care in the Company stash.",
  },
  letter: {
    id: "letter",
    name: "Deed of Eastbrook",
    icon: "/icons/letter.png",
    quality: "uncommon",
    stack: 1,
    bound: true,
    guildForbidden: true,
    flavor: "A sealed writ naming this character to a vault shelf in the Gilded Strongbox.",
  },
  strongbox: {
    id: "strongbox",
    name: "Miniature Strongbox",
    icon: "/icons/strongbox.png",
    quality: "epic",
    stack: 1,
    flavor: "A keepsake model of the Gilded Strongbox. Purely ornamental.",
  },
};

export type Slot = { id: ItemId; count: number } | null;

export const BAG_SIZE = 16;
export const BANK_SIZE = 28;
export const VAULT_SIZE = 16;
export const GUILD_SIZE = 20;

export function emptySlots(n: number): Slot[] {
  return Array.from({ length: n }, () => null);
}

export function canStore(id: ItemId, where: "bags" | "bank" | "vault" | "guild"): boolean {
  const def = ITEMS[id];
  if (where === "guild" && (def.guildForbidden || def.unique)) return false;
  return true;
}

export function stackInto(slots: Slot[], id: ItemId, count: number): { slots: Slot[]; leftover: number } {
  const def = ITEMS[id];
  const next = slots.slice();
  let left = count;
  if (def.stack > 1) {
    for (let i = 0; i < next.length && left > 0; i++) {
      const s = next[i];
      if (s && s.id === id && s.count < def.stack) {
        const add = Math.min(def.stack - s.count, left);
        next[i] = { id, count: s.count + add };
        left -= add;
      }
    }
  }
  for (let i = 0; i < next.length && left > 0; i++) {
    if (!next[i]) {
      const add = Math.min(def.stack, left);
      next[i] = { id, count: add };
      left -= add;
    }
  }
  return { slots: next, leftover: left };
}

export function startingBags(): Slot[] {
  const bags = emptySlots(BAG_SIZE);
  bags[0] = { id: "sword", count: 1 };
  bags[1] = { id: "ore", count: 12 };
  bags[2] = { id: "herb", count: 8 };
  bags[3] = { id: "potion", count: 3 };
  bags[4] = { id: "letter", count: 1 };
  return bags;
}

export function startingVault(): Slot[] {
  const v = emptySlots(VAULT_SIZE);
  v[0] = { id: "strongbox", count: 1 };
  return v;
}

export function startingGuild(): Slot[] {
  const g = emptySlots(GUILD_SIZE);
  g[0] = { id: "potion", count: 5 };
  g[1] = { id: "ore", count: 20 };
  g[2] = { id: "tabard", count: 1 };
  g[3] = { id: "herb", count: 14 };
  return g;
}

export function copperToParts(copper: number) {
  const g = Math.floor(copper / 10000);
  const s = Math.floor((copper % 10000) / 100);
  const c = copper % 100;
  return { g, s, c };
}

export function formatMoney(copper: number): string {
  const { g, s, c } = copperToParts(copper);
  return `${g}g ${s}s ${c}c`;
}

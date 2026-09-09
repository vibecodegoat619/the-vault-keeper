/** $WOC mint on Solana mainnet-beta (the live World of ClaudeCraft token). */
export const WOC_MINT = "3WjLscH2JsXLEFJZRA9z8ti8yRGxWGKbqymPd7UicRth";

/** Demo program that gates the Vault-Keeper summon permit. */
export const VAULT_KEEPER_PROGRAM_ID = "VKPrmtCLD1Gild3dStr0ngx1111111111111111111";

/** Treasury PDA that receives $WOC on purchase. */
export const TREASURY_ADDRESS = "Gild3dBursarTreasury111111111111111111111";

export const WOC_DECIMALS = 6;
export const PERMIT_PRICE_WOC = 50;
export const PERMIT_PRICE_BASE = BigInt(PERMIT_PRICE_WOC) * 10n ** BigInt(WOC_DECIMALS);

export const CLUSTER = "simulated-mainnet";

export type InstructionKind = "initialize" | "purchase_permit" | "query_permit";

export type EncodedInstruction = {
  programId: string;
  kind: InstructionKind;
  discriminator: number;
  data: Uint8Array;
  hex: string;
  accounts: { name: string; pubkey: string; writable: boolean; signer: boolean }[];
};

export type Transaction = {
  signature: string;
  slot: number;
  blockTime: number;
  feeLamports: number;
  status: "processing" | "confirmed" | "finalized" | "failed";
  error?: string;
  instruction: EncodedInstruction;
  logs: string[];
};

export type PermitAccount = {
  owner: string;
  unlocked: boolean;
  purchasedAt: number;
  txSignature: string;
  pricePaid: string;
};

export type WalletAccount = {
  publicKey: string;
  secretSeed: string;
  connected: boolean;
  label: string;
};

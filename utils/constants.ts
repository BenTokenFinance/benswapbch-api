import { ChainId, Token } from "@pancakeswap-libs/sdk";

// SEP-20 addresses.
export const EBEN = "0x77CB87b57F54667978Eb1B199b28a0db8C8E1c0B";
export const WBCH = "0x3743eC0673453E5009310C727Ba4eaF7b3a1cc04";
export const DEAD = "0x000000000000000000000000000000000000dEaD";
export const BLACKHOLE = "0x0000000000000000000000000000000000000000";

// Contract addresses.
export const EBEN_BCH_BENSWAP_LP = "0x0D4372aCc0503Fbcc7EB129e0De3283c348B82c3";
export const MULTICALL_CONTRACT = "0x1b38EBAd553f218e2962Cb1C0539Abb5d6A37774";
export const MASTERCHEF_CONTRACT = "0xDEa721EFe7cBC0fCAb7C8d65c598b21B6373A2b6";
// ---
export const LOTTERY_CONTRACT = "0xd24d70B77db78bF8Bb7017a94be575Fb172C6C15";
export const TEMPLE_CONTRACT = "0x5e5C3AEC925Ae281DAFe8Ca5777E7Ab021De755c";

export const EBEN_TOKEN = new Token(ChainId.MAINNET, EBEN, 18);
export const WBCH_TOKEN = new Token(ChainId.MAINNET, WBCH, 18);
export const EBEN_WBCH_BENSWAP_LP_TOKEN = new Token(ChainId.MAINNET, EBEN_BCH_BENSWAP_LP, 18);

// RPC URLs
export const RPC = {
    "uat": "https://global.uat.cash/",
    "fountainhead": "https://smartbch.fountainhead.cash/mainnet",
    "greyhat": "https://smartbch.greyh.at"
} 

import { ChainId, Token } from "@pancakeswap-libs/sdk";

// SEP-20 addresses.
export const EBEN = "0x77CB87b57F54667978Eb1B199b28a0db8C8E1c0B";
export const WBCH = "0x3743eC0673453E5009310C727Ba4eaF7b3a1cc04";
export const FLEXUSD = "0x7b2B3C5308ab5b2a1d9a94d20D35CCDf61e05b72";
export const LAW = "0x0b00366fBF7037E9d75E4A569ab27dAB84759302";
export const DEAD = "0x000000000000000000000000000000000000dEaD";
export const BLACKHOLE = "0x0000000000000000000000000000000000000000";

// Contract addresses.
export const EBEN_BCH_BENSWAP_LP = "0x0D4372aCc0503Fbcc7EB129e0De3283c348B82c3";
export const EBEN_BCH_MISTSWAP_LP = "0x80F712670d268cf2C05e7162674c7466c940eBE3";
export const MULTICALL_CONTRACT = "0x1b38EBAd553f218e2962Cb1C0539Abb5d6A37774";
export const MASTERCHEF_CONTRACT = "0xDEa721EFe7cBC0fCAb7C8d65c598b21B6373A2b6";
// ---
export const LOTTERY_CONTRACT = "0xd24d70B77db78bF8Bb7017a94be575Fb172C6C15";
export const LOTTERY_TICKET_CONTRACT = "0xFc82061Fe93C1DeF8D6dD5D6865B383C543a1315";
export const TEMPLE_CONTRACT = "0x5e5C3AEC925Ae281DAFe8Ca5777E7Ab021De755c";

export const EBEN_TOKEN = new Token(ChainId.MAINNET, EBEN, 18);
export const WBCH_TOKEN = new Token(ChainId.MAINNET, WBCH, 18);
export const EBEN_WBCH_BENSWAP_LP_TOKEN = new Token(ChainId.MAINNET, EBEN_BCH_BENSWAP_LP, 18);

// AMM Related
export const DEX = {
    BENSWAP: "ben",
    MISTSWAP: "mist",
    COWSWAP: "cow",
    TANGOSWAP: "tango",
    ONEBCH: "onebch",
    TROPICALFINANCE: "tropical",
    EMBERSWAP: "ember",
    LAWSWAP: "law",
    VERSEDEX: "verse"
}

export const FACTORY = {
    [DEX.BENSWAP]: {
        address: "0x8d973bAD782c1FFfd8FcC9d7579542BA7Dd0998D",
        name: "BenSwap"
    },
    [DEX.MISTSWAP]: {
        address: "0x6008247F53395E7be698249770aa1D2bfE265Ca0",
        name: "MistSwap"
    },
    [DEX.COWSWAP]: {
        address: "0x72cd8c0B5169Ff1f337E2b8F5b121f8510b52117",
        name: "CowSwap"
    },
    [DEX.TANGOSWAP]: {
        address: "0x2F3f70d13223EDDCA9593fAC9fc010e912DF917a",
        name: "TangoSwap"
    },
    [DEX.ONEBCH]: {
        address: "0x3dC4e6aC26df957a908cfE1C0E6019545D08319b",
        name: "1BCH"
    },
    [DEX.TROPICALFINANCE]: {
        address: "0x138504000feaEd02AD75B1e8BDb904f51C445F4C",
        name: "TropicalFinance"
    },
    [DEX.EMBERSWAP]: {
        address: "0xE62983a68679834eD884B9673Fb6aF13db740fF0",
        name: "EmberSwap"
    },
    [DEX.LAWSWAP]: {
        address: "0x3A2643c00171b1EA6f6b6EaC77b1E0DdB02c3a62",
        name: "LawSwap"
    },
    [DEX.VERSEDEX]: {
        address: "0x16bc2B187D7C7255b647830C05a6283f2B9A3AF8",
        name: "Verse"
    }
};


// RPC URLs
export const RPC = {
    "uat": "https://global.uat.cash",
    "fountainhead": "https://smartbch.fountainhead.cash/mainnet",
    "greyhat": "https://smartbch.greyh.at"
} 
export const RPC_ARCHIVE = {
    '0': "http://52.77.220.215:8545"
}

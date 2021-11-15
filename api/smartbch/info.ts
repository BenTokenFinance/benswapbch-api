import { NowRequest, NowResponse } from "@vercel/node";
import { RPC } from "../../utils/constants";
import { getLatestBlock } from "../../utils/web3";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const result = {
        block: await getLatestBlock(),
        chainId: 10000,
        symbol: "BCH",
        explorer: "https://www.smartscan.cash/",
        rpcs: RPC
    }

    res.json(result);
};

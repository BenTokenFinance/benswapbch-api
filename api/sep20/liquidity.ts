import { NowRequest, NowResponse } from "@vercel/node";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import { getLiquidity } from "../../utils/liquidity";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;

    let result = {};

    if (Web3.utils.isAddress(String(id))) {
        result = await getLiquidity(id);
    }

    res.json(result);
};

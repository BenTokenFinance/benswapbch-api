import { NowRequest, NowResponse } from "@vercel/node";
import BigNumber from "bignumber.js";
import { getLiquidity } from "../../utils/liquidity";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;

    let result = {};

    if (id) {
        result = await getLiquidity(id);
    }

    res.json(result);
};

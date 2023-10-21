import { NowRequest, NowResponse } from "@vercel/node";
import { getTotalSupplyByAddress } from "../../utils/supply";
import { getTokenInfo } from "../../utils/others";
import BigNumber from "bignumber.js";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;

    let result = {};

    if (id) {
        const info = await getTokenInfo(id);
        if (info && info.address && info.address.toLowerCase() === String(id).toLowerCase()) {
            info.logo = `https://assets.benswap.cash/assets/${info.address}/logo.png`;
            info.supply = (await getTotalSupplyByAddress(info.address)).div(new BigNumber(10).pow(info.decimals||0)).toNumber();
            result = info;
        }
    }

    res.json(result);
};

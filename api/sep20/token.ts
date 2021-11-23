import { NowRequest, NowResponse } from "@vercel/node";
import { getTotalSupplyByAddress } from "../../utils/supply";
import { getSep20Assets } from "../../utils/others";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;

    let result = {};

    if (id) {
        const assets = await getSep20Assets();
        const found = assets.find((asset: any) => asset.address.toLowerCase() === String(id).toLowerCase());
        if (found) {
            found.logo = `https://assets.benswap.cash/tokens/${found.address}.png`;
            found.supply = (await getTotalSupplyByAddress(found.address)).toString();
            result = found;
        }
    }

    res.json(result);
};

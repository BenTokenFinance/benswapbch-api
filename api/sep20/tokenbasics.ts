import { NowRequest, NowResponse } from "@vercel/node";
import { getTokenBasicData } from "../../utils/token";
import BigNumber from "bignumber.js";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;

    let result = {};

    if (id) {
        const found = await getTokenBasicData(id);
        if (found && found.name) {
            result = found;
        }
    }

    res.json(result);
};

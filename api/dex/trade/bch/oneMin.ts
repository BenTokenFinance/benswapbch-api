import { NowRequest, NowResponse } from "@vercel/node";
import { getTrades } from "../../../../utils/graphql";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const base = "BCH";
    const range = "1m";
    const { id, before } = req.query;

    let result = [];

    if (before === undefined){
        result = await getTrades(base, range, String(id).toLowerCase()) || [];
    } else {
        const t = Number(before);
        if ((!isNaN(t) && Number.isInteger(t) && t > 0)) {
            result = await getTrades(base, range, String(id).toLowerCase(), t) || [];
        }
    }

    res.json(result);
};

import { NowRequest, NowResponse } from "@vercel/node";
import { getTrades } from "../../utils/graphql";

const BASES = ["bch", "usd"];
const RANGES = ["1min", "15mins", "1h", "1d", "1w"];

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { base, range, id, before } = req.query;

    let result = [];

    if (base && BASES.indexOf(base as any) >= 0 && range && RANGES.indexOf(range as any) >= 0) {
        if (before === undefined){
            result = await getTrades(base, range, String(id).toLowerCase()) || [];
        } else {
            const t = Number(before);
            if ((!isNaN(t) && Number.isInteger(t) && t > 0)) {
                result = await getTrades(base, range, String(id).toLowerCase(), t) || [];
            }
        }
    }

    res.json(result);
};

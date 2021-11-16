import { NowRequest, NowResponse } from "@vercel/node";
import { getPair } from "../../utils/graphql";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id, block } = req.query;

    const result = id ? await getPair(String(id).toLowerCase(), block) : {};
    res.json(result);
};

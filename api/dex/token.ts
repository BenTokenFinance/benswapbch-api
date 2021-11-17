import { NowRequest, NowResponse } from "@vercel/node";
import { getToken } from "../../utils/graphql";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id, block } = req.query;

    let result = {}
    if ( id && ( block === undefined || !(isNaN as any)(block) && Number.isInteger(Number(block)) && Number(block) > 0 ) ) {
        result = await getToken(String(id).toLowerCase(), block);
    }

    res.json(result);
};

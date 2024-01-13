import { NowRequest, NowResponse } from "@vercel/node";
import { getMetadata } from "../../utils/blindboxes";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { address, id } = req.query;

    const info = await getMetadata(address, id);
    
    res.json(info);
};

import { NowRequest, NowResponse } from "@vercel/node";
import { getMetadata } from "../../utils/antiagingpotion";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;

    const info = await getMetadata(id);
    
    res.json(info);
};

import { NowRequest, NowResponse } from "@vercel/node";
import { getMiscMetadata } from "../../utils/nftfactory";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;

    const info = await getMiscMetadata(id);
    
    res.json(info);
};

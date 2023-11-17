import { NowRequest, NowResponse } from "@vercel/node";
import { getGraveMetadata } from "../../utils/cemetery";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;

    const info = await getGraveMetadata(id);
    
    res.json(info);
};

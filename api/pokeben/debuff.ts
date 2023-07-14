import { NowRequest, NowResponse } from "@vercel/node";
import debuffs from "../../utils/pokeben/debuffs.json"

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    
    const debuff = (debuffs as any)[String(id)];

    if (debuff) {
        res.json(debuff);
    } else {
        res.json(debuffs);
    }
};

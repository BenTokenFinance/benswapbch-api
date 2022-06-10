import { NowRequest, NowResponse } from "@vercel/node";
import itemkinds from "../../utils/pokeben/itemkinds.json"

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    
    const itemkind = (itemkinds as any)[String(id)];

    if (itemkind) {
        res.json(itemkind);
    } else {
        res.json(itemkinds);
    }
};

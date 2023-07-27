import { NowRequest, NowResponse } from "@vercel/node";
import heroparttypes from "../../utils/pokeben/heroparttypes.json"

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    
    const heroparttype = (heroparttypes as any)[String(id)];

    if (heroparttype) {
        res.json(heroparttype);
    } else {
        res.json(heroparttypes);
    }
};

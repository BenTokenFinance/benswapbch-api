import { NowRequest, NowResponse } from "@vercel/node";
import rarities from "../../utils/pokeben/rarities.json";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    
    const rarity = (rarities as any)[String(id)];

    if (rarity) {
        res.setHeader("content-type", "text/plain");
        res.send(rarity);
    } else {
        res.json(rarities);
    }
};

import { NowRequest, NowResponse } from "@vercel/node";
import heroparts from "../../utils/pokeben/heroparts.json"

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    
    const heropart = (heroparts as any)[String(id)];

    if (heropart) {
        res.json(heropart);
    } else {
        res.json(heroparts);
    }
};

import { NowRequest, NowResponse } from "@vercel/node";
import abilities from "../../utils/pokeben/abilities.json";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    
    const ability = (abilities as any)[String(id)];

    if (ability) {
        res.json(ability);
    } else {
        res.json(abilities);
    }
};

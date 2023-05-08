import { NowRequest, NowResponse } from "@vercel/node";
import abilitycategories from "../../utils/pokeben/abilitycategories.json";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    
    const category = (abilitycategories as any)[String(id)];

    if (category) {
        res.json(category);
    } else {
        res.json(abilitycategories);
    }
};

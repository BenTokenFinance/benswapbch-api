import { NowRequest, NowResponse } from "@vercel/node";
import itemsources from "../../utils/pokeben/itemsources.json";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    
    const itemsource = (itemsources as any)[String(id)];

    if (itemsource) {
        res.setHeader("content-type", "text/plain");
        res.send(itemsource);
    } else {
        res.json(itemsources);
    }
};

import { NowRequest, NowResponse } from "@vercel/node";
import sources from "../../utils/pokeben/sources.json";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    
    const source = (sources as any)[String(id)];

    if (source) {
        res.setHeader("content-type", "text/plain");
        res.send(source);
    } else {
        res.json(sources);
    }
};

import { NowRequest, NowResponse } from "@vercel/node";
import types from "../../utils/pokeben/types.json";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    
    const type = (types as any)[String(id)];

    if (type) {
        res.setHeader("content-type", "text/plain");
        res.send(type);
    } else {
        res.json(types);
    }
};

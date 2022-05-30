import { NowRequest, NowResponse } from "@vercel/node";
import kinds from "../../utils/pokeben/bens.json";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    
    const kind = (kinds as any)[String(id)];

    if (kind) {
        res.json(kind);
    } else {
        res.json(kinds);
    }
};

import { NowRequest, NowResponse } from "@vercel/node";
import buffs from "../../utils/pokeben/buffs.json"

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    
    const buff = (buffs as any)[String(id)];

    if (buff) {
        res.json(buff);
    } else {
        res.json(buffs);
    }
};

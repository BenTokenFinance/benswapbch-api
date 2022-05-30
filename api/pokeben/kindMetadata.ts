import { NowRequest, NowResponse } from "@vercel/node";
import { buildKindAttributes } from "../../utils/pokeben";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    
    res.json({
        image: `https://asset.benswap.cash/games/pokeben/${id}/1024.png`,
        attributes: buildKindAttributes(String(id))
    });
};

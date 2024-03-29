import { NowRequest, NowResponse } from "@vercel/node";
import { buildHeroMetadata, getPokeBenHeroTestInfo } from "../../utils/pokeben";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;

    const {parts, stats, name} = await getPokeBenHeroTestInfo(id);
    
    res.json(buildHeroMetadata(id,parts,stats,name));
};

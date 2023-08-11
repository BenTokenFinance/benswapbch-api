import { NowRequest, NowResponse } from "@vercel/node";
import { buildHeroMetadata, getPokeBenHeroInfo } from "../../utils/pokeben";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;

    const {parts, stats, name} = await getPokeBenHeroInfo(id);
    
    res.json(buildHeroMetadata(id,parts,stats,name));
};

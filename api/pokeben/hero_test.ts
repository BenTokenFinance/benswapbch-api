import { NowRequest, NowResponse } from "@vercel/node";
import { buildHeroMetadata, getPokeBenHeroTestInfo } from "../../utils/pokeben";
import sources from "../../utils/pokeben/sources.json";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;

    const parts = await getPokeBenHeroTestInfo(id);
    
    res.json(buildHeroMetadata(id,parts));
};

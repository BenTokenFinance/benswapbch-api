import { NowRequest, NowResponse } from "@vercel/node";
import { buildKindAttributes, getPokeBenRawData } from "../../utils/pokeben";
import sources from "../../utils/pokeben/sources.json";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;

    const { info, name, abilities } = await getPokeBenRawData(id);
    
    const attrs = buildKindAttributes(info.kind, abilities.map((a:any)=>Number(a)));
    attrs.push({
        "trait_type": "Source",
        "value": (sources as any)[info.source]
    }, {
        "trait_type": "Level",
        "value": info.level
    }, {
        "trait_type": "Power",
        "value": info.power
    });
    
    res.json({
        name: `${name||'PokéBen'} #${id}`,
        description: "PokéBen - An NFT-based game on BenSwap.Cash.",
        image: `https://asset.benswap.cash/games/pokeben/${info.kind}/1024.png`,
        attributes: attrs
    });
};

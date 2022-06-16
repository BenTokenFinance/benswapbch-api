import { NowRequest, NowResponse } from "@vercel/node";
import { getPokeBenItemInfo, buildItemKindAttributes } from "../../utils/pokeben";
import itemsources from "../../utils/pokeben/itemsources.json";
import itemkinds from "../../utils/pokeben/itemkinds.json";
import itemtypes from "../../utils/pokeben/itemtypes.json";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;

    const info = await getPokeBenItemInfo(id);
    const kind = (itemkinds as any)[info.kind];

    const attrs = [];
    attrs.push({
        "trait_type": "Source",
        "value": (itemsources as any)[info.source]
    });
    attrs.push(...buildItemKindAttributes(info.kind));
    
    res.json({
        name: `[PokéBen Item #${id}] ${kind.name}`,
        description: kind.desc,
        image: `https://asset.benswap.cash/games/pokebenitem/${info.kind}/560.png`,
        attributes: attrs
    });
};

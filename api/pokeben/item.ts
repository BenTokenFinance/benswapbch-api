import { NowRequest, NowResponse } from "@vercel/node";
import { getPokeBenItemInfo, buildItemKindAttributes, getItemKindImg } from "../../utils/pokeben";
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

    const img = getItemKindImg(info.kind);
    
    res.json({
        name: `${kind.name} (#${id})`,
        ...(kind.desc ? {description: kind.desc} : {}),
        ...(img?{image:img}:{}),
        attributes: attrs
    });
};

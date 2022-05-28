import { NowRequest, NowResponse } from "@vercel/node";
import rarities from "../../utils/pokeben/rarities.json";
import abilities from "../../utils/pokeben/abilities.json";
import types from "../../utils/pokeben/types.json";
import bens from "../../utils/pokeben/bens.json";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    
    console.log(id);

    console.log(bens);

    const ben = (bens as any)[String(id)];
    
    console.log(ben);

    if (ben) {
        const attrs = [];
        // Kind
        attrs.push({
            "trait_type": "Kind",
            "value": `#${id} ${ben.name}`
        });
        // Rarity
        attrs.push({
            "trait_type": "Rarity",
            "value": (rarities as any)[ben.rarity]
        });
        // Types
        if (ben.types && ben.types.length) {
            ben.types.forEach((t:any, i:any) => {
                attrs.push({
                    "trait_type": `Type ${i+1}`,
                    "value": (types as any)[t]
                });
            });
        }
        // Abilities
        if (ben.abilities && ben.abilities.length) {
            ben.abilities.forEach((a:any, i:any) => {
                attrs.push({
                    "trait_type": `Ability ${i+1}`,
                    "value": (abilities as any)[i].name
                });
            });
        }

        res.json({
            image: `https://asset.benswap.cash/games/pokeben/test/${id}.png`,
            attributes: attrs
        });
    }

    res.setHeader("content-type", "text/plain");
    res.send("Error!");
};

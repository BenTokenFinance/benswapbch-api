import { NowRequest, NowResponse } from "@vercel/node";
import { getRaritySettings } from "../../utils/pokeben";
import rarities from "../../utils/pokeben/rarities.json";
import kinds from "../../utils/pokeben/bens.json";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const settings = await getRaritySettings();

    const c = Object.values(settings).reduce((combined: Array<any>, arr: any) => {
        return combined.concat(arr);
    }, []);
    const k = Object.keys(kinds as any);
    // Test duplication
    const duplications = c.filter( (val, index) =>  index !== c.indexOf(val));
    // Test missing
    const missing = k.filter((val, index) => c.indexOf(val) < 0);

    // Test rarity correctness
    const incorrectRarityKinds:any = [];
    Object.keys(settings).forEach((k:any)=> {
        settings[k].forEach((kind:any) => {
            const r = (kinds as any)[kind].rarity;
            if (r != k) incorrectRarityKinds.push(`${k}-${kind}: Should be ${r}`);
        });
    });
    
    res.json({
        settings,
        duplications,
        incorrectRarityKinds,
        missing
    });
};

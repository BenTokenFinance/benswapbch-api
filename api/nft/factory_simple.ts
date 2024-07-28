import { NowRequest, NowResponse } from "@vercel/node";
import { getSimpleSeriesData } from "../../utils/nftfactory";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { address, id } = req.query;

    const info = await getSimpleSeriesData(address, id);
    
    res.json(info);
};

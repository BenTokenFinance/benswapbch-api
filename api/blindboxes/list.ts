import { NowRequest, NowResponse } from "@vercel/node";
import { contracts } from "../../utils/blindboxes";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    res.json(contracts);
};

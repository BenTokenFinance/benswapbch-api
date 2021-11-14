import { NowRequest, NowResponse } from "@vercel/node";
import { getBchPrice } from "../utils/others";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const body = await getBchPrice();
    res.json(body);
};
  
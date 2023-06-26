import { NowRequest, NowResponse } from "@vercel/node";
import { getBchBbusdtPrice } from "../../utils/price";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const body = await getBchBbusdtPrice();
    res.setHeader("content-type", "text/plain");
    res.send(body);
};

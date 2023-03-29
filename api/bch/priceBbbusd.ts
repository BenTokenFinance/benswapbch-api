import { NowRequest, NowResponse } from "@vercel/node";
import { getBchBbbusdPrice } from "../../utils/price";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const body = await getBchBbbusdPrice();
    res.setHeader("content-type", "text/plain");
    res.send(body);
};

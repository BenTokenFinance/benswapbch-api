import { NowRequest, NowResponse } from "@vercel/node";
import { getSbchBbusdtPrice } from "../../utils/price";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const body = await getSbchBbusdtPrice();
    res.setHeader("content-type", "text/plain");
    res.send(body);
};

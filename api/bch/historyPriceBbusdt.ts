import { NowRequest, NowResponse } from "@vercel/node";
import { getHistorySbchBbusdtPrice } from "../../utils/price";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const { block } = req.query;

  const result = await getHistorySbchBbusdtPrice(block);

  res.setHeader("content-type", "text/plain");
  res.send(result||"");
};

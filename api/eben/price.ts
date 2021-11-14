import { NowRequest, NowResponse } from "@vercel/node";
import { getEbenPricePerBCH } from "../../utils/price";
import { getBchPrice } from "../../utils/others";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const { block } = req.query;
  const ebenPricePerBch = await getEbenPricePerBCH(block as string);
  const bchPrice = (await getBchPrice())["bitcoin-cash"].usd;
  res.setHeader("content-type", "text/plain");
  res.send((ebenPricePerBch*bchPrice).toFixed(3));
};

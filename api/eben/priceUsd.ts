import { NowRequest, NowResponse } from "@vercel/node";
import { getEbenUsdPrice } from "../../utils/price";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const { block } = req.query;
  const ebenPrice = await getEbenUsdPrice(block as string);
  res.send(ebenPrice.toFixed(3));
};

import { NowRequest, NowResponse } from "@vercel/node";
import { getEbenBchPrice } from "../../utils/price";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const { block } = req.query;
  const ebenPrice = await getEbenBchPrice(block as string);
  res.send(ebenPrice.toFixed(8));
};

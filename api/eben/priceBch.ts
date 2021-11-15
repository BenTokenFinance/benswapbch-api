import { NowRequest, NowResponse } from "@vercel/node";
import { getEbenBchPrice } from "../../utils/price";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const ebenPrice = await getEbenBchPrice();
  res.setHeader("content-type", "text/plain");
  res.send(ebenPrice.toFixed(8));
};

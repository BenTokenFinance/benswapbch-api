import { NowRequest, NowResponse } from "@vercel/node";
import { getEbenUsdPrice } from "../../utils/price";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const ebenPrice = await getEbenUsdPrice();
  res.send(ebenPrice.toFixed(3));
};

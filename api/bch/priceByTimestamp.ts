import { NowRequest, NowResponse } from "@vercel/node";
import { getBlockFromTimestamp, getBchPrice } from "../../utils/graphql";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const { timestamp } = req.query;

  let price = 0;

  if (timestamp !== undefined) {
    const t = Number(timestamp);
    if (!isNaN(t) && Number.isInteger(t) && t > 0) {
      try {
        const block = await getBlockFromTimestamp(t) || 0;
        console.log("Block", block);
        if (block) {
            price = (await getBchPrice(block)).bchPrice || 0;
            console.log("Price", price);
        }

      } catch(e) {
        console.error(e);
      }
    }
  }

  res.setHeader("content-type", "text/plain");
  res.send(price);
};

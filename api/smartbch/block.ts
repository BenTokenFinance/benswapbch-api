import { NowRequest, NowResponse } from "@vercel/node";
import { getLatestBlock } from "../../utils/web3";
import { getBlockFromTimestamp } from "../../utils/graphql";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const { timestamp } = req.query;

  let block = 0;

  if (timestamp === undefined) {
    block = await getLatestBlock();
  } else {
    const t = Number(timestamp);
    if (!isNaN(t) && Number.isInteger(t) && t > 0) {
      try {
        block = await getBlockFromTimestamp(t) || 0;
      } catch(e) {
        console.error(e);
      }
    }
  }

  res.setHeader("content-type", "text/plain");
  res.send(block);
};

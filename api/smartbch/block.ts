import { NowRequest, NowResponse } from "@vercel/node";
import { getLatestBlock } from "../../utils/web3";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  res.setHeader("content-type", "text/plain");
  res.send(await getLatestBlock());
};

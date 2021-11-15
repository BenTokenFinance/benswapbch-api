import { NowRequest, NowResponse } from "@vercel/node";
import { getLastestBlocksFromAllRpcs } from "../../utils/web3";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const all = await getLastestBlocksFromAllRpcs();
  var max = 0;
  
  Object.keys(all).forEach(k => {
    max = Math.max(max, all[k].block);
  });

  res.setHeader("content-type", "text/plain");
  res.send(max);
};

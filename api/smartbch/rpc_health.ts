import { NowRequest, NowResponse } from "@vercel/node";
import { RPC } from "../../utils/constants";
import { getLastestBlocksFromAllRpcs } from "../../utils/web3";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const all = await getLastestBlocksFromAllRpcs();
  const count1 = Object.keys(RPC).length;
  const count2 = Object.keys(all).length;
  var max = -1, min = -1;
  
  Object.keys(all).forEach(k => {
      if (max<0) {
          max = all[k].block;
          min = all[k].block; 
      } else {
          max = Math.max(max, all[k].block);
          min = Math.min(min, all[k].block);
      }
  });
  
  console.log(count1, count2, max, min);
  res.setHeader("content-type", "text/plain");
  res.send((count1 == count2 && (max-min) < 50) ? "healthy" : "problematic");
};

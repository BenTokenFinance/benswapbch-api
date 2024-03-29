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
  let result = "healthy";
  // if (count1!=count2) {
  //   result = `Some node(s) is(are) down. Online node(s): ${Object.keys(all).join(', ')}`;
  // } else if ((max-min) >= 50) {
  //   result = "Some node(s) is(are) behind. Please check /api/smartbch/rpc for more detail.";
  // }
  if (!all["official"]) {
    result = "Official RPC node is down!";
  } else if (all["official"].block <= max - 50) {
    result = "Official RPC node is behind!";
  }

  if (!all["greyhat"]) {
    result = "GreyHat RPC node is down!";
  } else if (all["greyhat"].block <= max - 50) {
    result = "GreyHat RPC node is behind!";
  }

  res.setHeader("content-type", "text/plain");
  res.send(result);
};

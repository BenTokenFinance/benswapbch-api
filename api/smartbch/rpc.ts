import { NowRequest, NowResponse } from "@vercel/node";
import { RPC } from "../../utils/constants";
import { getLatestBlockByRpcUrl, getLastestBlocksFromAllRpcs} from "../../utils/web3";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const { name } = req.query;
  const result:any = {};
  if (name) {
    const url = (RPC as any)[name as any];
    if (url) {
      result.block = await getLatestBlockByRpcUrl(url);
      result.url = url;
    }
  } else {
    const all = await getLastestBlocksFromAllRpcs();
    Object.assign(result, all);
    Object.keys(all).forEach(k => {
      result[k].url = (RPC as any)[k];
    });
  }
  res.json(result);
};

import { NowRequest, NowResponse } from "@vercel/node";
import { RPC } from "../../utils/constants";
import { getLatestBlockByRpcUrl, getLastestBlocksFromAllRpcs} from "../../utils/web3";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const { name } = req.query;
  const result:any = {};
  if (name) {
    const url = (RPC as any)[name];
    if (url) result.block = await getLatestBlockByRpcUrl(url);
  } else {
    Object.assign(result, await getLastestBlocksFromAllRpcs());
  }
  res.json(result);
};

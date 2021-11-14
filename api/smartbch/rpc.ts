import { NowRequest, NowResponse } from "@vercel/node";
import { RPC } from "../../utils/constants";
import { getLatestBlockByRpcUrl, getLastestBlocksFromAllRpcs} from "../../utils/web3";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const { rpc } = req.query;
  const result:any = {};
  if (rpc) {
    const url = (RPC as any)[rpc];
    if (url) result.block = await getLatestBlockByRpcUrl(url);
  } else {
    Object.assign(result, await getLastestBlocksFromAllRpcs());
  }
  res.json(result);
};

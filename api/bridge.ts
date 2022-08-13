import { NowRequest, NowResponse } from "@vercel/node";
import { getBridgeDetail } from "../utils/bridgeUtils";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  let detail = await getBridgeDetail();
  
  res.json(detail);
};

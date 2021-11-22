import { NowRequest, NowResponse } from "@vercel/node";
import { getAppPairs } from "../../utils/graphql";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const result = await getAppPairs();
  res.json(result);
};

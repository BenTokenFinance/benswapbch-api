import { NowRequest, NowResponse } from "@vercel/node";
import { getAppTokens } from "../../utils/graphql";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const result = await getAppTokens();
  res.json(result);
};

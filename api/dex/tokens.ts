import { NowRequest, NowResponse } from "@vercel/node";
import { getAllTokens } from "../../utils/graphql";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const result = await getAllTokens();
  res.json(result);
};

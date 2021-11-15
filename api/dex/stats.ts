import { NowRequest, NowResponse } from "@vercel/node";
import { getDexStats } from "../../utils/graphql";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const { block } = req.query;

  const result = await getDexStats(block as string);

  res.json(result);
};

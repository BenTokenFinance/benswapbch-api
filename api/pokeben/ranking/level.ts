import { NowRequest, NowResponse } from "@vercel/node";
import { getPokeBensByRanking } from "../../../utils/graphql";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const { page } = req.query;

  const result = await getPokeBensByRanking(0, page as string);

  res.json(result);
};

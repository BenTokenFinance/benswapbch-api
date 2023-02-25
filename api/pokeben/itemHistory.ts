import { NowRequest, NowResponse } from "@vercel/node";
import { getPokeBenItemHistory } from "../../utils/graphql";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const { count, skip } = req.query;
  const c = Number(count);

  let result = [];

  if (c > 0 && c <= 100) result = await getPokeBenItemHistory(c, skip);

  res.json(result);
};

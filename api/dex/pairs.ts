import { NowRequest, NowResponse } from "@vercel/node";
import { getAllPairs } from "../../utils/graphql";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const result = await getAllPairs();
  res.json(result);
};

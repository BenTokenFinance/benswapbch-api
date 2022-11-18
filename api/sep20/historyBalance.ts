import { NowRequest, NowResponse } from "@vercel/node";
import { getHistoryBalance } from "../../utils/token";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const { token, owner, block } = req.query;

  const result = await getHistoryBalance(token, owner, block);

  res.setHeader("content-type", "text/plain");
  res.send(result||"");
};

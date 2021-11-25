import { NowRequest, NowResponse } from "@vercel/node";
import { getNodesHealthMsg } from "../utils/graphql";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const msg = await getNodesHealthMsg();
  res.setHeader("content-type", "text/plain");
  res.send(msg.toString());
};

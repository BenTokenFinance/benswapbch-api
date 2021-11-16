import { NowRequest, NowResponse } from "@vercel/node";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const time = new Date().getTime();

  res.setHeader("content-type", "text/plain");
  res.send(time.toString());
};

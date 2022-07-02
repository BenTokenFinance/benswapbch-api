import { NowRequest, NowResponse } from "@vercel/node";
import { getVrfServerHealth } from "../../utils/others";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const msg = await getVrfServerHealth();
  
  res.setHeader("content-type", "text/plain");
  res.send(msg);
};

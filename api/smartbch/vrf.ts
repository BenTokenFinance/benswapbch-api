import { NowRequest, NowResponse } from "@vercel/node";
import { getVrfStatus } from "../../utils/others";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const result = await getVrfStatus();
  res.json(result);
};

import { NowRequest, NowResponse } from "@vercel/node";
import { getStakedSupply } from "../../utils/supply";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  let lockedSupply = await getStakedSupply();
  lockedSupply = lockedSupply.div(1e18);
  res.setHeader("content-type", "text/plain");
  res.send(lockedSupply.toString());
};

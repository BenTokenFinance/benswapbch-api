import { NowRequest, NowResponse } from "@vercel/node";
import { getBurnedSupply} from "../../utils/supply";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  let burnedSupply = await getBurnedSupply();
  burnedSupply = burnedSupply.div(1e18);
  res.setHeader("content-type", "text/plain");
  res.send(burnedSupply.toString());
};

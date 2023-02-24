import { NowRequest, NowResponse } from "@vercel/node";
import { getPokebenTotalSupply } from "../../utils/pokeben";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  let totalSupply = await getPokebenTotalSupply();
  res.setHeader("content-type", "text/plain");
  res.send(totalSupply.toString());
};

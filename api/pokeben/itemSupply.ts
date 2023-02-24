import { NowRequest, NowResponse } from "@vercel/node";
import { getPokebenItemTotalSupply } from "../../utils/pokeben";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  let totalSupply = await getPokebenItemTotalSupply();
  res.setHeader("content-type", "text/plain");
  res.send(totalSupply.toString());
};

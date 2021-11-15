import { NowRequest, NowResponse } from "@vercel/node";
import BigNumber from "bignumber.js";
import { getStakedSupply } from "../../utils/supply";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const result: any = {};

  let stakedSupply = await getStakedSupply();
  let total = new BigNumber(0);
  Object.keys(stakedSupply).forEach(k=>{
    result[k] = stakedSupply[k].toNumber();
    total = total.plus(stakedSupply[k]);
  });
  result.total = total.toNumber();

  res.json(result);
};

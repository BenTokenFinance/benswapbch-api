import { NowRequest, NowResponse } from "@vercel/node";
import { getBurnedSupply, getTotalSupply, getStakedSupply} from "../../utils/supply";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  let totalSupply = await getTotalSupply();
  totalSupply = totalSupply.div(1e18);

  let burnedSupply = await getBurnedSupply();
  burnedSupply = burnedSupply.div(1e18);

  let stakedSupply = await getStakedSupply();
  stakedSupply = stakedSupply.div(1e18);

  const circulatingSupply = totalSupply.minus(burnedSupply);

  res.json({
    total: totalSupply.toNumber(),
    burned: burnedSupply.toNumber(),
    circulating: circulatingSupply.toNumber(),
    staked: stakedSupply.toNumber()
  });
};

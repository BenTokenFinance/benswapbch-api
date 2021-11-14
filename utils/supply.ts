import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import { EBEN, DEAD, BLACKHOLE } from "./constants";
import bep20 from "./abis/bep20.json";

const contract = getContract(bep20, EBEN);

export const getTotalSupply = async (): Promise<BigNumber> => {
  const supply = await contract.methods.totalSupply().call();

  return new BigNumber(supply);
};

export const getBurnedSupply = async (): Promise<BigNumber> => {
  const balance1 = await contract.methods.balanceOf(DEAD).call();
  const balance2 = await contract.methods.balanceOf(EBEN).call();
  const balance3 = await contract.methods.balanceOf(BLACKHOLE).call();

  return (new BigNumber(balance1)).plus(new BigNumber(balance2)).plus(new BigNumber(balance3));
};

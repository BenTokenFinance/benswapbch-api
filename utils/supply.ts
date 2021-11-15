import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import { EBEN, DEAD, BLACKHOLE, EBEN_BCH_BENSWAP_LP, EBEN_BCH_MISTSWAP_LP, MASTERCHEF_CONTRACT, LOTTERY_CONTRACT} from "./constants";
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

export const getStakedSupply = async (): Promise<any> => {
  const balance1 = await contract.methods.balanceOf(EBEN_BCH_BENSWAP_LP).call();
  const balance2 = await contract.methods.balanceOf(EBEN_BCH_MISTSWAP_LP).call();
  const balance3 = await contract.methods.balanceOf(MASTERCHEF_CONTRACT).call();
  const balance4 = await contract.methods.balanceOf(LOTTERY_CONTRACT).call();
  
  return {
    "ebenBchBenLp": new BigNumber(balance1).div(1e18),
    "ebenBchMistLp": new BigNumber(balance2).div(1e18),
    "ebenBenPool": new BigNumber(balance3).div(1e18),
    "benLottery": new BigNumber(balance4).div(1e18),
  }
};

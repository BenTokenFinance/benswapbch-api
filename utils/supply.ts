import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import { EBEN, DEAD, BLACKHOLE, EBEN_BCH_BENSWAP_LP, EBEN_BCH_MISTSWAP_LP, MASTERCHEF_CONTRACT, LOTTERY_CONTRACT} from "./constants";
import bep20 from "./abis/bep20.json";

const contract = getContract(bep20, EBEN);
const TokenBurnerAddress = "0x71D9C349e35f73B782022d912B5dADa4235fDa06";

export const getTotalSupply = async (): Promise<BigNumber> => {
  const supply = await contract.methods.totalSupply().call();

  return new BigNumber(supply);
};

export const getBurnedSupply = async (): Promise<BigNumber> => {
  let total = new BigNumber(0);
  const tasks = [];
  tasks.push(contract.methods.balanceOf(DEAD).call().then((b:any)=>{
    total = total.plus(b)
  }));
  tasks.push(contract.methods.balanceOf(EBEN).call().then((b:any)=>{
    total = total.plus(b)
  }));
  tasks.push(contract.methods.balanceOf(BLACKHOLE).call().then((b:any)=>{
    total = total.plus(b)
  }));
  tasks.push(contract.methods.balanceOf(TokenBurnerAddress).call().then((b:any)=>{
    total = total.plus(b)
  }));
  await Promise.all(tasks);

  return total;
};

export const getStakedSupply = async (): Promise<any> => {
  const ret:any = {};
  const tasks = [];
  tasks.push(contract.methods.balanceOf(EBEN_BCH_BENSWAP_LP).call().then((b:any)=>{
    ret["ebenBchBenLp"] = new BigNumber(b).div(1e18);
  }));
  tasks.push(contract.methods.balanceOf(EBEN_BCH_MISTSWAP_LP).call().then((b:any)=>{
    ret["ebenBchMistLp"] = new BigNumber(b).div(1e18);
  }));
  tasks.push(contract.methods.balanceOf(MASTERCHEF_CONTRACT).call().then((b:any)=>{
    ret["ebenBenPool"] = new BigNumber(b).div(1e18);
  }));
  tasks.push(contract.methods.balanceOf(LOTTERY_CONTRACT).call().then((b:any)=>{
    ret["benLottery"] = new BigNumber(b).div(1e18);
  }));
  await Promise.all(tasks);
  
  return ret;
};

export const getTotalSupplyByAddress = async (address: any): Promise<BigNumber> => {
  try {
    const contract = getContract(bep20, address);
    const supply = await contract.methods.totalSupply().call();
    return new BigNumber(supply);
  } catch (e) {
    console.error(e);
    return new BigNumber(0);
  }
};

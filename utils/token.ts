import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import bep20 from "./abis/bep20.json";
import { multicall } from "./multicall";

export const getTokenBasicData = async(address: any) => {
  const data:any = {};
  try {
    const contract = getContract(bep20, address);
    const calls = [
      {
        address: address,
        name: 'name'
      },      
      {
        address: address,
        name: 'symbol'
      },      
      {
        address: address,
        name: 'decimals'
      },      
      {
        address: address,
        name: 'totalSupply'
      },
    ];
    const res1 = await multicall(bep20, calls);

    const decimals = new BigNumber(res1[2][0]).toNumber();
    Object.assign(data, {
      name: res1[0][0],
      symbol: res1[1][0],
      decimals,
      supply: new BigNumber(res1[3][0]._hex).div(new BigNumber(10).pow(decimals)).toFixed()
    });
    console.log("data", JSON.stringify(data));
  } catch(e) {
    console.error(e);
  }

  return data;
}

export const getHistoryBalance = async(tokenAddress:any, ownerAddress:any, block:any) => {
  try {
    const contract = getContract(bep20, tokenAddress, true);
    const balance = await contract.methods.balanceOf(ownerAddress).call(undefined, block)
    return balance;
  } catch(e) {
    console.error(e);
    return false;
  }
}
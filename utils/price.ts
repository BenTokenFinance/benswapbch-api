import BigNumber from "bignumber.js";
import bep20ABI from "./abis/bep20.json";
import { getContract, getWeb3 } from "./web3";
import { EBEN, EBEN_BCH_BENSWAP_LP, WBCH } from "./constants";

export const getEbenPricePerBCH = async (block: string): Promise<number> => {
  const web3 = getWeb3();
  const blockNumber = block === undefined ? await web3.eth.getBlockNumber() : new BigNumber(block).toNumber();
  let price = new BigNumber(0);

  try {
    console.log("Getting EBEN price per BCH...");
    console.log("Block: "+ blockNumber);
    const ebenContract = getContract(bep20ABI, EBEN, true);
    const wbchContract = getContract(bep20ABI, WBCH, true);
    const ebenBalance = await ebenContract.methods.balanceOf(EBEN_BCH_BENSWAP_LP).call(undefined, blockNumber);
    console.log("EBEN Balance: "+ ebenBalance);
    const wbchBalance = await wbchContract.methods.balanceOf(EBEN_BCH_BENSWAP_LP).call(undefined, blockNumber);
    console.log("WBCH Balance: "+ wbchBalance);
    price = new BigNumber(ebenBalance).div(new BigNumber(wbchBalance)).div(1e18);
    console.log("Price EBEN/BCH: "+ price);
  } catch (error) {
    console.error(`Error getting EBEN price per BCH: ${error}`);
  }

  return price.toNumber();
};

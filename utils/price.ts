import BigNumber from "bignumber.js";
import bep20ABI from "./abis/bep20.json";
import { getContract, getWeb3 } from "./web3";
import { EBEN, EBEN_BCH_BENSWAP_LP, WBCH } from "./constants";

export const getEbenPricePerBCH = async (block: string): Promise<number> => {
  const web3 = getWeb3();
  const blockNumber = block === undefined ? await web3.eth.getBlockNumber() : new BigNumber(block).toNumber();
  let balance = new BigNumber(0);

  try {
    const ebenContract = getContract(bep20ABI, EBEN, true);
    const wbchContract = getContract(bep20ABI, WBCH, true);
    const ebenBalance = await ebenContract.methods.balanceOf(EBEN_BCH_BENSWAP_LP).call(undefined, blockNumber);
    const wbchBalance = await wbchContract.methods.balanceOf(EBEN_BCH_BENSWAP_LP).call(undefined, blockNumber);
    balance = balance.times(new BigNumber(ebenBalance)).div(new BigNumber(wbchBalance));
  } catch (error) {
    console.error(`Error getting EBEN price per BCH: ${error}`);
  }

  return balance.div(1e18).toNumber();
};

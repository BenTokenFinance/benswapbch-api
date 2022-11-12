import BigNumber from "bignumber.js";
import bep20ABI from "./abis/bep20.json";
import { getContract, getWeb3 } from "./web3";
import { EBEN, EBEN_BCH_BENSWAP_LP, WBCH } from "./constants";
import { getBchPrice } from "./others";

export const getEbenUsdPrice = async (): Promise<number> => {
  const web3 = getWeb3();
  let price = new BigNumber(0);

  try {
    console.log("Getting EBEN price per USD...");
    const ebenContract = getContract(bep20ABI, EBEN);
    const wbchContract = getContract(bep20ABI, WBCH);
    const ebenBalance = await ebenContract.methods.balanceOf(EBEN_BCH_BENSWAP_LP).call();
    console.log("EBEN Balance: "+ ebenBalance);
    const wbchBalance = await wbchContract.methods.balanceOf(EBEN_BCH_BENSWAP_LP).call();
    console.log("WBCH Balance: "+ wbchBalance);
    const pricePerBch = new BigNumber(wbchBalance).div(new BigNumber(ebenBalance));
    console.log("Price EBEN/BCH: "+ pricePerBch);
    const bchPrice = (await getBchPrice())["bitcoin-cash"].usd;
    console.log("Price BCH/USD: "+ bchPrice);
    price = pricePerBch.times(bchPrice);
    console.log("Price EBEN/USD: "+ price);
  } catch (error) {
    console.error(`Error getting EBEN price per Usd: ${error}`);
  }

  return price.toNumber();
};

export const getEbenBchPrice = async (): Promise<number> => {
  const web3 = getWeb3();
  let price = new BigNumber(0);

  try {
    console.log("Getting EBEN price per BCH...");
    const ebenContract = getContract(bep20ABI, EBEN);
    const wbchContract = getContract(bep20ABI, WBCH);
    const ebenBalance = await ebenContract.methods.balanceOf(EBEN_BCH_BENSWAP_LP).call();
    console.log("EBEN Balance: "+ ebenBalance);
    const wbchBalance = await wbchContract.methods.balanceOf(EBEN_BCH_BENSWAP_LP).call();
    console.log("WBCH Balance: "+ wbchBalance);
    price = new BigNumber(wbchBalance).div(new BigNumber(ebenBalance));
    console.log("Price EBEN/BCH: "+ price);
  } catch (error) {
    console.error(`Error getting EBEN price per BCH: ${error}`);
  }

  return price.toNumber();
};

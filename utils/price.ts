import BigNumber from "bignumber.js";
import bep20ABI from "./abis/bep20.json";
import { getContract, getWeb3 } from "./web3";
import { EBEN, EBEN_BCH_BENSWAP_LP, WBCH, bbBUSD, BCH_BBBUSD_BENSWAP_LP, bbUSDT, BCH_BBUSDT_BENSWAP_LP } from "./constants";
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


export const getBchBbbusdPrice = async (): Promise<number> => {
  const web3 = getWeb3();
  let price = new BigNumber(0);

  try {
    console.log("Getting BCH price per bbBUSD...");
    const bbbusdContract = getContract(bep20ABI, bbBUSD);
    const wbchContract = getContract(bep20ABI, WBCH);
    const bbbusdBalance = await bbbusdContract.methods.balanceOf(BCH_BBBUSD_BENSWAP_LP).call();
    console.log("bbBUSD Balance: "+ bbbusdBalance);
    const wbchBalance = await wbchContract.methods.balanceOf(BCH_BBBUSD_BENSWAP_LP).call();
    console.log("WBCH Balance: "+ wbchBalance);
    price = new BigNumber(bbbusdBalance).div(new BigNumber(wbchBalance));
    console.log("Price BCH/bbBUSD: "+ price);
  } catch (error) {
    console.error(`Error getting BCH price per bbBUSD: ${error}`);
  }

  return price.toNumber();
};

export const getBchBbusdtPrice = async (): Promise<number> => {
  const web3 = getWeb3();
  let price = new BigNumber(0);

  try {
    console.log("Getting BCH price per bbUSDT...");
    const bbusdtContract = getContract(bep20ABI, bbUSDT);
    const wbchContract = getContract(bep20ABI, WBCH);
    const bbusdtBalance = await bbusdtContract.methods.balanceOf(BCH_BBUSDT_BENSWAP_LP).call();
    console.log("bbUSDT Balance: "+ bbusdtBalance);
    const wbchBalance = await wbchContract.methods.balanceOf(BCH_BBUSDT_BENSWAP_LP).call();
    console.log("WBCH Balance: "+ wbchBalance);
    price = new BigNumber(bbusdtBalance).div(new BigNumber(wbchBalance));
    console.log("Price BCH/bbUSDT: "+ price);
  } catch (error) {
    console.error(`Error getting BCH price per bbUSDT: ${error}`);
  }

  return price.toNumber();
};

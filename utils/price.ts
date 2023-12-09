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
    const call1 = ebenContract.methods.balanceOf(EBEN_BCH_BENSWAP_LP).call();
    const call2 = wbchContract.methods.balanceOf(EBEN_BCH_BENSWAP_LP).call();
    const sbchPrice = await getSbchBbusdtPrice();
    console.log("Price SBCH/USD: "+ sbchPrice);
    const ebenBalance = await call1;
    console.log("EBEN Balance: "+ ebenBalance);
    const wbchBalance = await call2;
    console.log("WBCH Balance: "+ wbchBalance);
    const pricePerBch = new BigNumber(wbchBalance).div(new BigNumber(ebenBalance));
    console.log("Price EBEN/SBCH: "+ pricePerBch);
    price = pricePerBch.times(sbchPrice);
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
    console.log("Getting EBEN price per SBCH...");
    const ebenContract = getContract(bep20ABI, EBEN);
    const wbchContract = getContract(bep20ABI, WBCH);
    const call1 = ebenContract.methods.balanceOf(EBEN_BCH_BENSWAP_LP).call();
    const wbchBalance = await wbchContract.methods.balanceOf(EBEN_BCH_BENSWAP_LP).call();
    console.log("WSBCH Balance: "+ wbchBalance);
    const ebenBalance = await call1;
    console.log("EBEN Balance: "+ ebenBalance);
    price = new BigNumber(wbchBalance).div(new BigNumber(ebenBalance));
    console.log("Price EBEN/SBCH: "+ price);
  } catch (error) {
    console.error(`Error getting EBEN price per SBCH: ${error}`);
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
    const call1 = bbbusdContract.methods.balanceOf(BCH_BBBUSD_BENSWAP_LP).call();
    const wbchBalance = await wbchContract.methods.balanceOf(BCH_BBBUSD_BENSWAP_LP).call();
    console.log("WBCH Balance: "+ wbchBalance);
    const bbbusdBalance = await call1;
    console.log("bbBUSD Balance: "+ bbbusdBalance);
    price = new BigNumber(bbbusdBalance).div(new BigNumber(wbchBalance));
    console.log("Price BCH/bbBUSD: "+ price);
  } catch (error) {
    console.error(`Error getting BCH price per bbBUSD: ${error}`);
  }

  return price.toNumber();
};

export const getSbchBbusdtPrice = async (): Promise<number> => {
  const web3 = getWeb3();
  let price = new BigNumber(0);

  try {
    console.log("Getting SBCH price per bbUSDT...");
    const bbusdtContract = getContract(bep20ABI, bbUSDT);
    const wbchContract = getContract(bep20ABI, WBCH);
    const call1 = bbusdtContract.methods.balanceOf(BCH_BBUSDT_BENSWAP_LP).call();
    const wbchBalance = await wbchContract.methods.balanceOf(BCH_BBUSDT_BENSWAP_LP).call();
    console.log("WSBCH Balance: "+ wbchBalance);
    const bbusdtBalance = await call1;
    console.log("bbUSDT Balance: "+ bbusdtBalance);
    price = new BigNumber(bbusdtBalance).div(new BigNumber(wbchBalance));
    console.log("Price SBCH/bbUSDT: "+ price);
  } catch (error) {
    console.error(`Error getting SBCH price per bbUSDT: ${error}`);
  }

  return price.toNumber();
};

export const getHistorySbchBbusdtPrice = async (block:any): Promise<number> => {
  const web3 = getWeb3();
  let price = new BigNumber(0);

  try {
    console.log("Getting SBCH price per bbUSDT...");
    const bbusdtContract = getContract(bep20ABI, bbUSDT, true);
    const wbchContract = getContract(bep20ABI, WBCH, true);
    const call1 = bbusdtContract.methods.balanceOf(BCH_BBUSDT_BENSWAP_LP).call(undefined, block);
    const wbchBalance = await wbchContract.methods.balanceOf(BCH_BBUSDT_BENSWAP_LP).call(undefined, block);
    console.log("WBCH Balance: "+ wbchBalance);
    const bbusdtBalance = await call1;
    console.log("bbUSDT Balance: "+ bbusdtBalance);
    price = new BigNumber(bbusdtBalance).div(new BigNumber(wbchBalance));
    console.log("Price SBCH/bbUSDT: "+ price);
  } catch (error) {
    console.error(`Error getting SBCH price per bbUSDT: ${error}`);
  }

  return price.toNumber();
};

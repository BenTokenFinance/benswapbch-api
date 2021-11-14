import { Pair, TokenAmount } from "@pancakeswap-libs/sdk";
import BigNumber from "bignumber.js";
import bep20ABI from "./abis/bep20.json";
import pairABI from "./abis/pair.json";
import masterChefABI from "./abis/masterchef.json";
import { getContract, getWeb3 } from "./web3";
import { CAKE, CAKE_BNB_FARM, CAKE_BNB_TOKEN, CAKE_TOKEN, MASTERCHEF_CONTRACT, WBNB_TOKEN } from "./constants";
import { pools } from "./pools";
import { multicall } from "./multicall";

interface UserInfoResult {
  amount: BigNumber;
  rewardDebt: BigNumber;
}

export const getTotalStaked = async (address: string, block: string): Promise<number> => {
  const web3 = getWeb3();
  const blockNumber = block === undefined ? await web3.eth.getBlockNumber() : new BigNumber(block).toNumber();
  let balance = new BigNumber(0);

  try {
    // EBEN balance in wallet.
    const cakeContract = getContract(bep20ABI, CAKE, true);
    const cakeBalance = await cakeContract.methods.balanceOf(address).call(undefined, blockNumber);
    balance = balance.plus(cakeBalance);
  } catch (error) {
    console.error(`EBEN balance error: ${error}`);
  }

  try {
    // EBEN-BNB farm.
    const masterContract = getContract(masterChefABI, MASTERCHEF_CONTRACT, true);
    const cakeBnbContract = getContract(pairABI, CAKE_BNB_FARM, true);
    const totalSupplyLP = await cakeBnbContract.methods.totalSupply().call(undefined, blockNumber);
    const reservesLP = await cakeBnbContract.methods.getReserves().call(undefined, blockNumber);
    const cakeBnbBalance: UserInfoResult = await masterContract.methods
      .userInfo(1, address)
      .call(undefined, blockNumber);
    const pair: Pair = new Pair(
      new TokenAmount(CAKE_TOKEN, reservesLP._reserve0.toString()),
      new TokenAmount(WBNB_TOKEN, reservesLP._reserve1.toString())
    );
    const cakeLPBalance = pair.getLiquidityValue(
      pair.token0,
      new TokenAmount(CAKE_BNB_TOKEN, totalSupplyLP.toString()),
      new TokenAmount(CAKE_BNB_TOKEN, cakeBnbBalance.amount.toString()),
      false
    );
    balance = balance.plus(new BigNumber(cakeLPBalance.toSignificant(18)).times(1e18));
  } catch (error) {
    console.error(`EBEN-BNB LP error: ${error}`);
  }

  // TODO: Add other EBEN pairs

  try {
    // MasterBreeder contract.
    const masterContract = getContract(masterChefABI, MASTERCHEF_CONTRACT, true);
    const cakeMainStaking: UserInfoResult = await masterContract.methods
      .userInfo(1, address)
      .call(undefined, blockNumber);
    balance = balance.plus(cakeMainStaking.amount);
  } catch (error) {
    console.error(`MasterChef error: ${error}`);
  }

  return balance.div(1e18).toNumber();
};

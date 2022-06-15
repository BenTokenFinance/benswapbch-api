import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import { FLEXUSD, WBCH, DEX, FACTORY } from "./constants";
import pair from "./abis/pair.json";
import lpFactory from "./abis/lpFactory.json";
import bep20 from "./abis/bep20.json";

function addressMatch(a1:any, a2:any) {
    return a1 && a2 && String(a1).toLowerCase() == String(a2).toLowerCase();
}

export const getLiquidity = async (address: any): Promise<object> => {
    const tasks:any = [];
    const result:any = {};
    const tokenContract = getContract(bep20, address);
    const decimals = await tokenContract.methods.decimals().call();

    Object.keys(FACTORY).forEach((e, i)=> {
        const f = FACTORY[e];
        const contract = getContract(lpFactory, f.address);
        if (!addressMatch(address, FLEXUSD)) {
            const flexUsdContract = getContract(bep20, FLEXUSD);
            const task = contract.methods.getPair(FLEXUSD, address).call().then((lp:any)=> {
                const isValid = lp && (new BigNumber(lp.toLowerCase())).isGreaterThan(0);
                if (isValid) {
                    const key = `${f.name}-flexUSD`;
                    result[key] = {
                        address: lp
                    };
                    const innerTasks = [];
                    innerTasks.push(tokenContract.methods.balanceOf(lp).call().then((balance:any)=>{
                        result[key]["token"] = new BigNumber(balance).div(Math.pow(10, decimals)).toFixed();
                    }));
                    innerTasks.push(flexUsdContract.methods.balanceOf(lp).call().then((balance:any)=>{
                        const balanceFlexUsd = new BigNumber(balance).div(Math.pow(10, 18));
                        result[key]["flexUSD"] = balanceFlexUsd.toFixed();
                        result[key]["liquidityUsd"] = balanceFlexUsd.times(2).toFixed();
                    }));

                    return Promise.all(innerTasks);
                }
            });
            tasks.push(task);
        }
        if (!addressMatch(address, WBCH)) {
            const wbchContract = getContract(bep20, WBCH);
            const task = contract.methods.getPair(WBCH, address).call().then((lp:any)=> {
                const isValid = lp && (new BigNumber(lp.toLowerCase())).isGreaterThan(0);
                if (isValid) {
                    const key = `${f.name}-WBCH`;
                    result[key] = {
                        address: lp
                    };
                    const innerTasks = [];
                    innerTasks.push(tokenContract.methods.balanceOf(lp).call().then((balance:any)=>{
                        result[key]["token"] = new BigNumber(balance).div(Math.pow(10, decimals)).toFixed();
                    }));
                    innerTasks.push(wbchContract.methods.balanceOf(lp).call().then((balance:any)=>{
                        const balanceWbch = new BigNumber(balance).div(Math.pow(10, 18));
                        result[key]["wbch"] = balanceWbch.toFixed();
                        result[key]["liquidityBch"] = balanceWbch.times(2).toFixed();
                    }));

                    return Promise.all(innerTasks);
                }
            });
            tasks.push(task);
        }
    });

    await Promise.all(tasks);
  
    return result;
  };
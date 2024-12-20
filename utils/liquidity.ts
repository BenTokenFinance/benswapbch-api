import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import { bbUSDT, WBCH, DEX, FACTORY, EBEN, LAW } from "./constants";
import pair from "./abis/pair.json";
import lpFactory from "./abis/lpFactory.json";
import bep20 from "./abis/bep20.json";

function addressMatch(a1:any, a2:any) {
    return a1 && a2 && String(a1).toLowerCase() == String(a2).toLowerCase();
}

const MidTokens = {
    [DEX.LAWSWAP]: {
        "LAW": LAW
    },
    [DEX.BENSWAP]: {
        "EBEN": EBEN,
        "bbUSDT": bbUSDT
    }
};

export const getLiquidity = async (address: any): Promise<object> => {
    const tasks:any = [];
    const result:any = {};
    const tokenContract = getContract(bep20, address);
    const decimals = await tokenContract.methods.decimals().call();

    Object.keys(FACTORY).forEach((e, i)=> {
        const f = FACTORY[e];
        const contract = getContract(lpFactory, f.address);
        if (!addressMatch(address, WBCH)) {
            const wbchContract = getContract(bep20, WBCH);
            const task = contract.methods.getPair(WBCH, address).call().then((lp:any)=> {
                const isValid = lp && (new BigNumber(lp.toLowerCase())).isGreaterThan(0);
                if (isValid) {
                    const key = `${f.name}-WBCH`;
                    result[key] = {
                        address: lp,
                        baseTokenAddress: WBCH
                    };
                    const innerTasks = [];
                    innerTasks.push(tokenContract.methods.balanceOf(lp).call().then((balance:any)=>{
                        result[key]["token"] = new BigNumber(balance).div(Math.pow(10, decimals)).toFixed();
                    }));
                    innerTasks.push(wbchContract.methods.balanceOf(lp).call().then((balance:any)=>{
                        const balanceWbch = new BigNumber(balance).div(Math.pow(10, 18));
                        result[key]["wbch"] = balanceWbch.toFixed();
                        result[key]["baseToken"] = balanceWbch.toFixed();
                        result[key]["liquidityWbch"] = balanceWbch.times(2).toFixed();
                    }));

                    return Promise.all(innerTasks);
                }
            });
            tasks.push(task);
        }
        if (MidTokens[e]) {
            const midTokens:any = MidTokens[e];
            Object.keys(midTokens).forEach(k=>{
                if (!addressMatch(address, midTokens[k])) {
                    const midTokenContract = getContract(bep20, midTokens[k]);
                    const task = contract.methods.getPair(midTokens[k], address).call().then((lp:any)=> {
                        const isValid = lp && (new BigNumber(lp.toLowerCase())).isGreaterThan(0);
                        if (isValid) {
                            const key = `${f.name}-${k}`;
                            result[key] = {
                                address: lp,
                                baseTokenAddress: midTokens[k]
                            };
                            const innerTasks = [];
                            innerTasks.push(tokenContract.methods.balanceOf(lp).call().then((balance:any)=>{
                                result[key]["token"] = new BigNumber(balance).div(Math.pow(10, decimals)).toFixed();
                            }));
                            innerTasks.push(midTokenContract.methods.balanceOf(lp).call().then((balance:any)=>{
                                const balanceMidToken = new BigNumber(balance).div(Math.pow(10, 18));
                                const kl = k.toLowerCase();
                                result[key][kl] = balanceMidToken.toFixed();
                                result[key]["baseToken"] = balanceMidToken.toFixed();
                                result[key][`liquidity${kl.charAt(0).toUpperCase() + kl.slice(1)}`] = balanceMidToken.times(2).toFixed();
                            }));
        
                            return Promise.all(innerTasks);
                        }
                    });
                    tasks.push(task);
                }
            });
        }
    });

    await Promise.all(tasks);
  
    return result;
};

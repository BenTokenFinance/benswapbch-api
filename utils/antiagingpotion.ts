
import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import abi from "./abis/antiagingpotion.json";

const address = "0x5d370da787802c878b3ddDb38838a0Cab52cE60C"

function buildTimeString(timestamp:any) {
    timestamp = Number(timestamp);
    if (isNaN(timestamp) || timestamp < 0) return "ERROR";
    const date = new Date(timestamp*1000));
    const year = date.getUTCFullYear();
    if (isNaN(year)) return "ERROR";
    const yearString = year < 0 ? `${Math.abs(year)} BC` : year < 100 ? `${year} AD` : String(year);
    const a = date.toUTCString().split(' ');
    a[3] = yearString;
    return a.join(' ');
}

const getRestrictExp = (power:any)=>{
    if (!power) return 0.25;
    if (power < 0.25) return 0.25;
    if (power > 5) return  0.25;
    return power;
}

export const getMetadata = async (id:any) {
    const contract = getContract(abi, address);

    try {
        const info = await contract.methods.lockInfoById(id).call();
        const {lockedAmount, withdrawnAmount, exists, exponent, startTime, endTime} = info;
        const power = exponent / 100
        if (exists) {
            const pct = new BigNumber(lockedAmount).minus(withdrawnAmount).div(lockedAmount).times(100).toNumber();
            let type = 1;
            const la = new BigNumber(lockedAmount);
            if (la.isGreaterThanOrEqualTo(1e23)) type = 4;
            else if (la.isGreaterThanOrEqualTo(1e22)) type = 3;
            else if (la.isGreaterThanOrEqualTo(1e21)) type = 2;
            return {
                "name" : `Potion #${id}`,
                "description" : "Anti-Aging Potion is a feature of the BenSwap Laboratory.",
                "image": `https://api2.benswap.cash/potion/image?a=${type}&b=${pct}`,
                "attributes": [
                    {"trait_type":"Start Time","value":buildTimeString(startTime)},
                    {"trait_type":"End Time","value":buildTimeString(endTime)},
                    {"trait_type":"Curve","value": `y = ${power === 0.5 ?'√x':`x^${getRestrictExp(power)}`}`},
                ]
            };
        }
    } catch (e) {
        console.error(e);
    }

    return {};
}
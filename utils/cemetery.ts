
import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import cemeteryController from "./abis/cemeteryController.json";

const controllerContract = getContract(cemeteryController, '0x836840631Ad1Ec37914e0A607b8793B3177E1258');

export const getGraveInfo = async (id: any) => {
    const info = await controllerContract.methods.getGraveInfo(id).call();
  
    return info;
}

function buildTimeString(timestamp:any) {
    timestamp = Number(timestamp);
    if (isNaN(timestamp) || timestamp < 0) return "ERROR";
    const date = new Date(Math.floor((timestamp - 3153600000000)*1000));
    const year = date.getUTCFullYear();
    if (isNaN(year)) return "ERROR";
    const yearString = year < 0 ? `${Math.abs(year)} BC` : year < 100 ? `${year} AD` : String(year);
    const a = date.toUTCString().split(' ');
    a[3] = yearString;
    return a.join(' ');
}

function buildDateString (timestamp:any) {
    const timeString = buildTimeString(timestamp);
    if (timeString === "ERROR") return "ERROR";
    return timeString.split(' ').slice(0,4).join(' ');
}

export const getGraveMetadata = async (id: any) => {
    const info = await getGraveInfo(id);
    if (info.name) {
        const attrs = [
            {
                "trait_type": "Birth Date",
                "value": buildDateString(info.birthDate)
            },{
                "trait_type": "Death Date",
                "value": buildDateString(info.deathDate)
            }
        ];

        const md:any = {
            name: `${info.name}'s Grave #${id}`,
            description: "BenSwap Cemetery - Bury in your favorite blockchain.",
            attributes: attrs,
            timeOfBirth: buildTimeString(info.birthDate),
            timeOfDeath: buildTimeString(info.deathDate),
            image: `https://api2.benswap.cash/grave/imageLite?a=${encodeURIComponent(info.name)}&b=${info.birthDate}&c=${info.deathDate}`
        };

        if (info.engraver) md.engraver = info.engraver;
        if (info.epitaph) md.epitaph = info.epitaph;

        return md;
    }

    return {};
}

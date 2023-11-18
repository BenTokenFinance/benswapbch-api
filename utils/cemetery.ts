
import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import cemeteryController from "./abis/cemeteryController.json";

const controllerContract = getContract(cemeteryController, '0x836840631Ad1Ec37914e0A607b8793B3177E1258');

export const getGraveInfo = async (id: any) => {
    const info = await controllerContract.methods.getGraveInfo(id).call();
  
    return info;
}

const GIFTS:any = {
    1: "Flower",
    2: "Incense",
    3: "Wine",
    4: "Chicken"
}

export const getGiftsInfo = async (id: any) => {
    const counts: any = {};

    const tasks: any = [];

    Object.keys(GIFTS).forEach(g=>{
        tasks.push(controllerContract.methods.getGiftCount(id, g).call().then( (c:any) => { counts[g] = Number(c); }));
    })
  
    await Promise.all(tasks);
  
    return counts;
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
    const infoTask = getGraveInfo(id);
    const countsTask = getGiftsInfo(id);

    const info = await infoTask;
    if (info.name) {
        const attrs = [
            {
                "trait_type": "Date of Birth",
                "value": buildDateString(info.birthDate)
            },{
                "trait_type": "Date of Death",
                "value": buildDateString(info.deathDate)
            }
        ];

        const md:any = {
            name: `${info.name}'s Grave #${id}`,
            description: "BenSwap Cemetery - Bury in your favorite blockchain.",
            attributes: attrs,
            time_of_birth: buildTimeString(info.birthDate),
            time_of_death: buildTimeString(info.deathDate),
            image: `https://api2.benswap.cash/grave/imageLite?a=${encodeURIComponent(info.name)}&b=${info.birthDate}&c=${info.deathDate}`
        };

        if (info.engraver) md.engraver = info.engraver;
        if (info.epitaph) md.epitaph = info.epitaph;

        const counts = await countsTask;

        Object.keys(GIFTS).forEach((g:any)=>{
            if (counts[g]) {
                attrs.push({
                    "trait_type": GIFTS[g],
                    "value": counts[g]
                });
            }
        })

        return md;
    }

    return {};
}

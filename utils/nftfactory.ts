import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import nftFactorySingle from "./abis/nftFactorySingle.json";

const nftFactorySingleContract = getContract(nftFactorySingle, '0xF8E0755544ED3133182085773213727Eb05258bd');
const TRAIT_SEPERATOR = "({!@#$%^&*?})";

const buildAttributes = (attrs: any) => {
    const a = attrs.split(TRAIT_SEPERATOR);
    const t:any = [];
    if (a.length>0 && a.length % 2 ===0) {
        for (let i=0; i<a.length; i=i+2) {
            t.push({
                "trait_type": a[i],
                "value": a[i+1]
            });
        }
        return t;
    }
}

export const getMiscMetadata = async(id: any) => {
    const info = await nftFactorySingleContract.methods.getNftInfo(id).call();

    const md:any = {};
    if (info?.name && info.name.length<40) md.name = info.name;
    if (info?.description) md.description = info.description;
    if (info?.image) md.image = info.image;
    if (info?.externalUrl) md.external_url = info.externalUrl;
    if (info?.attributes) md.attributes = buildAttributes(info.attributes);

    return md;
}

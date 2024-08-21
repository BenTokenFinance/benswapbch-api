import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import nftFactorySingle from "./abis/nftFactorySingle.json";

const nftFactorySingleContract = getContract(nftFactorySingle, '0xF8E0755544ED3133182085773213727Eb05258bd');
const TRAIT_SEPERATOR = "({!@#$%^&*?})";
const filterMatcher1 = /^https:\/\/raw.githubusercontent.com\/AliLay\/*\.jpg$/

const filterImages = (image:any) => {
    if (image) {
        if (String(image).match(filterMatcher1)) {
            return "";
        }
    }
    return image;
}

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
    const creator = await nftFactorySingleContract.methods.getCreator(id).call();
    const info = await nftFactorySingleContract.methods.getNftInfo(id).call();

    const md:any = {
        creator
    };
    if (info?.name) md.name = info.name;
    if (info?.description) md.description = info.description;
    if (info?.image) md.image = filterImages(info.image);
    if (info?.externalUrl) md.external_url = info.externalUrl;
    if (info?.attributes) md.attributes = buildAttributes(info.attributes);

    return md;
}

export const getSimpleSeriesData = async(address:any, id: any) => {
    const contract = getContract(nftFactorySingle, address);
    const info = await contract.methods.getNftInfo(id).call();

    const md:any = {};
    if (info?.name) md.name = info.name;
    if (info?.description) md.description = info.description;
    if (info?.image) md.image = filterImages(info.image);
    if (info?.externalUrl) md.external_url = info.externalUrl;
    if (info?.attributes) md.attributes = buildAttributes(info.attributes);

    return md;
}

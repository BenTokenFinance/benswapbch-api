
import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import blindboxes from "./abis/blindboxes.json";

export const contracts:any = {
  "test" : {
    "0x6d1845547f638E2179C6c9201265a0379c0907f4" : 1,
    "0xf7375083a569737B63f5d67B03Eb8EbCC7B07b25" : 1,
    "0x38a053A035B2FCA62bB90AB20bbBFCA32d6bdDdE" : 1,
    "0x5aB2D99fd52B9BB033CE7d6B918fCcF8ECdf0633" : 1,
    "0xA7b4e07E3fEB2aFe2A647aAB4fc742c222247a2b" : 1,
    "0xf76cC72017A9998b7C92F55a86Fd40Ee5442C653" : 1,
    "0x6a60A8746c55958c080bC1963718918D29287d18" : 1,
    "0x74fAE9400Dd38203Eed92897DA8dB5C36d83d624" : 1,
    "0x6Dc8586aA97eDF0E625F66dcfe4dEd04D6b115Ba" : 1
  },
  "production" : {

  }
};

export const pictureFormat: any = {
    1 : "jpg"
}

export const getRarity = (cardType:any) => {
    const ctn = Number(cardType);
    if (cardType <=2) return "UR";
    if (cardType <=4) return "SSR";
    return "SR";
}

export const getMetadata = async (address:any, id:any) {
    const number = contracts.test[address] || contracts.production[address];

    if (number) {
        const contract = getContract(blindboxes, address);
        const desc = infos[number].desc;

        try {
            const cardTypeTask = contract.methods.getCardType(id).call();
            const isClaimed = await contract.methods.isClaimed(id).call();
            const cardType = await cardTypeTask;

            console.log(`Collection Number ${number}. Cart Type ${cardType}. Redemption Status: ${isClaimed}.`);

            if (Number(cardType) > 0) {
                const info = infos[number][cardType];
                return Object.assign({}, info, {
                    "name" : `${info.name} #${id}`,
                    "description" : desc,
                    "image": `https://asset.benswap.cash/nft/blindboxes/${number}/${cardType}${isClaimed?"R":""}.${pictureFormat[number]||'png'}`,
                    "attributes": [
                        {"trait_type":"Name","value": info.name},
                        {"trait_type":"Rarity","value": getRarity(cardType)},
                        {"trait_type":"Status","value": isClaimed ? "Redeemed":"Not Redeemed"}
                    ]
                });
            } else {
                return {
                    "name" : `Blind Box #${id}`,
                    "description" : desc,
                    "image": "https://asset.benswap.cash/nft/blindboxes/box.png",
                    "attributes": [
                        {"trait_type":"Status","value":"Not Opened"}
                    ]
                };
            }
        } catch (e) {
            console.error(e);
        }
    }

    return {};
}

export const infos:any = {
    "1" : {
        "desc": "As a classic work of Chinese literature, the Romance of The Three Kingdoms attracts countless people with its heroes and wars. Now, through NFT technology, we can experience this history again. This NFT event will create a series of unique digital collectibles. Each NFT representing a famous general or important scene in the history of The Three Kingdoms and endows it with unique attributes and value. From legendary figures like Lyu Bu and Guan Yu to epic characters like Diao Chan and Xiao Qiao, to rare characters like Xu Huang and Xiahou Dun, all NFTs will showcase the history and culture of the Three Kingdoms through exquisite art and rich background stories. Participants can not only collect these precious NFTs and experience the conflicts and strategies of the Three Kingdoms era, but also win huge bonuses by collecting cards. Come and join us now!",
        "1" : {
            "name" : "Lyu Bu (吕布)",
            "dialog" : "Bu is not bellicose, only good at resolving conflicts!"
        },
        "2" : {
            "name" : "Guan Yu (关羽)",
            "dialog" : "Traveling thousands of miles, a lone ride can withstand a million troops!"
        },
        "3" : {
            "name" : "Diao Chan (貂蝉)",
            "dialog" : "Dancing among the cherry blossoms, graceful and enchanting!"
        },
        "4" : {
            "name" : "Xiao Qiao (小乔)",
            "dialog" : "Holding an umbrella, enjoying the sunset, the beautiful scenery delights the heart!"
        },
        "5" : {
            "name" : "Xu Huang (徐晃)",
            "dialog" : "Without supplies, the enemy will collapse gradually."
        },
        "6" : {
            "name" : "Xiahou Dun (夏侯惇)",
            "dialog" : "Swinging the single-arm broadsword, the battlefield is dyed red with smoke and blood!"
        },
        "7" : {
            "name" : "Yan Liang (颜良)",
            "dialog" : "Under the banner, adorned in embroidered robes and golden armor, a leader wielding a blade!"
        },
        "8" : {
            "name" : "Wen Chou (文丑)",
            "dialog" : "One test of the shield, one test of the spear, displaying might from the very outset."
        },
        "9" : {
            "name" : "Xu Zhu (许诸)",
            "dialog" : "Amidst the battlefield's flames, facing certain death, what fear is there?"
        },
        "10" : {
            "name" : "Wei Yan (魏延)",
            "dialog" : "Amidst flashing lightning, rebellious and proud, showcasing true colors!"
        }
    }
};

import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import blindboxes from "./abis/blindboxes.json";

export const contracts:any = {
  "test" : {
    "0x3E66d34eC4cC8E8C799023194F102B42389c1cc0" : 1,
    "0xc2c7E59994c304f9067169c6025E9A66D1cc418C" : 1
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
        "desc": "As a classic work of Chinese literature, the Romance of The Three Kingdoms attracts countless people with its heroes and wars. Now, through NFT technology, we can experience this history again. This NFT event will create a series of unique digital collectibles. Each NFT representing a famous general or important scene in the history of The Three Kingdoms and endows it with unique attributes and value. From legendary figures like Lyu Bu and Zhang Fei to epic characters like Diao Chan and Xiao Qiao, to rare characters like Xu Huang and Xiahou Dun, all NFTs will showcase the history and culture of the Three Kingdoms through exquisite art and rich background stories. Participants can not only collect these precious NFTs and experience the conflicts and strategies of the Three Kingdoms era, but also win huge bonuses by collecting cards. Come and join us now!",
        "1" : {
            "name" : "Lyu Bu",
            "dialog" : "Bu is not bellicose, only good at resolving conflicts!"
        },
        "2" : {
            "name" : "Guan Yu",
            "dialog" : "Traveling thousands of miles, a lone ride can withstand a million troops!"
        },
        "3" : {
            "name" : "Diao Chan",
            "dialog" : "Dancing among the cherry blossoms, graceful and enchanting!"
        },
        "4" : {
            "name" : "Xiao Qiao",
            "dialog" : "Holding an umbrella, enjoying the sunset, the beautiful scenery delights the heart!"
        },
        "5" : {
            "name" : "Xu Huang",
            "dialog" : "Though small, able to turn the tide!"
        },
        "6" : {
            "name" : "Xiahou Dun",
            "dialog" : "Swinging the single-arm broadsword, the battlefield is dyed red with smoke and blood!"
        },
        "7" : {
            "name" : "Yan Liang",
            "dialog" : "Under the banner, adorned in embroidered robes and golden armor, a leader wielding a blade!"
        },
        "8" : {
            "name" : "Wen Chou",
            "dialog" : "One test of the shield, one test of the spear, displaying might from the very outset."
        },
        "9" : {
            "name" : "Xu Zhu",
            "dialog" : "Amidst the battlefield's flames, facing certain death, what fear is there?"
        },
        "10" : {
            "name" : "Wei Yan",
            "dialog" : "Amidst flashing lightning, rebellious and proud, showcasing true colors!"
        }
    }
};
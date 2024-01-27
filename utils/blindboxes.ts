
import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import blindboxes from "./abis/blindboxes.json";

export const contracts:any = {
  "test" : {
    "0x3E66d34eC4cC8E8C799023194F102B42389c1cc0" : 1
  },
  "production" : {

  }
};

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
                    "image": `https://asset.benswap.cash/nft/blindboxes/${number}/${cardType}${isClaimed?"R":""}.png`,
                    "attributes": [
                        {"trait_type":"Name","value": info.name},
                        {"trait_type":"Rarity","value": getRarity(cardType)}
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
            "dialog" : "Who else can match me in this world?"
        },
        "2" : {
            "name" : "Zhang Fei",
            "dialog" : "Who dares to come and fight?"
        },
        "3" : {
            "name" : "Diao Chan",
            "dialog" : "Your attention means a whole world to me."
        },
        "4" : {
            "name" : "Xiao Qiao",
            "dialog" : "This flower sea is my gift to you."
        },
        "5" : {
            "name" : "Xu Huang",
            "dialog" : "Grain carts may be small, but crucial in a war."
        },
        "6" : {
            "name" : "Xiahou Dun",
            "dialog" : "Whoever hurts me will be paid back tenfold."
        },
        "7" : {
            "name" : "Yan Liang",
            "dialog" : "I am general Yan Liang from Hebei province."
        },
        "8" : {
            "name" : "Wen Chou",
            "dialog" : "I am general Wen Chou from Hebei province."
        },
        "9" : {
            "name" : "Xu Zhu",
            "dialog" : "Who will fight me for three hundred rounds?"
        },
        "10" : {
            "name" : "Wei Yan",
            "dialog" : "My arrogance is backed by my capabilities."
        }
    }
};
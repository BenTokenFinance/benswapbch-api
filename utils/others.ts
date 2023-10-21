const got = require('got');
import Web3 from "web3";

export const getBchPrice =  async () => {
    const body = await got("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd").json();
    return body;
};

export const getBchHistoryPrices =  async () => {
    const body = await got("https://api.coingecko.com/api/v3/coins/bitcoin-cash/market_chart?vs_currency=usd&days=8").json();
    return body;
};

export const getTokenInfo = async (address:any) => {
    try {
        const checkSumAddress = Web3.utils.toChecksumAddress(address);
        const body = await got(`https://asset.benswap.cash/assets/${checkSumAddress}/info.json`).json().catch((e:any)=>{
            console.error(e);
        });
        if (body) {
            body.address = checkSumAddress;
            return body;
        }
    } catch(e) {
        console.error(e);
    }
    return {};
}

export const getGraphNodesHealthUrls = async () => {
    const body = await got("https://asset.benswap.cash/graph_node_health_urls.json").json();
    return body;
}
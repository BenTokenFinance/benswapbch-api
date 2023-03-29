const got = require('got');

export const getBchPrice =  async () => {
    // const body = await got("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd").json();
    // return body;

    const body = await got("https://api.coingecko.com/api/v3/coins/bitcoin-cash/market_chart?vs_currency=usd&days=1&interval=daily").json();
    const price = body.prices[body.prices.length-1][1];
    return {
        "bitcoin-cash": {
            usd: price
        }
    };
};

export const getBchHistoryPrices =  async () => {
    const body = await got("https://api.coingecko.com/api/v3/coins/bitcoin-cash/market_chart?vs_currency=usd&days=8&interval=hour").json();
    return body;
};

export const getSep20Assets = async () => {
    const body = await got("https://asset.benswap.cash/tokens.json").json();
    return body;
}

export const getGraphNodesHealthUrls = async () => {
    const body = await got("https://asset.benswap.cash/graph_node_health_urls.json").json();
    return body;
}
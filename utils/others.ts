const got = require('got');

export const getBchPrice =  async () => {
    const body = await got("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd").json();
    return body;
};

export const getSep20Assets = async () => {
    const body = await got("https://asset.benswap.cash/tokens.json").json();
    return body;
}

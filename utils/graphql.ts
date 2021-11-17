import { ExchangeClient, BlockClient } from './apollo/client'
import { 
    splitQuery, GLOBAL_DATA, ALL_TOKENS_SIMPLE, GET_BLOCK, GET_BLOCKS, PAIRS, TOKENS, 
    CANDLE_ONE_MIN_BCH, CANDLE_ONE_MIN_USD
} from './apollo/queries'
import { getWeb3 } from "./web3";
import BigNumber from "bignumber.js";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

async function getGlobalData(block: string) {
    let data: any = {}

    try {
        // fetch the global data
        const result = await ExchangeClient.query({
            query: GLOBAL_DATA(block),
            fetchPolicy: 'network-only',
        })
        data = result.data.benSwapFactories[0];
    } catch (e) {
        console.error(e);
    }
    
    return data || {};
}

async function getTokenCount(block: string) {
    let count = 0;

    try {
        // fetch tokens
        const result = await ExchangeClient.query({
            query: ALL_TOKENS_SIMPLE(block),
            fetchPolicy: 'network-only',
        })
        count = result.data.tokens.length;
    } catch (e) {
        console.error(e);
    }
    
    return count || 0;
}

const BaseTokens = [
    "0x7b2b3c5308ab5b2a1d9a94d20d35ccdf61e05b72",   // flexUSD
    "0x3743ec0673453e5009310c727ba4eaf7b3a1cc04",   // WBCH
    "0x77cb87b57f54667978eb1b199b28a0db8c8e1c0b",   // EBEN
]

function getPairSymbol(t1:any, t2:any) {
    // Construct symbol
    let symbol = t1.symbol + "_" + t2.symbol;
    for (let i=0; i<BaseTokens.length; i++) {
        let b = BaseTokens[i];
        if (t2.id == b) break;
        else if (t1.id == b) {
            symbol = t2.symbol + "_" + t1.symbol;
            break;
        }
    }
    return symbol;
}

function processPairData(pair: any) {
    let symbol = getPairSymbol(pair.token0, pair.token1);

    return {
        "id": pair.id,
        "symbol": symbol,
        "createBlock": pair.createBlock,
        "liquidityBch": pair.liquidityBch,
        "liquidityUsd": pair.liquidityUsd,
        "volumeUsd": pair.volumeUsd,
        "volumeBch": pair.volumeBch,
        "token0": {
            "id": pair.token0.id,
            "symbol": pair.token0.symbol,
            "priceUsd": pair.token0.priceUsd,
            "volume": pair.volumeToken0
        },
        "token1": {
            "id": pair.token1.id,
            "symbol": pair.token1.symbol,
            "priceUsd": pair.token1.priceUsd,
            "volume": pair.volumeToken1
        },
        "transactions": pair.totalTransactions
    }
}

function processTokenData(token: any) {
    const pairs = token.pairs1.concat(token.pairs2).map((p:any) =>{
        return {
            "id": p.id,
            "symbol": getPairSymbol(token, p.theOtherToken),
            "theOtherToken": {
                "id": p.theOtherToken.id,
                "symbol": p.theOtherToken.symbol
            }
        };
    });

    return {
        "id": token.id,
        "name": token.name,
        "symbol": token.symbol,
        "transactions": token.totalTransactions,
        "liquidity": token.totalLiquidity,
        "liquidityBch": new BigNumber(token.totalLiquidity).times(token.priceBch).toString(),
        "liquidityUsd": new BigNumber(token.totalLiquidity).times(token.priceUsd).toString(),
        "priceBch": token.priceBch,
        "priceUsd": token.priceUsd,
        "volume": token.totalVolume,
        "volumeUsd": token.totalVolumeUsd,
        "pairs": pairs
    };
}

async function getPairs(block: any = undefined, id: any = undefined) {
    let data: any = []

    try {
        // fetch the pairs data
        const result = await ExchangeClient.query({
            query: PAIRS(block, id),
            fetchPolicy: 'network-only',
        })
        data = result.data.pairs.map(processPairData);
    } catch (e) {
        console.error(e);
    }
    
    return data || [];
}

async function getTokens(block: any = undefined, id: any = undefined) {
    let data: any = []

    try {
        // fetch the tokens data
        const result = await ExchangeClient.query({
            query: TOKENS(block, id),
            fetchPolicy: 'network-only',
        })
        data = result.data.tokens.map(processTokenData);
    } catch (e) {
        console.error(e);
    }
    
    return data || [];
}


// DEX stats
export const getDexStats = async (block: string) => {
    const res: any = {};
    const tasks = [
        getGlobalData(block).then(data => {Object.assign(res, data)}),
        getTokenCount(block).then(count => {res.totalTokens = count;})
    ];
    await Promise.all(tasks);
    delete res.__typename;
    if (!res.factoryAddress) delete res.totalTokens;
    return res;
}

function getPair24HourData(pair: any, pair24HoursAgo: any) {
    return {
        "transactions": new BigNumber(pair.transactions).minus(pair24HoursAgo.transactions).toString(),
        "liquidityChangeBch": new BigNumber(pair.liquidityBch).minus(pair24HoursAgo.liquidityBch).toString(),
        "liquidityChangeUsd": new BigNumber(pair.liquidityUsd).minus(pair24HoursAgo.liquidityUsd).toString(),
        "volumeBch": new BigNumber(pair.volumeBch).minus(pair24HoursAgo.volumeBch).toString(),
        "volumeUsd": new BigNumber(pair.volumeUsd).minus(pair24HoursAgo.volumeUsd).toString(),
        "priceUsdChangeToken0": new BigNumber(pair.token0.priceUsd).minus(pair24HoursAgo.token0.priceUsd).toString(),
        "priceUsdChangeToken1": new BigNumber(pair.token1.priceUsd).minus(pair24HoursAgo.token1.priceUsd).toString(),
        "volumeToken0": new BigNumber(pair.token0.volume).minus(pair24HoursAgo.token0.volume).toString(),
        "volumeToken1": new BigNumber(pair.token1.volume).minus(pair24HoursAgo.token1.volume).toString()
    };
}

// Pairs
export const getAllPairs = async () => {
    const pairs = await getPairs();
    if (!pairs.length) return pairs;

    const timestampOneDayBack = dayjs().subtract(1, 'day').unix();
    console.log("Timestamp 24 hours back: "+ timestampOneDayBack);
    const blockNumber24HoursAgo = await getBlockFromTimestamp(timestampOneDayBack);
    console.log("Block 24 hours back: "+ blockNumber24HoursAgo);
    
    const pairs24HoursAgo = await getPairs(blockNumber24HoursAgo);
    const pairs24HoursAgoIndex = pairs24HoursAgo.reduce(function(result:any, pair:any, index:any) {
        result[pair.id] = index;
        return result;
    }, {});
    
    return pairs.filter(function(pair:any){
        return typeof(pairs24HoursAgoIndex[pair.id]) == "number"; 
    }).map(function(pair:any){
        const pair24HoursAgo = pairs24HoursAgo[pairs24HoursAgoIndex[pair.id]];
        pair["24Hours"] = getPair24HourData(pair, pair24HoursAgo);
        return pair;
    });
}

// Pair
export const getPair = async (id: any, block: any = undefined) => {
    const web3 = getWeb3();
    const blockNumber: any = block === undefined ? undefined : new BigNumber(block).toNumber();
    console.log("Block: "+ blockNumber);

    const pairs = await getPairs(blockNumber, id);
    if (pairs.length != 1) return {};

    const timestampOneDayBack = (block === undefined ? dayjs(new Date()) : dayjs.unix(Number((await web3.eth.getBlock(blockNumber)).timestamp))).subtract(1, 'day').unix();
    console.log("Timestamp 24 hours back: "+ timestampOneDayBack);
    const blockNumber24HoursAgo = await getBlockFromTimestamp(timestampOneDayBack);
    console.log("Block 24 hours back: "+ blockNumber24HoursAgo);

    const pairs24HoursAgo = await getPairs(blockNumber24HoursAgo, id);

    if (pairs24HoursAgo.length != 1) return {};
    const pair = pairs[0];
    pair["24Hours"] = getPair24HourData(pair, pairs24HoursAgo[0]);
    return pair;
}

// Tokens
export const getAllTokens = async () => {
    const tokens = await getTokens();
    tokens.sort(function(a:any, b:any){
        return new BigNumber(b.liquidityBch).minus(a.liquidityBch).toNumber();
    });

    return tokens;
}

// Token
export const getToken = async (id: any, block: any = undefined) => {
    const web3 = getWeb3();
    const blockNumber: any = block === undefined ? undefined : new BigNumber(block).toNumber();
    console.log("Block: "+ blockNumber);

    const token = await getTokens(blockNumber, id);
    return token;
}

const TradeDataConfig: any = {
    "BCH": {
        "1m" : {
            query: CANDLE_ONE_MIN_BCH
        },
        "15m" : {
            query: CANDLE_ONE_MIN_BCH
        },
        "1h" : {
            query: CANDLE_ONE_MIN_BCH
        },
        "1d" : {
            query: CANDLE_ONE_MIN_BCH
        },
        "1w" : {
            query: CANDLE_ONE_MIN_BCH
        }
    },
    "USD": {
        "1m" : {
            query: CANDLE_ONE_MIN_USD
        },
        "15m" : {
            query: CANDLE_ONE_MIN_USD
        },
        "1h" : {
            query: CANDLE_ONE_MIN_USD
        },
        "1d" : {
            query: CANDLE_ONE_MIN_USD
        },
        "1w" : {
            query: CANDLE_ONE_MIN_USD
        }
    }
}

function processTrades(rawData:any) {
    var processed = rawData.map((e:any,i:any) => {
        var open = i<rawData.length-1 ? rawData[i+1].close : e.open; 
        return Object.assign({}, e, {open: open, low: Math.min(open, e.low), high: Math.max(open, e.high)});
    }).reverse();

    processed.forEach((e:any,i:any) => {
        // Mitigate spikes
        e.high = e.high >= Math.max(e.open, e.close) * 1.4 ? Math.max(e.open, e.close) * 1.2 : e.high;
        e.low = e.high <= Math.min(e.open, e.close) * 0.65 ? Math.min(e.open, e.close) * 0.85 : e.low;
        if (i<processed.length-1) {
            var next = processed[i+1];
            if (e.close == e.high && next.open == next.high && e.close >= e.open * 1.4 && next.close * 1.4 <= next.open) {
                e.close = e.open * 1.2;
                e.high = e.close;
                next.open = e.close;
                next.high = e.close;
            }
        }
    });
    return processed;
}

export async function getTrades(base:string, range:string, token: any, before: any = undefined) {
    let data: any = []

    try {
        console.log(base, range, token, before);
        const result = await ExchangeClient.query({
            query: TradeDataConfig[base][range].query(token, before),
            fetchPolicy: 'network-only',
        })
        data = result.data.trades.map(processTrades);
    } catch (e) {
        console.error(e);
    }
    
    return data || [];
}

/**
 * @notice Fetches first block after a given timestamp
 * @dev Query speed is optimized by limiting to a 600-second period
 * @param {Int} timestamp in seconds
 */
 export async function getBlockFromTimestamp(timestamp:any) {
    let result = await BlockClient.query({
      query: GET_BLOCK,
      variables: {
        timestampFrom: timestamp,
        timestampTo: timestamp + 600,
      },
      fetchPolicy: 'network-only',
    })
    return result?.data?.blocks?.[0]?.number
}
  
/**
 * @notice Fetches block objects for an array of timestamps.
 * @dev blocks are returned in chronological order (ASC) regardless of input.
 * @dev blocks are returned at string representations of Int
 * @dev timestamps are returns as they were provided; not the block time.
 * @param {Array} timestamps
 */
export async function getBlocksFromTimestamps(timestamps:any, skipCount = 500) {
    if (timestamps?.length === 0) {
      return []
    }
  
    let fetchedData = await splitQuery(GET_BLOCKS, BlockClient, [], timestamps, skipCount)
  
    let blocks = []
    if (fetchedData) {
      for (var t in fetchedData) {
        if (fetchedData[t].length > 0) {
          blocks.push({
            timestamp: t.split('t')[1],
            number: fetchedData[t][0]['number'],
          })
        }
      }
    }
    return blocks
}

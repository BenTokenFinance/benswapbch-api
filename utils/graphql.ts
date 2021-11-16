import { ExchangeClient, BlockClient } from './apollo/client'
import { splitQuery, GLOBAL_DATA, ALL_TOKENS_SIMPLE, GET_BLOCK, GET_BLOCKS, ALL_PAIRS } from './apollo/queries'
import { getWeb3 } from "./web3";
import BigNumber from "bignumber.js";

async function getGlobalData(block: string) {
    let data: any = {}

    try {
        // fetch the global data
        const result = await ExchangeClient.query({
            query: GLOBAL_DATA(block),
            fetchPolicy: 'cache-first',
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
            fetchPolicy: 'cache-first',
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

function processPairData(pair: any) {
    // Construct symbol
    let symbol = pair.token0.symbol + "_" + pair.token1.symbol;
    for (let i=0; i<BaseTokens.length; i++) {
        let b = BaseTokens[i];
        if (pair.token0.id == b) {
            symbol = pair.token1.symbol + "_" + pair.token0.symbol;
            break;
        }
    }

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
            "volume": pair.volumeToken0
        },
        "token1": {
            "id": pair.token1.id,
            "symbol": pair.token1.symbol,
            "volume": pair.volumeToken1
        },
        "totalTransactions": pair.totalTransactions
    }
}

async function getPairs(block: any) {
    let data: any = []

    try {
        // fetch the pairs data
        const result = await ExchangeClient.query({
            query: ALL_PAIRS(block),
            fetchPolicy: 'cache-first',
        })
        data = result.data.pairs.map(processPairData);
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
        "transactions": new BigNumber(pair.totalTransactions).minus(pair24HoursAgo.totalTransactions).toString(),
        "liquidityBch": new BigNumber(pair.liquidityBch).minus(pair24HoursAgo.liquidityBch).toString(),
        "liquidityUsd": new BigNumber(pair.liquidityUsd).minus(pair24HoursAgo.liquidityUsd).toString(),
        "volumeBch": new BigNumber(pair.volumeBch).minus(pair24HoursAgo.volumeBch).toString(),
        "volumeUsd": new BigNumber(pair.volumeUsd).minus(pair24HoursAgo.volumeUsd).toString(),
        "volumeToken0": new BigNumber(pair.token0.volume).minus(pair24HoursAgo.token0.volume).toString(),
        "volumeToken1": new BigNumber(pair.token1.volume).minus(pair24HoursAgo.token1.volume).toString()
    };
}

// Pairs
export const getAllPairs = async () => {
    const web3 = getWeb3();
    const timestamp24HoursAgo = parseInt(((new Date().valueOf()/1000)-86400).toString());
    const blockNumber24HoursAgo = await getBlockFromTimestamp(timestamp24HoursAgo);
    const pairs = await getPairs(null);
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
      fetchPolicy: 'cache-first',
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

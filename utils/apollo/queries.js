import gql from 'graphql-tag'

const FACTORY_ADDRESS = '0x8d973bAD782c1FFfd8FcC9d7579542BA7Dd0998D'
const BUNDLE_ID = '1'

export async function splitQuery(query, localClient, vars, list, skipCount = 100) {
  let fetchedData = {}
  let allFound = false
  let skip = 0

  while (!allFound) {
    let end = list.length
    if (skip + skipCount < list.length) {
      end = skip + skipCount
    }
    let sliced = list.slice(skip, end)
    let result = await localClient.query({
      query: query(...vars, sliced),
      fetchPolicy: 'cache-first',
    })
    fetchedData = {
      ...fetchedData,
      ...result.data,
    }
    if (Object.keys(result.data).length < skipCount || skip + skipCount > list.length) {
      allFound = true
    } else {
      skip += skipCount
    }
  }

  return fetchedData
}

export const GET_BLOCK = gql`
  query blocks($timestampFrom: Int!, $timestampTo: Int!) {
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: asc
      where: { timestamp_gt: $timestampFrom, timestamp_lt: $timestampTo }
    ) {
      id
      number
      timestamp
    }
  }
`

export const GET_BLOCKS = (timestamps) => {
  let queryString = 'query blocks {'
  queryString += timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600
      } }) {
      number
    }`
  })
  queryString += '}'
  return gql(queryString)
}

export const GLOBAL_DATA = (block) => {
  const queryString = ` query benSwapFactories {
      benSwapFactories(
       ${block ? `block: { number: ${block}}` : ``} 
       where: { id: "${FACTORY_ADDRESS}" }) {
        factoryAddress: id
        totalVolumeUsd: totalVolumeUSD
        totalVolumeBch: totalVolumeBCH
        totalLiquidityUsd: totalLiquidityUSD
        totalLiquidityBch: totalLiquidityBCH
        totalTransactions
        totalPairs
      }
    }`
  return gql(queryString)
}

export const ALL_TOKENS_SIMPLE = (block) => {
  const queryString = ` query tokens {
      tokens (first: 1000 ${block ? `, block: { number: ${block}}` : ``}){
        id
      }
    }`
  return gql(queryString)
}

export const PAIRS = (block, id) => {
  const queryString = ` query pairs {
    pairs(
     ${block ? `block: { number: ${block}}` : ``} 
     where: { reserveBCH_gt: 5, totalTransactions_gt: 10 ${id ? `, id: "${id}"` : ``} }
     orderBy: reserveBCH
     orderDirection: desc
    ) {
      id,
      createBlock: block,
      volumeToken0,
      volumeToken1,
      volumeUsd: volumeUSD,
      volumeBch: volumeBCH,
      liquidityUsd: reserveUSD,
      liquidityBch: reserveBCH,
      totalTransactions,
      token0 {
        id
        symbol
        priceUsd: derivedUSD
      }
      token1 {
        id
        symbol
        priceUsd: derivedUSD
      }
    }
  }`
return gql(queryString)
}

export const TOKENS = (block, id) => {
  const queryString = ` query tokens {
    tokens(
      ${block ? `block: { number: ${block}}` : ``} 
      where: {
        derivedBCH_gt: 0, 
        id_not_in: ["0x3743ec0673453e5009310c727ba4eaf7b3a1cc04", "0xbb1fcb08961d7fc7ab58dc608a0448aa30e66269"]
        ${id ? `, id: "${id}"` : ``}
      }
    ) {
      id,
      name,
      symbol,
      totalTransactions,
      totalLiquidity,
      priceBch: derivedBCH,
      priceUsd: derivedUSD,
      totalVolume: tradeVolume,
      totalVolumeUsd: tradeVolumeUSD,
      pairs1: pairBase (where: {reserveBCH_gt:5, totalTransactions_gt:10}) {
        id,
        theOtherToken: token1 {
          id
          symbol
        }
      },
      pairs2: pairQuote (where: {reserveBCH_gt:5, totalTransactions_gt:10}) {
        id,
        theOtherToken: token0 {
          id
          symbol
        }
      }
    }
  }`
  return gql(queryString)
}

export const CANDLE_1_MIN_BCH = (token, before) => {
  const queryString = ` query tokenTradeOneMinDatas {
    trades: tokenTradeOneMinDatas (
      first: 1000, 
      where: {
        token: "${token}"
        ${before ? `, startTimestamp_lt: ${before}` : ``}
      },
      orderBy:startTimestamp,
      orderDirection:desc
    ) {
      trades: count,
      timestamp: startTimestamp,
      volume,
      low:priceLowBCH,
      high:priceHighBCH,
      open:priceStartBCH,
      close:priceEndBCH
    }
  }`
  return gql(queryString)
}

export const CANDLE_1_MIN_USD = (token, before) => {
  const queryString = ` query tokenTradeOneMinDatas {
    trades: tokenTradeOneMinDatas (
      first: 1000, 
      where: {
        priceStart_gt: 0,
        token: "${token}"
        ${before ? `, startTimestamp_lt: ${before}` : ``}
      },
      orderBy:startTimestamp,
      orderDirection:desc
    ) {
      trades: count,
      timestamp: startTimestamp,
      volume,
      low:priceLow,
      high:priceHigh,
      open:priceStart,
      close:priceEnd
    }
  }`
  return gql(queryString)
}

export const CANDLE_15_MIN_BCH = (token, before) => {
  const queryString = ` query tokenTradeFifteenMinDatas {
    trades: tokenTradeFifteenMinDatas (
      first: 1000, 
      where: {
        token: "${token}"
        ${before ? `, startTimestamp_lt: ${before}` : ``}
      },
      orderBy:startTimestamp,
      orderDirection:desc
    ) {
      trades: count,
      timestamp: startTimestamp,
      volume,
      low:priceLowBCH,
      high:priceHighBCH,
      open:priceStartBCH,
      close:priceEndBCH
    }
  }`
  return gql(queryString)
}

export const CANDLE_15_MIN_USD = (token, before) => {
  const queryString = ` query tokenTradeFifteenMinDatas {
    trades: tokenTradeFifteenMinDatas (
      first: 1000, 
      where: {
        priceStart_gt: 0,
        token: "${token}"
        ${before ? `, startTimestamp_lt: ${before}` : ``}
      },
      orderBy:startTimestamp,
      orderDirection:desc
    ) {
      trades: count,
      timestamp: startTimestamp,
      volume,
      low:priceLow,
      high:priceHigh,
      open:priceStart,
      close:priceEnd
    }
  }`
  return gql(queryString)
}

export const CANDLE_1_HOUR_BCH = (token, before) => {
  const queryString = ` query tokenTradeHourDatas {
    trades: tokenTradeHourDatas (
      first: 1000, 
      where: {
        token: "${token}"
        ${before ? `, startTimestamp_lt: ${before}` : ``}
      },
      orderBy:startTimestamp,
      orderDirection:desc
    ) {
      trades: count,
      timestamp: startTimestamp,
      volume,
      low:priceLowBCH,
      high:priceHighBCH,
      open:priceStartBCH,
      close:priceEndBCH
    }
  }`
  return gql(queryString)
}

export const CANDLE_1_HOUR_USD = (token, before) => {
  const queryString = ` query tokenTradeHourDatas {
    trades: tokenTradeHourDatas (
      first: 1000, 
      where: {
        priceStart_gt: 0,
        token: "${token}"
        ${before ? `, startTimestamp_lt: ${before}` : ``}
      },
      orderBy:startTimestamp,
      orderDirection:desc
    ) {
      trades: count,
      timestamp: startTimestamp,
      volume,
      low:priceLow,
      high:priceHigh,
      open:priceStart,
      close:priceEnd
    }
  }`
  return gql(queryString)
}

export const CANDLE_1_DAY_BCH = (token, before) => {
  const queryString = ` query tokenTradeDayDatas {
    trades: tokenTradeDayDatas (
      first: 1000, 
      where: {
        token: "${token}"
        ${before ? `, startTimestamp_lt: ${before}` : ``}
      },
      orderBy:startTimestamp,
      orderDirection:desc
    ) {
      trades: count,
      timestamp: startTimestamp,
      volume,
      low:priceLowBCH,
      high:priceHighBCH,
      open:priceStartBCH,
      close:priceEndBCH
    }
  }`
  return gql(queryString)
}

export const CANDLE_1_DAY_USD = (token, before) => {
  const queryString = ` query tokenTradeDayDatas {
    trades: tokenTradeDayDatas (
      first: 1000, 
      where: {
        priceStart_gt: 0,
        token: "${token}"
        ${before ? `, startTimestamp_lt: ${before}` : ``}
      },
      orderBy:startTimestamp,
      orderDirection:desc
    ) {
      trades: count,
      timestamp: startTimestamp,
      volume,
      low:priceLow,
      high:priceHigh,
      open:priceStart,
      close:priceEnd
    }
  }`
  return gql(queryString)
}

export const CANDLE_1_WEEK_BCH = (token, before) => {
  const queryString = ` query tokenTradeWeekDatas {
    trades: tokenTradeWeekDatas (
      first: 1000, 
      where: {
        token: "${token}"
        ${before ? `, startTimestamp_lt: ${before}` : ``}
      },
      orderBy:startTimestamp,
      orderDirection:desc
    ) {
      trades: count,
      timestamp: startTimestamp,
      volume,
      low:priceLowBCH,
      high:priceHighBCH,
      open:priceStartBCH,
      close:priceEndBCH
    }
  }`
  return gql(queryString)
}

export const CANDLE_1_WEEK_USD = (token, before) => {
  const queryString = ` query tokenTradeWeekDatas {
    trades: tokenTradeWeekDatas (
      first: 1000, 
      where: {
        priceStart_gt: 0,
        token: "${token}"
        ${before ? `, startTimestamp_lt: ${before}` : ``}
      },
      orderBy:startTimestamp,
      orderDirection:desc
    ) {
      trades: count,
      timestamp: startTimestamp,
      volume,
      low:priceLow,
      high:priceHigh,
      open:priceStart,
      close:priceEnd
    }
  }`
  return gql(queryString)
}

export const POKEBEN_RANKING_LEVEL = (count = 20, skip) => {
  const queryString = ` query pokeBenNfts {
    pokebens: pokeBenNfts (    
      first: ${count},
      ${skip ? `, skip: ${skip}` : ``}
      orderBy: level, 
      orderDirection: desc
    ) {
      id,
      level
    }
  }`
  return gql(queryString)
}

export const POKEBEN_RANKING_POWER = (count = 20, skip) => {
  const queryString = ` query pokeBenNfts {
    pokebens: pokeBenNfts (    
      first: ${count},
      ${skip ? `, skip: ${skip}` : ``}
      orderBy: power, 
      orderDirection: desc
    ) {
      id,
      power
    }
  }`
  return gql(queryString)
}

export const SUBGRAPH_HEALTH = gql`
  query health {
    blocks:indexingStatusForCurrentVersion(subgraphName: "bentokenfinance/bch-blocks") {
      synced
      health
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
    dex:indexingStatusForCurrentVersion(subgraphName: "bentokenfinance/bch-exchange") {
      synced
      health
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
    pokeben:indexingStatusForCurrentVersion(subgraphName: "bentokenfinance/bch-pokeben") {
      synced
      health
      chains {
        chainHeadBlock {
          number
        }
        latestBlock {
          number
        }
      }
    }
  }
`

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
      tokens${block ? `(block: { number: ${block}})` : ``}{
        id
      }
    }`
  return gql(queryString)
}

export const ALL_PAIRS = (block) => {
  const queryString = ` query pairs {
    pairs(
     ${block ? `block: { number: ${block}}` : ``} 
     where: { reserveBCH_gt: 5, totalTransactions_gt: 10 }
     orderBy: reserveBCH
     orderDirection: desc) {
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

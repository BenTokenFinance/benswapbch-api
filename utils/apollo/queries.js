import gql from 'graphql-tag'

const FACTORY_ADDRESS = '0x8d973bAD782c1FFfd8FcC9d7579542BA7Dd0998D'
const BUNDLE_ID = '1'

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

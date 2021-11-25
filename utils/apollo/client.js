import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink  } from 'apollo-link-http'

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

export const ExchangeClient = new ApolloClient({
  link: createHttpLink({ uri: 'https://subgraphs.benswap.cash/subgraphs/name/bentokenfinance/bch-exchange', fetch: fetch }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export const BlockClient = new ApolloClient({
  link: createHttpLink({ uri: 'https://subgraphs.benswap.cash/subgraphs/name/bentokenfinance/bch-blocks', fetch: fetch }),
  cache: new InMemoryCache(),
})

export const GetClient = (url) => {
  return new ApolloClient({
    link: createHttpLink({ uri: url, fetch: fetch }),
    cache: new InMemoryCache(),
  })
}

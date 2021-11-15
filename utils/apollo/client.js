import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink  } from 'apollo-link-http'

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

export const Exchange = new ApolloClient({
  link: createHttpLink({ uri: 'https://subgraphs.benswap.cash/subgraphs/name/bentokenfinance/bch-exchange', fetch: fetch }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

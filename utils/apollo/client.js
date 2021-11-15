import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'
import { createHttpLink  } from 'apollo-link-http'

export const Exchange = new ApolloClient({
  link: createHttpLink({ uri: 'https://subgraphs.benswap.cash/subgraphs/name/bentokenfinance/bch-exchange', fetch: fetch }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

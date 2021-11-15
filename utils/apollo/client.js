import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const Exchange = new ApolloClient({
  link: new HttpLink({
    uri: 'https://subgraphs.benswap.cash/subgraphs/name/bentokenfinance/bch-exchange',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

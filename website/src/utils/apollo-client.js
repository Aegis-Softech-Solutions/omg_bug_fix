import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import withApollo from 'next-with-apollo';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import fetch from 'isomorphic-unfetch';
import { createUploadLink } from 'apollo-upload-client';
import { parseCookies } from 'nookies';
const apolloCache = new InMemoryCache();

// Update the GraphQL endpoint to any instance of GraphQL that you like
const GRAPHQL_URL = process.env.REACT_APP_HTTP_URL;

const uploadLink = createUploadLink({
  uri: GRAPHQL_URL, // Apollo Server is served from port 4000
  headers: {
    'keep-alive': 'true'
  },
  fetch
});

// const link = createHttpLink({
//   fetch, // Switches between unfetch & node-fetch for client & server.
//   uri: GRAPHQL_URL,
// });

const authLink = setContext((_, { headers }) => {
  const cookies = parseCookies();
  return cookies.token
    ? {
        headers: {
          ...headers,
          'x-token': cookies.token
        }
      }
    : {
        headers: {
          ...headers
        }
      };
});

// Export a HOC from next-with-apollo
// Docs: https://www.npmjs.com/package/next-with-apollo
export default withApollo(
  // You can get headers and ctx (context) from the callback params
  // e.g. ({ headers, ctx, initialState })
  ({ initialState }) =>
    new ApolloClient({
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only'
        },
        query: {
          fetchPolicy: 'network-only'
        }
      },
      link: authLink.concat(uploadLink),
      cache: new InMemoryCache()
        //  rehydrate the cache using the initial data passed from the server:
        .restore(initialState || {})
    })
);

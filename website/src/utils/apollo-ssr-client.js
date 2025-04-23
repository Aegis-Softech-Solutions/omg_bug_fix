import { useMemo } from "react";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "apollo-link-context";
import fetch from "isomorphic-unfetch";
let apolloClient;

// Update the GraphQL endpoint to any instance of GraphQL that you like
const GRAPHQL_URL = process.env.REACT_APP_HTTP_URL;

const uploadLink = createUploadLink({
  uri: GRAPHQL_URL,
  headers: {
    "keep-alive": "true",
  },
  fetch,
});

function createApolloClient(token) {
  const authLink = setContext((_, { headers }) => {
    return token
      ? {
          headers: {
            ...headers,
            "x-token": token,
          },
        }
      : {
          headers: {
            ...headers,
          },
        };
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink.concat(uploadLink),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(token, initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient(token);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}

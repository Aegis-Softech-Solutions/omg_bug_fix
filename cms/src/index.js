import React from "react";
import ReactDOM from "react-dom";

import NextApp from "./NextApp";
import registerServiceWorker from "./registerServiceWorker";
// Add this import:
import { AppContainer } from "react-hot-loader";

//Apollo Imports Begin
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { getMainDefinition } from "apollo-utilities";
import { ApolloLink, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
//Apollo Imports End

// Declaring constants for GraphQL
const httpLink = new createUploadLink({
  uri: process.env.REACT_APP_HTTP_URL
  // uri: "http://65.0.29.237:8001/graphql"
});

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_WEB_SOCKET_URL,
  options: {
    reconnect: true
  }
});

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "x-token": token
    }
  }));

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log("GraphQL error", message);

      if (message === "NOT_AUTHENTICATED") {
        //signOut(client);
        console.log("Not Authenticated");
      }
    });
  }

  if (networkError) {
    console.log("Network error", networkError);

    if (networkError.statusCode === 401) {
      //signOut(client);
      console.log("Not Authenticated");
    }
  }
});

const link = ApolloLink.from([authLink, errorLink, terminatingLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    watchQuery: { fetchPolicy: "network-only" },
    query: { fetchPolicy: "network-only" }
  }
});
// END-OF Declaring constants for GraphQL

// Wrap the rendering in a function:
const render = Component => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      {/* Wrap App inside AppContainer */}
      <AppContainer>
        <NextApp />
      </AppContainer>
    </ApolloProvider>,
    document.getElementById("root")
  );
};

// Do this once
registerServiceWorker();

// Render once
render(NextApp);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./NextApp", () => {
    render(NextApp);
  });
}

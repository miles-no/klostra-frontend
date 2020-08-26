import {ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri:
    //"http://klostra-backend.50109b3386884be38c0a.northeurope.aksapp.io/v1/graphql",
    "http://localhost:9001/v1/graphql",
    cache: new InMemoryCache()
});
export default client;

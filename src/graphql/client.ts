import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";

const client = new ApolloClient({
  uri:
    "http://klostra-backend.50109b3386884be38c0a.northeurope.aksapp.io/v1/graphql",
});

client
  .query({
    query: gql`
      {
        testing {
          test_id
          updated_at
          created_at
        }
      }
    `,
  })
  .then((result) => console.log(result));

export default client;

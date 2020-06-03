import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:8080/v1/graphql",
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

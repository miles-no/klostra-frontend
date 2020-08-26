import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";

const client = new ApolloClient({
  uri:
    //"http://klostra-backend.50109b3386884be38c0a.northeurope.aksapp.io/v1/graphql",
    "http://localhost:9001/v1/graphql",
});



client
  .query({
    query: gql`
    {
      dataset {
        id
      }
      kommune(where: {id: {_in: [101, 104]}}) {
        kommune_nr
        id
        navn
      }
      statistikkvariabel(where: {id: {_eq: 1}}) {
        variabelnavn
        id
      }  
      verdi(where: {kommune_id: {_in: [101, 104]}, tid_id: {_in: [2015, 2016, 2017, 2018, 2019]}, variabel_id: {_eq: 1}, verdi: {}}) {
        kommune_id
        tid_id
        variabel_id
        verdi
      }
    }
    `,
  })
  .then((result) => console.log(result));

export default client;

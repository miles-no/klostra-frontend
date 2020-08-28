import ApolloClient from "apollo-boost";
import { gql } from "@apollo/client";
import { InMemoryCache } from "apollo-cache-inmemory";
import userSettings from "./userSettings.json";

const typeDefs = gql`
  type AppBarColorSetting {
    id: Int!
    name: String!
    setting: String!
  }
  type Query {
    appBarColorSetting: AppBarColorSetting!
  }
  type Mutation {
    updateAppBarColorSetting(setting: String!, name: String!): AppBarColorSetting!
  }
`;
const resolvers = {
  Query: {
    appBarColorSetting: () => userSettings.appBarColorSetting,
  },
  Mutation: {
    updateAppBarColorSetting: (_: any, { setting, name }: any) => {
      console.log(setting)
      userSettings.appBarColorSetting.setting = setting;
      userSettings.appBarColorSetting.name = name;
      return userSettings.appBarColorSetting;
    },
  },
};
const client = new ApolloClient({
  uri:
    //"http://klostra-backend.50109b3386884be38c0a.northeurope.aksapp.io/v1/graphql",
    "http://localhost:9001/v1/graphql",
  cache: new InMemoryCache({
    freezeResults: true,
  }),
  typeDefs,
  resolvers,
  assumeImmutableResults: true,
});
export default client;

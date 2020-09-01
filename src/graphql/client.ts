import ApolloClient from "apollo-boost";
import { gql } from "@apollo/client";
import { InMemoryCache } from "apollo-cache-inmemory";

const typeDefs = gql`
  type AppBarColorSetting {
    id: Int!
    name: String!
    setting: String!
  }
  type ActiveKommuner {
    kommuner: [int!]
  }
  type Query {
    appBarColorSetting: AppBarColorSetting!
    activeKommuner: ActiveKommuner!
  }
  type Mutation {
    updateAppBarColorSetting(
      setting: String!
      name: String!
    ): AppBarColorSetting!
    updateActiveKommuner(kommuner: [int!]): ActiveKommuner!
  }
`;
const resolvers = {
  /* Query: {
    appBarColorSetting: () => userSettings.appBarColorSetting,
  },*/
  Mutation: {
    updateAppBarColorSetting: (
      _: any,
      { setting, name }: any,
      { cache }: any
    ) => {
      // console.log(setting)
      // userSettings.appBarColorSetting.setting = setting;
      // userSettings.appBarColorSetting.name = name;
      let hold = {
        id: 1,
        name: name,
        setting: setting,
        __typename: "AppBarColorSetting",
      };
      cache.writeData({
        data: {
          appBarColorSetting: hold,
        },
      });
      return hold;
    },
    updateActiveKommuner: (_: any, { kommuner }: any, { cache }: any) => {
      // console.log(setting)
      // userSettings.appBarColorSetting.setting = setting;
      // userSettings.appBarColorSetting.name = name;
      let hold = {
        kommuner,
        __typename: "ActiveKommuner",
      };
      cache.writeData({
        data: {
          activeKommuner: hold,
        },
      });
      return hold;
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
  clientState: {
    defaults: {
      appBarColorSetting: {
        id: 1,
        name: "App Bar Color",
        setting: "primary",
        __typename: "AppBarColorSetting",
      },
      activeKommuner: {
        kommuner: [],
        __typename: "ActiveKommuner",
      },
    },
    resolvers: resolvers,
  },
  assumeImmutableResults: true,
});
export default client;

import { gql } from "@apollo/client";
export const GET_DATA = gql`
  {
    dataset {
      id
    }
    kommune(where: { id: { _in: [101, 104] } }) {
      kommune_nr
      id
      navn
    }
    statistikkvariabel(where: { id: { _eq: 1 } }) {
      variabelnavn
      id
    }
    verdi(
      where: {
        kommune_id: { _in: [101, 104] }
        tid_id: { _in: [2015, 2016, 2017, 2018, 2019] }
        variabel_id: { _eq: 1 }
        verdi: {}
      }
    ) {
      kommune_id
      tid_id
      variabel_id
      verdi
    }
  }
`;
export const GET_DATA_KOMMUNE = gql`
  query verdiList($kommuner: [Int!], $years: [Int!], $stat: Int!) {
    kommune(where: { id: { _in: $kommuner } }) {
      kommune_nr
      id
      navn
    }
    statistikkvariabel(where: { id: { _eq: $stat } }) {
      variabelnavn
      id
    }
    verdi(
      where: {
        kommune_id: { _in: $kommuner }
        tid_id: { _in: $years }
        variabel_id: { _eq: $stat }
        verdi: {}
      }
    ) {
      kommune_id
      tid_id
      variabel_id
      verdi
    }
  }
`;
export const GET_KOMMUNER = gql`
  {
    kommune {
      kommune_nr
      id
      navn
      kommune_datasets {
        dataset_id
      }
    }
  }
`;
export const GET_YEARS = gql`
  {
    tidsperiode {
      year
    }
  }
`;
export const GET_STAT_VARIABLE = gql`
  {
    statistikkvariabel {
      variabelnavn
      id
      enhet
      dataset_id
    }
  }
`;

export const APP_BAR_COLOR_SETTING_QUERY = gql`
  query appBarColorSetting {
    appBarColorSetting @client {
      id @client
      name @client
      setting @client
    }
  }
`;
export const ACTIVE_KOMMUNER_QUERY = gql`
  query activeKommuner {
    activeKommuner @client {
      kommuner @client
    }
  }
`;
export const ACTIVE_YEARS_QUERY = gql`
  query activeYears {
    activeYears @client {
      years @client
    }
  }
`;
export const ACTIVE_STAT_QUERY = gql`
  query activeStat {
    activeStat @client {
      stat @client
    }
  }
`;
export const UPDATE_APP_BAR_COLOR_SETTING_MUTATION = gql`
  mutation updateAppBarColorSetting($setting: String!, $name: String!) {
    updateAppBarColorSetting(setting: $setting, name: $name) @client
  }
`;
export const UPDATE_ACTIVE_KOMMUNER_MUTATION = gql`
  mutation updateActiveKommuner($kommuner: [int!]) {
    updateActiveKommuner(kommuner: $kommuner) @client
  }
`;
export const UPDATE_ACTIVE_YEARS_MUTATION = gql`
  mutation updateActiveYears($years: [int!]) {
    updateActiveYears(years: $years) @client
  }
`;
export const UPDATE_ACTIVE_STAT_MUTATION = gql`
  mutation updateActiveStat($stat: int!) {
    updateActiveStat(stat: $stat) @client
  }
`;

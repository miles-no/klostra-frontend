import React from "react";
import { useMutation } from "@apollo/react-hooks";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {
  GET_KOMMUNER,
  GET_YEARS,
  GET_STAT_VARIABLE,
  UPDATE_ACTIVE_KOMMUNER_MUTATION,
  UPDATE_ACTIVE_YEARS_MUTATION,
  UPDATE_ACTIVE_STAT_MUTATION,
  ACTIVE_KOMMUNER_QUERY,
  ACTIVE_YEARS_QUERY,
  ACTIVE_STAT_QUERY,
} from "../graphql/query";
import { useQuery } from "@apollo/react-hooks";
import { filterKommunerBasedOnDataset } from "../services/dataFormatter";
function Dropdown() {
  const [kommuner, setKommuner] = React.useState<any[]>([]);
  const [years, setYears] = React.useState<number[]>([]);
  const [stat, setStat] = React.useState<any>();
  //const [datasetId, setDatasetId] = React.useState<number>();
  const { loading, error, data } = useQuery(GET_KOMMUNER);
  const { loading: loadingStat, error: errorStat, data: dataStat } = useQuery(
    GET_STAT_VARIABLE
  );

  const { loading: loadingYear, error: errorYear, data: dataYear } = useQuery(
    GET_YEARS
  );
  const {
    loading: loadingActiveStat,
    error: errorActiveLocal,
    data: dataActiveStat,
  } = useQuery(ACTIVE_STAT_QUERY);

  const [updateActiveKommuner] = useMutation(UPDATE_ACTIVE_KOMMUNER_MUTATION, {
    update: (cache, mutation) => {
      const data: any = cache.readQuery({
        query: ACTIVE_KOMMUNER_QUERY,
      });
      const dataClone = {
        ...data,
        activeKommuner: {
          ...data.activeKommuner,
          ...mutation.data.updateActiveKommuner,
        },
      };

      cache.writeQuery({
        query: ACTIVE_KOMMUNER_QUERY,
        data: dataClone,
      });
    },
  });
  const [updateActiveYears] = useMutation(UPDATE_ACTIVE_YEARS_MUTATION, {
    update: (cache, mutation) => {
      const data: any = cache.readQuery({
        query: ACTIVE_YEARS_QUERY,
      });
      const dataClone = {
        ...data,
        activeYears: {
          ...data.activeYears,
          ...mutation.data.updateActiveYears,
        },
      };

      cache.writeQuery({
        query: ACTIVE_YEARS_QUERY,
        data: dataClone,
      });
    },
  });
  const [updateActiveStat] = useMutation(UPDATE_ACTIVE_STAT_MUTATION);
  if (loading || loadingYear || loadingStat) return <h2>Loading...</h2>;
  if (error || errorYear || errorStat) return <h2>Error</h2>;
  //setYears(dataYear.tidsperiode)
  function selectKommune(event: any) {
    setKommuner(event.target.value);
    let filterId = event.target.value.map((k: any) => k.id);
    updateActiveKommuner({ variables: { kommuner: filterId } });
  }
  function selectYear(event: any) {
    setYears(event.target.value);
    updateActiveYears({ variables: { years: event.target.value } });
  }
  function selectStat(event: any) {
    setStat(event.target.value);
    updateActiveStat({ variables: { stat: event.target.value.id } });
  }
  function filterKommuneNotInDataset() {
    let kommunerWithData = filterKommunerBasedOnDataset(
      kommuner,
      stat ? stat.dataset_id : undefined
    );
    let id = kommunerWithData.map((k: any) => k.id);
    return kommuner
      .filter((k: any) => !id.includes(k.id))
      .map((k: any) => k.navn);
  }
  return (
    <div style={{ marginTop: "50px" }}>
      <FormControl style={{ width: "10em" }}>
        <InputLabel id="demo-mutiple-name-label">Statistikkvariabel</InputLabel>
        <Select value={stat || []} onChange={selectStat}>
          {dataStat.statistikkvariabel.map((item: any) => (
            <MenuItem key={item.id} value={item}>
              {item.variabelnavn}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl style={{ width: "7em" }}>
        <InputLabel>Kommuner</InputLabel>
        <Select
          disabled={!dataActiveStat}
          multiple
          value={kommuner}
          onChange={selectKommune}
          input={<Input />}
          renderValue={(selected) => (
            <div>
              {(selected as string[]).map((item: any, index) => (
                <Chip key={index} label={item.navn} />
              ))}
            </div>
          )}
        >
          {data.kommune.map((kommune: any) => (
            <MenuItem key={kommune.id} value={kommune}>
              {kommune.navn}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl style={{ width: "15em" }}>
        <InputLabel>Tidsperiode</InputLabel>
        <Select
          disabled={!dataActiveStat}
          multiple
          value={years}
          onChange={selectYear}
          input={<Input />}
          renderValue={(selected) => (
            <div>
              {(selected as string[]).map((item: any, index) => (
                <Chip key={index} label={item} />
              ))}
            </div>
          )}
        >
          {dataYear.tidsperiode.map((item: any) => (
            <MenuItem key={item.year} value={item.year}>
              {item.year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {filterKommuneNotInDataset().length !== 0 ? (
        <p style={{ fontSize: "0.5em" }}>
          {filterKommuneNotInDataset().map((n: String, i: number) => {
            if (i === filterKommuneNotInDataset().length - 1) {
              return n + " ";
            }
            return n + ", ";
          })}
          har ikke verdi for denne statistikken
        </p>
      ) : undefined}
    </div>
  );
}

export default Dropdown;

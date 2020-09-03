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
  UPDATE_ACTIVE_KOMMUNER_MUTATION,
  UPDATE_ACTIVE_YEARS_MUTATION,
  ACTIVE_KOMMUNER_QUERY,
  ACTIVE_YEARS_QUERY,
} from "../graphql/query";
import { useQuery } from "@apollo/react-hooks";

function Dropdown() {
  const [kommuner, setKommuner] = React.useState<any[]>([]);
  const [years, setYears] = React.useState<number[]>([]);
  const { loading, error, data } = useQuery(GET_KOMMUNER);
  const { loading: loadingYear, error: errorYear, data: dataYear } = useQuery(
    GET_YEARS
  );

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
  if (loading || loadingYear) return <h2>Loading...</h2>;
  if (error || errorYear) return <h2>Error</h2>;
  //setYears(dataYear.tidsperiode)
  console.log(dataYear);
  function selectKommune(event: any) {
    console.log(event.target.value);
    setKommuner(event.target.value);
    let filterId = event.target.value.map((k: any) => k.id);
    console.log(years);
    updateActiveKommuner({ variables: { kommuner: filterId } });
  }
  function selectYear(event: any) {
    console.log(event.target.value);
    setYears(event.target.value);
    //let filterId = event.target.value.map((k: any) => k.id);
    updateActiveYears({ variables: { years: event.target.value } });
  }
  return (
    <div style={{ marginTop: "50px" }}>
      <FormControl style={{ width: "7em" }}>
        <InputLabel id="demo-mutiple-name-label">Kommuner</InputLabel>
        <Select
          multiple
          value={kommuner}
          onChange={selectKommune}
          input={<Input id="select-multiple-chip" />}
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
        <InputLabel id="demo-mutiple-name-label">Tidsperiode</InputLabel>
        <Select
          multiple
          value={years}
          onChange={selectYear}
          input={<Input id="select-multiple-chip" />}
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
    </div>
  );
}

export default Dropdown;

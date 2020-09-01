import React from "react";
import { useMutation } from "@apollo/react-hooks";

import {
  GET_KOMMUNE,
  UPDATE_ACTIVE_KOMMUNER_MUTATION,
  ACTIVE_KOMMUNER_QUERY,
} from "../graphql/query";
import { useQuery } from "@apollo/react-hooks";

function Dropdown() {
  const { loading, error, data } = useQuery(GET_KOMMUNE);
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
  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error</h2>;
  console.log(data);
  function selectKommune(event: any) {
    console.log(event.target.value);
    updateActiveKommuner({ variables: { kommuner: [event.target.value] } });
  }
  return (
    <div style={{ marginTop: "50px" }}>
      <select name="kommuner" onChange={selectKommune}>
        {data.kommune.map((i: any) => (
          <option value={i.id} key={i.id}>
            {i.navn}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;

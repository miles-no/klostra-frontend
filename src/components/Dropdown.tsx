import React from "react";
import { useMutation } from "@apollo/react-hooks";

import { GET_KOMMUNE } from "../graphql/query";
import { useQuery } from "@apollo/react-hooks";

function Dropdown() {
  const { loading, error, data } = useQuery(GET_KOMMUNE);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error</h2>;
  console.log(data);
  return (
    <div style={{ marginTop: "50px" }}>
      <select name="kommuner">
       {data.kommune.map((i: any, index: any)=>
       <option value={i.navn}>{i.navn}</option>
       )}
      </select>
    </div>
  );
}

export default Dropdown;

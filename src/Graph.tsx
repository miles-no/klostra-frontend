import React from "react";
import { gql, useQuery } from "@apollo/client";
import { TooltipContainerStyles } from "./constants/tooltip-container-styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const GET_DATA = gql`
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
const COLORS = [
  "#3066BE",
  "#20A39E",
  "#61D095",
  "#FFBA49",
  "#EF5B5B",
  "#A4036F",
];
const Graph = () => {
  const { loading, error, data } = useQuery(GET_DATA);

  let kommuner = {} as any;
  let newinput = [] as any;
  if (!loading && !error) {
    kommuner = data.kommune;
    const mapYears = data.verdi
      .map((val: any) => val.tid_id)
      .filter((a: any, b: any, c: any) => c.indexOf(a) === b);
    mapYears.forEach((year: String) => {
      let element = {} as any;
      data.verdi.forEach((v: any) => {
        if (v.tid_id === year) {
          element["kommune_id_" + v.kommune_id] = v.verdi;
        }
        //element["kommune_id"] = v.kommune_id;
      });
      //console.log(element)
      newinput.push({
        year: year,
        ...element,
      });
    });
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  console.log(data, kommuner);
  return (
    <div>
      <p style={{fontSize:"0.7em"}}>{data.statistikkvariabel[0].variabelnavn}</p>
      <LineChart
        width={500}
        height={300}
        data={newinput}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip contentStyle={TooltipContainerStyles} />
        <Legend />
        {kommuner.map((i: any, index: any) => (
          <Line
            type="monotone"
            dataKey={"kommune_id_" + i.id}
            name={i.navn}
            stroke={COLORS[index % COLORS.length]}
            key={i.kommune_id + index + i.navn}
          />
        ))}
      </LineChart>
    </div>
  );
};
export default Graph;

import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { TooltipContainerStyles } from "../constants/tooltip-container-styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { COLORS } from "../constants/colors";
import {
  APP_BAR_COLOR_SETTING_QUERY,
  GET_DATA,
  GET_DATA_KOMMUNE,
  ACTIVE_KOMMUNER_QUERY,
} from "../graphql/query";

const Graph = () => {
  const {
    loading: loadingKommuner,
    error: errorKommuner,
    data: dataKommuner,
  } = useQuery(ACTIVE_KOMMUNER_QUERY);
  console.log(dataKommuner);

  const { loading, error, data } = useQuery(GET_DATA_KOMMUNE, {
    variables: { kommuner: dataKommuner.activeKommuner.kommuner },
  });
  const { loading: loadingtest, data: test } = useQuery(
    APP_BAR_COLOR_SETTING_QUERY
  );
  console.log(test)
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
      });
      newinput.push({
        year: year,
        ...element,
      });
    });
  }
  if (dataKommuner.activeKommuner.kommuner.length === 0) {
    return null;
  }
  if (loading || loadingKommuner || loadingtest) return <div>Loading...</div>;
  if (error || errorKommuner) return <div>Error</div>;
  return (
    <div>
      {test.appBarColorSetting.setting}
      {test.appBarColorSetting.name}
      <p style={{ fontSize: "0.7em" }}>
        {data.statistikkvariabel[0].variabelnavn}
      </p>
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

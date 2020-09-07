import React, { useRef } from "react";
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
  ACTIVE_YEARS_QUERY,
  ACTIVE_STAT_QUERY,
  GET_YEARS,
} from "../graphql/query";
import { useReactToPrint } from "react-to-print";
import Button from "@material-ui/core/Button";
import { formatter } from "../services/dataFormatter";

const GraphView = () => {
  const {
    loading: loadingKommuner,
    error: errorKommuner,
    data: dataKommuner,
  } = useQuery(ACTIVE_KOMMUNER_QUERY);
  const {
    loading: loadingYears,
    error: errorYears,
    data: dataYears,
  } = useQuery(ACTIVE_YEARS_QUERY);
  const { loading: loadingStat, error: errorStat, data: dataStat } = useQuery(
    ACTIVE_STAT_QUERY
  );
  console.log(dataKommuner.activeKommuner.kommuner);
  console.log(dataYears.activeYears.years);
  const { loading, error, data } = useQuery(GET_DATA_KOMMUNE, {
    variables: {
      kommuner: dataKommuner.activeKommuner.kommuner,
      years: dataYears.activeYears.years,
      stat: dataStat ? dataStat.activeStat.stat : [],
    },
  });
  const { loading: loadingtest, data: test } = useQuery(
    APP_BAR_COLOR_SETTING_QUERY
  );
  //PRINTING
  const componentRef = useRef(null);
  const onBeforeGetContentResolve = React.useRef(Promise.resolve);

  const [loadingDownloading, setLoadingDownloading] = React.useState(false);
  const [text, setText] = React.useState("old boring text");

  const handleAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called"); // tslint:disable-line no-console
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
    setLoadingDownloading(true);
    setText("Loading new text...");

    return new Promise((resolve: any) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoadingDownloading(false);
        setText("New, Updated Text!");
        resolve();
      }, 2000);
    });
  }, [setLoadingDownloading, setText]);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Graph",
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });
  if (
    dataKommuner.activeKommuner.kommuner.length === 0 ||
    dataYears.activeYears.years.length === 0
  ) {
    if (dataKommuner.activeKommuner.kommuner.length !== 0) {
      return <div>Velg tidsperiode(r).</div>;
    }
    if (dataYears.activeYears.years.length !== 0) {
      return <div>Velg kommune(r).</div>;
    }
    return null;
  }
  if (loading || loadingKommuner) return <div>Loading...</div>;
  if (error || errorKommuner) return <div>Error</div>;
  console.log(data.kommune);
  return (
    <div>
      <div ref={componentRef}>
        {/*test.appBarColorSetting.setting*/}
        {/*test.appBarColorSetting.name*/}
        <p style={{ fontSize: "0.7em" }}>
          {data.statistikkvariabel[0].variabelnavn}
        </p>
        <LineChart
          width={700}
          height={700}
          data={formatter(data.verdi)}
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
          {data.kommune.map((i: any, index: any) => (
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
      <Button onClick={handlePrint} variant="contained" color="primary">
        Download graph
      </Button>
    </div>
  );
};
export default GraphView;

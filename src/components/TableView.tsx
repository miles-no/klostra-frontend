import React, { useRef } from "react";
import { useQuery } from "@apollo/react-hooks";
import {
  APP_BAR_COLOR_SETTING_QUERY,
  GET_DATA,
  GET_DATA_KOMMUNE,
  ACTIVE_KOMMUNER_QUERY,
  ACTIVE_YEARS_QUERY,
  GET_YEARS,
} from "../graphql/query";
import Button from "@material-ui/core/Button";
import { formatter, getYears } from "../services/dataFormatter";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {exportToCSV} from "../services/export";
const TableView = () => {
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
  console.log(dataYears);
  const { loading, error, data } = useQuery(GET_DATA_KOMMUNE, {
    variables: {
      kommuner: dataKommuner.activeKommuner.kommuner,
      years: dataYears.activeYears.years,
    },
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
  let years = getYears(data.verdi);


  console.log(formatter(data.verdi));
  console.log(data);
  return (
    <div>
      <p style={{ fontSize: "0.7em" }}>
        {data.statistikkvariabel[0].variabelnavn}
      </p>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Kommune</TableCell>
              {years.map((y: any) => (
                <TableCell align="right">{y}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.kommune
              .filter((k: any) =>
                dataKommuner.activeKommuner.kommuner.includes(k.id)
              )
              .map((k: any) => {
                let values = [] as any;
                formatter(data.verdi).forEach((verdi: any) => {
                  if (verdi["kommune_id_" + k.id]) {
                    values.push(verdi["kommune_id_" + k.id]);
                  }
                });
                return (
                  <TableRow key={k.navn}>
                    <TableCell component="th" scope="row">
                      {k.navn}
                    </TableCell>
                    {values.map((numbers: any) => (
                      <TableCell align="right">{numbers}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={()=>exportToCSV(data.verdi,data.statistikkvariabel[0].variabelnavn)} variant="contained" color="primary">
        download xlsx file
      </Button>
    </div>
  );
};
export default TableView;

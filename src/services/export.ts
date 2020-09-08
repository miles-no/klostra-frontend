import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

export const exportToCSV = (csvData: any, fileName: any, csvOrXsls: String) => {
  console.log(fileName);
  let fileExtension = csvOrXsls === "csv" ? ".csv" : ".xlsx";
  const ws = XLSX.utils.json_to_sheet(csvData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, {
    bookType: csvOrXsls === "csv" ? "csv" : "xlsx",
    type: "array",
  });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};
//todo check if we can do this in csv

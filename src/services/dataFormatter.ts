export const formatter = (inputData: any) => {
  let newinput = [] as any;
  const mapYears = inputData
    .map((val: any) => val.tid_id)
    .filter((a: any, b: any, c: any) => c.indexOf(a) === b);
  mapYears.forEach((year: String) => {
    let element = {} as any;
    inputData.forEach((v: any) => {
      if (v.tid_id === year) {
        element["kommune_id_" + v.kommune_id] = v.verdi;
      }
    });
    newinput.push({
      year: year,
      ...element,
    });
  });
  return newinput;
};
export const getYears = (inputData: any) => {
  return inputData
    .map((val: any) => val.tid_id)
    .filter((a: any, b: any, c: any) => c.indexOf(a) === b);
};
export const filterKommunerBasedOnDataset = (
  kommune: any,
  datasetId: number
) => {
  let newArray = kommune.filter(
    (k: any) =>
      k.kommune_datasets.filter((d: any) => {
        console.log(d.dataset_id, datasetId);
        return d.dataset_id === datasetId;
      }).length !== 0
  );
  return newArray;
};

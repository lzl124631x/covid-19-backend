import express from "express";
import csv from "csv-parse";
import fs from "fs";
import cors from "cors";
import { mapOwn } from "./util";
import { Entry, MapDataEntry, MapData } from "./type";
import {
  TimeSeriesData,
  ContactData,
} from "./payloads/timeseries-data";

let db: { [key: string]: Entry[] } = {};
const csvFiles = [
  {
    key: "data100",
    file: "bed_nointervention.csv",
  },
  {
    key: "data75",
    file: "bed_75contact.csv",
  },
  {
    key: "data50",
    file: "bed_50contact.csv",
  },
];

csvFiles.forEach((item) =>
  csv(
    fs.readFileSync(`./csv/${item.file}`),
    { columns: true },
    (err, output) => {
      db[item.key] = output;
    }
  )
);

const app = express();
app.use(cors());
const HTTP_PORT = 6789;

app.get("/", (req, res) => {
  res.send("Express is up!");
});

app.get("/dates", (req, res) => {
  let m: { [key: string]: number } = {};
  db[csvFiles[0].key].forEach((row) => (m[row.Date] = 1));
  const dates = Object.keys(m);
  res.send(dates);
});

app.get("/map", (req, res) => {
  let mapByDate: { [key: string]: Entry[] } = {};
  const field: string = req.query.field;
  db[`data${req.query.contact}`].forEach((row) => {
    if (!(row.Date in mapByDate)) mapByDate[row.Date] = [];
    mapByDate[row.Date].push(row);
  });
  const data: MapDataEntry[] = mapOwn(mapByDate, (entries, date) => {
    let mapByState: { [key: string]: number } = {};
    entries.forEach((entry) => {
      const parts = entry.county.split(" ");
      const state = `us-${parts[parts.length - 1].toLocaleLowerCase()}`;
      if (!(state in mapByState)) mapByState[state] = 0;
      mapByState[state] += +entry[field];
    });
    return [date, mapOwn(mapByState, (val, state) => [state, val])];
  });
  let maxValue = 0;
  data.forEach((entry) =>
    entry[1].forEach((state) => (maxValue = Math.max(maxValue, state[1])))
  );
  res.send({
    data,
    maxValue,
  } as MapData);
});

app.get("/timeseries-data", (req, res) => {
  const contacts = Object.keys(db);
  const stateCode = req.query.stateCode;
  const type: string = req.query.type;
  const percentiles = ["2.5", "25", "50", "75", "97.5"];

  const rowsGroupedByDate: Map<number, Entry[]> = new Map<number, Entry[]>();
  const getContactData = (): ContactData[] =>
    contacts.map((contact) => {
      let dataToProcess = db[contact];
      if (stateCode != null) {
        dataToProcess = dataToProcess.filter((row) =>
          row.county.endsWith(stateCode)
        );
      }
      const populateRowsGroupByDate = () =>
        dataToProcess.forEach((row) => {
          const timestamp = new Date(row.Date).getTime();
          if (rowsGroupedByDate.has(timestamp)) {
            const _toAppend = rowsGroupedByDate.get(timestamp);
            _toAppend.push(row);
            rowsGroupedByDate.set(timestamp, _toAppend);
          } else {
            rowsGroupedByDate.set(timestamp, [row]);
          }
        });

      populateRowsGroupByDate();
      const aggregate = (percentile: string): number[] =>
        Array.from(rowsGroupedByDate.values()).map((rows) =>
          rows
            .map((_) => parseInt(_[`${type}_${percentile}`]))
            .reduce((a, b) => a + b)
        );
      return {
        contact,
        percentileData: percentiles.map((percentile) => {
          return { percentile, data: aggregate(percentile) };
        }),
      };
    });
  const contactData = getContactData();
  let maxValue = 0;
  contactData.forEach((cd) =>
    cd.percentileData.forEach((pd) =>
      pd.data.forEach((v) => {
        if (v > maxValue) maxValue = v;
      })
    )
  );
  const timeSeriesData: TimeSeriesData = {
    contactData,
    stateCode,
    timeSeries: Array.from(rowsGroupedByDate.keys()),
    type,
    maxValue,
  };

  res.send(timeSeriesData);
});

app.listen(HTTP_PORT, () => {
  console.log(`Express HTTP server listening on port ${HTTP_PORT}`);
});

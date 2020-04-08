import express from "express";
import csv from "csv-parse";
import fs from "fs";
import path from "path";
import cors from "cors";
import { mapMap } from "./util";
import { Entry, MapDataEntry, MapData } from "./type";
import { TimeSeriesData, ContactData } from "./payloads/timeseries-data";

let db: { [key: string]: Entry[] } = {};

const csvFilenames = fs
  .readdirSync("csv")
  .filter((name) => path.extname(name).toLocaleLowerCase() === ".csv");

function getFileKey(name: string): string {
  return name
    .replace("bed_", "")
    .replace(".csv", "")
    .replace("contact", "")
    .replace("nointerv", "100");
}

const csvFiles = csvFilenames.map((name) => ({
  key: getFileKey(name),
  file: name,
}));

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

app.get("/contacts", (req, res) => {
  res.send(csvFiles.map((x) => x.key));
});

app.get("/dates", (req, res) => {
  let m = new Set<string>();
  db[csvFiles[0].key].forEach((row) => m.add(row.Date));
  const dates = Array.from(m);
  res.send(dates);
});

app.get("/map", (req, res) => {
  let mapByDate = new Map<string, Entry[]>();
  const field: string = req.query.field;
  db[req.query.contact].forEach((row) => {
    if (!mapByDate.has(row.Date)) mapByDate.set(row.Date, []);
    mapByDate.get(row.Date).push(row);
  });
  const data: MapDataEntry[] = mapMap(mapByDate, (entries, date) => {
    let mapByState = new Map<string, number>();
    entries.forEach((entry) => {
      const parts = entry.county.split(" ");
      const state = `us-${parts[parts.length - 1].toLocaleLowerCase()}`;
      if (!mapByState.has(state)) mapByState.set(state, 0);
      mapByState.set(state, mapByState.get(state) + +entry[field]);
    });
    return [date, mapMap(mapByState, (val, state) => [state, val])];
  });
  const maxValue = data.reduce(
    (mx, entry) =>
      Math.max(
        mx,
        entry[1].reduce((mx, state) => Math.max(mx, state[1]), 0)
      ),
    0
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

import express from "express";
import csv from "csv-parse";
import fs from "fs";
import cors from "cors";

import { mapOwn, toSeries, toRangeTimeSeriesData } from "./util";
import { StackedChartData } from "./payloads/stackedchart";
import { Entry, MapDataEntry, MapData } from "./type";
import { PERCENTILE_GROUPS } from "./chart-configuration/stackedchart-configuration";
import { RANGEDATA_GROUPS_CONFIGURATION } from "./chart-configuration/range-timeseries-data-configuration";

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

app.get("/range-timeseries-data", (req, res) => {
  let keys: string[] = Object.keys(db);
  const dataForAllInterventions = keys.map((key) => {
    let dataToProcess = db[key];
    const rowsGroupedByDate: Map<number, Entry[]> = new Map<number, Entry[]>();
    const stateCode: string = req.query.stateCode;
    if (stateCode != null) {
      dataToProcess = dataToProcess.filter((row) =>
        row.county.endsWith(stateCode)
      );
    }

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

    return RANGEDATA_GROUPS_CONFIGURATION.map((config) =>
      toRangeTimeSeriesData(key, config, rowsGroupedByDate)
    );
  });

  const response = dataForAllInterventions.reduce((d1, d2) => d1.concat(d2));
  res.send(response.filter((_) => _.type == req.query.type));
});

app.get("/stacked-chart", (req, res) => {
  const rowsGroupedByDate: Map<string, Entry[]> = new Map<string, Entry[]>();
  const stateCode: string = req.query.stateCode;
  let dataToProcess = db[`data${req.query.contact}`];
  if (stateCode != null) {
    dataToProcess = db[`data${req.query.contact}`].filter((row) =>
      row.county.endsWith(stateCode)
    );
  }
  dataToProcess.forEach((row) => {
    if (rowsGroupedByDate.has(row.Date)) {
      const _toAppend = rowsGroupedByDate.get(row.Date);
      _toAppend.push(row);
      rowsGroupedByDate.set(row.Date, _toAppend);
    } else {
      rowsGroupedByDate.set(row.Date, [row]);
    }
  });

  const allCharts: any[] = PERCENTILE_GROUPS.map((group) => {
    const stackedChart: StackedChartData = {
      xAxisData: Array.from(rowsGroupedByDate.keys()),
      title: group.title,
      xAxisLabel: group.xAxisLabel,
      yAxisLabel: group.yAxisLabel,
      charts: toSeries(group.charts, rowsGroupedByDate),
    };
    return { ...stackedChart, type: group.type };
  });
  const response = allCharts.filter((chart) => chart.type == req.query.type);
  res.send(response);
});

app.listen(HTTP_PORT, () => {
  console.log(`Express HTTP server listening on port ${HTTP_PORT}`);
});

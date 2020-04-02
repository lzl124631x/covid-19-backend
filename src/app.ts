import express from "express";
import csv from "csv-parse";
import fs from "fs";
import cors from "cors";

import { mapOwn, toSeries } from "./util";
import { StackedChartData } from "./models/stackedchart";
import { Entry, MapDataEntry, MapData } from "./type";
import { PERCENTILEGROUPS } from "./chartconfiguration/stackedchartconfiguration";

let db: { [key: string]: Entry[] } = {};
const csvFiles = [
  {
    key: "data50",
    file: "bed_50contact.csv",
  },
  {
    key: "data75",
    file: "bed_75contact.csv",
  },
  {
    key: "data100",
    file: "bed_nointervention.csv",
  },
];

csvFiles.forEach(item =>
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
  db[csvFiles[0].key].forEach(row => (m[row.Date] = 1));
  const dates = Object.keys(m);
  res.send(dates);
});

app.get("/map", (req, res) => {
  let mapByDate: { [key: string]: Entry[] } = {};
  const field: string = req.query.field;
  db[`data${req.query.contact}`].forEach(row => {
    if (!(row.Date in mapByDate)) mapByDate[row.Date] = [];
    mapByDate[row.Date].push(row);
  });
  const data: MapDataEntry[] = mapOwn(mapByDate, (entries, date) => {
    let mapByState: { [key: string]: number } = {};
    entries.forEach(entry => {
      const parts = entry.county.split(" ");
      const state = `us-${parts[parts.length - 1].toLocaleLowerCase()}`;
      if (!(state in mapByState)) mapByState[state] = 0;
      mapByState[state] += +entry[field];
    });
    return [date, mapOwn(mapByState, (val, state) => [state, val])];
  });
  let maxValue = 0;
  data.forEach(entry =>
    entry[1].forEach(state => (maxValue = Math.max(maxValue, state[1])))
  );
  res.send({
    data,
    maxValue,
  } as MapData);
});

app.get("/stackedchart", (req, res) => {
  const rowsGroupedByDate: Map<string, Entry[]> = new Map<string, Entry[]>();
  db[`data${req.query.contact}`].forEach(row => {
    if (rowsGroupedByDate.has(row.Date)) {
      const _toAppend = rowsGroupedByDate.get(row.Date)
      _toAppend.push(row);
      rowsGroupedByDate.set(row.Date, _toAppend);
    } else {
      rowsGroupedByDate.set(row.Date, [row]);
    }
  })

  const allCharts: any[] = PERCENTILEGROUPS.map(group => {
    const stackedChart: StackedChartData = {
      xAxisData: Array.from(rowsGroupedByDate.keys()),
      title: group.title,
      xAxisLabel: group.xAxisLabel,
      yAxisLabel: group.yAxisLabel,
      charts: toSeries(group.charts, rowsGroupedByDate)
    }
    return {...stackedChart, type: group.type};
  })
  const response = allCharts.filter(chart => chart.resourceType == req.query.resourceType);
  res.send(response);
})

app.listen(HTTP_PORT, () => {
  console.log(`Express HTTP server listening on port ${HTTP_PORT}`);
});
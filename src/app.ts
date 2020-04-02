import express from "express";
import csv from "csv-parse";
import fs from "fs";
import cors from "cors";
import { Entry, PERCENTILEGROUPS } from "./type";
import { mapOwn, ToSeries } from "./util";
import { IStackedChart } from "./stackedchart/IStackedChart";

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
  let m: { [key: string]: number } = {};
  const field: string = req.query.field;
  db[`data${req.query.contact}`]
    .filter(row => row.Date === req.query.date)
    .forEach(row => {
      const parts = row.county.split(" ");
      const state = `us-${parts[parts.length - 1].toLocaleLowerCase()}`;
      if (!(state in m)) m[state] = 0;
      m[state] += +row[field];
    });

  res.send(mapOwn(m, (val, key) => [key, val]));
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

  const allCharts: any[] = [];
  PERCENTILEGROUPS.forEach(group => {
    const stackedChart: IStackedChart = {
      categories: Array.from(rowsGroupedByDate.keys()),
      title: group.title,
      xAxisLabel: group.xAxisLabel,
      yAxisLabel: group.yAxisLabel,
      series: ToSeries(group.charts, rowsGroupedByDate)
    }
    allCharts.push({...stackedChart, resourceType: group.resourceType});
  })
  const response = allCharts.filter(chart => chart.resourceType == req.query.resourceType);
  res.send(response);
})

app.listen(HTTP_PORT, () => {
  console.log(`Express HTTP server listening on port ${HTTP_PORT}`);
});
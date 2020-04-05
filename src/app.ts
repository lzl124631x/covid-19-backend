import express from "express";
import csv from "csv-parse";
import fs from "fs";
import cors from "cors";

import { mapOwn, toSeries } from "./util";
import { StackedChartData } from "./models/stackedchart";
import { Entry, MapDataEntry, MapData } from "./type";
import { PERCENTILE_GROUPS } from "./chart-configuration/stackedchart-configuration";
import { RANGEDATA_GROUPS_CONFIGURATION } from "./chart-configuration/range-data-configuration";
import {
  ChartingMetadata,
  RangeData,
  RangeDefinition,
} from "./models/range-data";
import moment from "moment";

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
  let dataToProcess = db[`data${req.query.contact}`];
  const rowsGroupedByDate: Map<number, Entry[]> = new Map<number, Entry[]>();
  const stateCode: string = req.query.stateCode;
  if (stateCode != null) {
    dataToProcess = db[`data${req.query.contact}`].filter((row) =>
      row.county.endsWith(stateCode)
    );
  }

  dataToProcess.forEach((row) => {
    const timestamp = moment(row.Date, "MM/DD/YYYY").unix() * 1000;
    if (rowsGroupedByDate.has(timestamp)) {
      const _toAppend = rowsGroupedByDate.get(timestamp);
      _toAppend.push(row);
      rowsGroupedByDate.set(timestamp, _toAppend);
    } else {
      rowsGroupedByDate.set(timestamp, [row]);
    }
  });

  const allData = RANGEDATA_GROUPS_CONFIGURATION.map((config) => {
    const chartingMetadata: ChartingMetadata = {
      title: config.chartingMetadata.title,
      xAxisLabel: config.chartingMetadata.xAxisLabel,
      yAxisLabel: config.chartingMetadata.yAxisLabel,
    };
    const timeSeries: number[] = [...rowsGroupedByDate.keys()];

    const output: RangeDefinition[] = [];
    config.ranges.forEach((rangeConfig) => {
      const rangeDefintion: RangeDefinition = {
        lower: {
          id: rangeConfig.lower.id,
          value: [],
        },
        upper: {
          id: rangeConfig.upper.id,
          value: [],
        },
        average: {
          id: rangeConfig.average != null ? rangeConfig.average.id : null,
          value: [],
        },
      };
      const lowerColumn = rangeConfig.lower.columnName;
      const upperColumn = rangeConfig.upper.columnName;
      const averagecolumn =
        rangeConfig.average != null ? rangeConfig.average.columnName : null;

      rangeDefintion.lower.value = Array.from(rowsGroupedByDate.values()).map(
        (rows) => {
          return (
            rows.map((_) => parseInt(_[lowerColumn])).reduce((a, b) => a + b)
            
          );
        }
      );
      if (averagecolumn) {
        rangeDefintion.average.value = Array.from(
          rowsGroupedByDate.values()
        ).map((rows) => {
          return (
            rows
              .map((_) => parseInt(_[averagecolumn]))
              .reduce((a, b) => a + b)
          );
        });
      }
      rangeDefintion.upper.value = Array.from(rowsGroupedByDate.values()).map(
        (rows) => {
          return (
            rows.map((_) => parseInt(_[upperColumn])).reduce((a, b) => a + b)
          );
        }
      );
      output.push(rangeDefintion);
    });
    const rangeData: RangeData = {
      chartingMetadata,
      timeSeries,
      data: output,
    };

    return { ...rangeData, type: config.type };
  });

  res.send(allData.filter((_) => _.type == req.query.type));
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

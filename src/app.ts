import express from "express";
import csv from "csv-parse";
import fs from "fs";
import cors from "cors";
import { Entry } from "./type";
import { mapOwn } from "./util";

let db: { [key: string]: Entry[] } = {};
[
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
].forEach(item =>
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
const HTTP_PORT = 8080;

app.get("/", (req, res) => {
  res.send("Express is up!");
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

app.listen(HTTP_PORT, () => {
  console.log(`Express HTTP server listening on port ${HTTP_PORT}`);
});

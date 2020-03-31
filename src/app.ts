import express from "express";
import csv from "csv-parse";
import fs from "fs";
import cors from "cors";
import { Entry } from "./type";
import { mapOwn } from "./util";

let data: Entry[];
csv(
  fs.readFileSync("./csv/bed_50contact.csv"),
  { columns: true },
  (err, output) => {
    data = output;
  }
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
  data
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

import express from "express";
import csv from "csv-parse";
import fs from "fs";
import cors from "cors";

csv(
  fs.readFileSync("./csv/bed_50contact.csv"),
  { columns: true },
  (err, output) => {
    console.log(output[1]);
  }
);

var data = [
  ["us-ma", 0],
  ["us-wa", 1],
  ["us-ca", 2],
  ["us-or", 3],
  ["us-wi", 4],
  ["us-me", 5],
  ["us-mi", 6],
  ["us-nv", 7],
  ["us-nm", 8],
  ["us-co", 9],
  ["us-wy", 10],
  ["us-ks", 11],
  ["us-ne", 12],
  ["us-ok", 13],
  ["us-mo", 14],
  ["us-il", 15],
  ["us-in", 16],
  ["us-vt", 17],
  ["us-ar", 18],
  ["us-tx", 19],
  ["us-ri", 20],
  ["us-al", 21],
  ["us-ms", 22],
  ["us-nc", 23],
  ["us-va", 24],
  ["us-ia", 25],
  ["us-md", 26],
  ["us-de", 27],
  ["us-pa", 28],
  ["us-nj", 29],
  ["us-ny", 30],
  ["us-id", 31],
  ["us-sd", 32],
  ["us-ct", 33],
  ["us-nh", 34],
  ["us-ky", 35],
  ["us-oh", 36],
  ["us-tn", 37],
  ["us-wv", 38],
  ["us-dc", 39],
  ["us-la", 40],
  ["us-fl", 41],
  ["us-ga", 42],
  ["us-sc", 43],
  ["us-mn", 44],
  ["us-mt", 45],
  ["us-nd", 46],
  ["us-az", 47],
  ["us-ut", 48],
];
const app = express();
app.use(cors());
const HTTP_PORT = 8080;

app.get("/", (req, res) => {
  res.send("Express is up!");
});

app.get("/map", (req, res) => {
  res.send(data);
});

app.listen(HTTP_PORT, () => {
  console.log(`Express HTTP server listening on port ${HTTP_PORT}`);
});

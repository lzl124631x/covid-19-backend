import express from "express";
import csv from "csv-parse";
import fs from "fs";

csv(
  fs.readFileSync("./csv/bed_50contact.csv"),
  { columns: true },
  (err, output) => {
    console.log(output[1]);
  }
);

const app = express();

const HTTP_PORT = 8080;

app.get("/", function(req, res) {
  res.send("Express is up!");
});

app.listen(HTTP_PORT, () => {
  console.log(`Express HTTP server listening on port ${HTTP_PORT}`);
});

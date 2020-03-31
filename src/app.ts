import express from "express";

const app = express();

const HTTP_PORT = 8080;

app.get("/", function(req, res) {
  res.send("Express is up!");
});

app.listen(HTTP_PORT, () => {
  console.log(`Express HTTP server listening on port ${HTTP_PORT}`);
});

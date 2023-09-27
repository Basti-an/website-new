const express = require("express");
const app = express();
const path = require("path");
const https = require("https");
const fs = require("fs");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    return res.send(200);
  } else {
    return next();
  }
});

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT + 1, () => console.log(`backend started on port ${PORT}!`));

var privateKey = fs.readFileSync("/Users/phnx/localhost-key.pem");
var certificate = fs.readFileSync("/Users/phnx/localhost.pem");

https
  .createServer(
    {
      key: privateKey,
      cert: certificate,
    },
    app
  )
  .listen(PORT);

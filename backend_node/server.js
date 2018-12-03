const express = require("express");
const app = express();
const path = require("path");

app.use(function(req, res, next) {
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

app.get("*", function(req, res) {
  res.status(404).send("Not found");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`backend started on port ${PORT}!`));

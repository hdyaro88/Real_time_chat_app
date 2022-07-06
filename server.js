const express = require("express");
const dotenv = require("dotenv");
const app = require("./app");
var cors = require("cors");
const path = require("path");
const http = require("http");
dotenv.config({ path: "./config.env" });
app.use(cors());
const socket = require("./socket-server");
const port = process.env.PORT || 8080;
require('events').EventEmitter.prototype._maxListeners = 100;
if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));
  // Handle React routing, return all requests to React app

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
console.log(path.join(__dirname, "client/build", "index.html"));
const server = http.createServer(app);
socket.registerSocket(server);
server.listen(port, () => {
  console.log("Server is listening on port :", port);
});

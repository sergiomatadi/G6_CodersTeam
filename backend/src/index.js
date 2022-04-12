const { createServer } = require("http");
const users = require("./controllers/users"); // MODULO DE USERS
const salas = require("./controllers/sala"); // MODULE SALAS

// Express

const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const PORT = 3001;

const requestListener = (req, res) => {
  const { url } = req;

  if (url.includes("users")) {
    users(req, res);
  } else if (url.includes("salas")) {
    salas(req, res);
  } else {
    statusCode = 404;
    res.end("Not found");
  }
};

const server = createServer(requestListener);

server.listen(PORT, () => {
  console.log("Corriendo en puerto", PORT);
});

/* const { createServer } = require("http"); */
const users = require("./controllers/users"); // MODULO DE USERS
const salas = require("./controllers/sala"); // MODULE SALAS

// Express

const express = require("express");
const path = require("path");
const app = express();
const PORT = 5000;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/html/", "home.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/src/html/", "register.html")
  );
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/html/", "login.html"));
});

/* const requestListener = (req, res) => {
  const { url } = req;

  if (url.includes("users")) {
    users(req, res);
  } else if (url.includes("salas")) {
    salas(req, res);
  } else {
    statusCode = 404;
    res.end("Not found");
  }
}; */

// const server = createServer(requestListener);

app.listen(PORT, () => {
  console.log("Corriendo en puerto", PORT);
});

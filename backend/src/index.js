/* const { createServer } = require("http"); */
const users = require("./controllers/users"); // MODULO DE USERS
const salas = require("./controllers/sala"); // MODULE SALAS

// Express

const express = require("express");
const path = require("path");
const app = express();
const PORT = 3001;

// Para poder usar los CSS y JS e imagenes incrustados en el HTML
app.use(express.static(path.join((__dirname, "../frontend/src/"))));
app.use(express.json());
app.use("/users", users);

app.set("views", path.join((__dirname, "../frontend/src/html")));
app.set("view engine", "pug");

// Ruta principal de nuestra aplicacion
app.get("/", (req, res) => {
  res.render("home");
  //res.sendFile(path.join(__dirname, "../../frontend/src/html/", "home.pug"));
});

// Ruta vista del formulario registro
app.get("/register", (req, res) => {
  res.render("register");
  //res.sendFile(
  //  path.join(__dirname, "../../frontend/src/html/", "register.html")
  //);
});

// Ruta vista del formulario login
app.get("/login", (req, res) => {
  res.render("login");
  // res.sendFile(path.join(__dirname, "../../frontend/src/html/", "login.html"));
});

app.get("/salas", (req, res) => {
  res.render("salas");
  // res.sendFile(path.join(__dirname, "../../frontend/src/html/", "salas.html"));
});

app.get("/juego", (req, res) => {
  res.render("juego");
  // res.sendFile(path.join(__dirname, "../../frontend/src/html/", "juego.html"));
});

app.get("/avatar", (req, res) => {
  res.render("avatar");
  // res.sendFile(path.join(__dirname, "../../frontend/src/html/", "avatar.html"));
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
  console.log("Corriendo en puerto", `http://localhost:${PORT}`);
});

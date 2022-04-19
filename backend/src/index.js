const users = require("./controllers/users"); // MODULO DE USERS
const salas = require("./controllers/sala"); // MODULE SALAS
const sockets = require("./controllers/sockets"); // MODULO SOCKET
// Express
const express = require("express");
const path = require("path");
const app = express();

// Requiere http server porque sera el http server el que se le pasara a socket
const server = require("http").Server(app);

const PORT = 3001;

const httpServer = server.listen(PORT, () => {
  console.log("Corriendo en puerto", `http://localhost:${PORT}`);
});

// Requiere Socket.io y le pasa el server http
const io = require("socket.io")(httpServer);

// Pasamos la conexión al modulo socket
sockets(io);

// Para poder usar los CSS y JS e imagenes incrustados en el HTML
app.use(express.static(path.join((__dirname, "../frontend/src/"))));
app.use(express.json());
app.use("/users", users);

// Ruta principal de nuestra aplicacion
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/html/", "home.html"));
});

// Ruta vista del formulario registro
app.get("/register", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/src/html/", "register.html")
  );
});

// Ruta vista del formulario login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/html/", "login.html"));
});

app.get("/salas", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/html/", "salas.html"));
});

app.get("/juego", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/html/", "juego.html"));
});

app.get("/avatar", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/html/", "avatar.html"));
});

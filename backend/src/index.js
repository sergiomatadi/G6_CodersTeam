const { createServer } = require("http");
const users = require("./controllers/users"); // MODULO DE USERS

const PORT = 3001;

const requestListener = (req, res) => {
  const { url } = req;

  if (url.includes("users")) {
    users(req, res);
  } else {
    statusCode = 404;
    res.end("Not found");
  }
};

const server = createServer(requestListener);

server.listen(PORT, () => {
  console.log("Corriendo en puerto", PORT);
});

const { createServer } = require("http");

const PORT = 3001;

const requestListener = (req, res) => {
  const { url } = req;
  let statusCode = 200;
  let contentType = "application/json";

  if (url === "/") {
    res.writeHead(statusCode, { "Content-Type": contentType });
    res.end("CodersTeam API");
  } else {
    statusCode = 404;
    res.end("Not found");
  }
};

const server = createServer(requestListener);

server.listen(PORT);
console.log("Corriendo en puerto", PORT);

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");

const { todosTable } = require("./database/table");
const routes = require("./routes");

const app = express();
const PORT = 4500;
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());
todosTable(); // => for execute some table
app.use(routes); // => we calling api in here

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

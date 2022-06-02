const express = require("express");
const routes = express();
const { created, getAll, updated, deleted } = require("../controllers/todos");

routes.post("/todos", created);
routes.get("/todos", getAll);
routes.delete("/todos/:id", deleted);
routes.put("/todos/:id", updated);

module.exports = routes;

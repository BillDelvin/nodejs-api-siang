const express = require("express");
const app = express();

const todos = require("./todos");

const api = "/api/v1";

app.use(api, todos);

module.exports = app;

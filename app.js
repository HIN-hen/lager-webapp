import express from "express";
import { readdir, writeFile } from "node:fs/promises";
import { unlink } from "node:fs";
import router from "./router/index.js";
import formatDate from "./helpers/helper.formatDate.js";

const __dirname = import.meta.dirname;

//- create app instance, port
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public")); // static folder for js, css files ...
app.use(express.static(__dirname + "/uploads")); // static folder for uploaded files ...

app.use(express.json({ limit: "50mb" }));

app.use(router);

//- pug template engine
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.listen(port, () => {
    console.log(`App listening on port ${port} -> http://localhost:${port}`)
});
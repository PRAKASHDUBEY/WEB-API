const express = require("express");
const colors = require("colors");
const routes = require('./web/routes'); 
const dotenv = require("dotenv");
const cors = require('cors');
const morgan = require("morgan");
const DB = require("./config/db");


const PORT = 3000
dotenv.config({
    path:'./config/config.env'
});

const app = express();

app.use(
    express.json({
        extented: true
    }),
    express.json(),
    cors({
        origin: '*'
    }),
    morgan("dev")
);

const mongo = new DB;
mongo.connect();


app.use('/' , routes)

app.listen(PORT, 
    console.log(`Listening on http://localhost:${PORT}`.magenta.underline.bold));
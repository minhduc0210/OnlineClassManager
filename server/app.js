//Import
const express = require('express');
require("dotenv").config();
const cors = require("cors");

//Get env
const hostname = process.env.HOSTNAME
const port = process.env.PORT

//Connect to database
require("./database_connection/DbConnection");

//App settings
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Run server
app.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}`)
})
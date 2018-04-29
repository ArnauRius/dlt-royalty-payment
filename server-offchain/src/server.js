const express = require('express')
var bodyParser = require("body-parser");

const app  = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


require('./database')
require('./routes')(app)

module.exports = app
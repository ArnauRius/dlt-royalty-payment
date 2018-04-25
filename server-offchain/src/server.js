const express = require('express')

const app  = express()

require('./database')
require('./routes')(app)

module.exports = app
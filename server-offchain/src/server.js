const express = require('express')

const app  = express()

require('./routes')(app)

module.exports = app
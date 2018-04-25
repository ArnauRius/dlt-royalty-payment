const loki = require('lokijs')

const db = new loki('db.json')

db.addCollection('users')
db.addCollection('artists')
db.addCollection('songs')

db.saveDatabase()
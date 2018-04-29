const db = require('./database')

exports.test = function(req, res){
    
    res.json(db.getCollection('artists'))
}
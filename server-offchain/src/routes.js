const api = require('./api')

module.exports = function(app){
    app.get('/', api.test)
}
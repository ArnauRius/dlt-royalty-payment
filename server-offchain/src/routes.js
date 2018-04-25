const core = require('./controllers/core')

module.exports = function(app){
    app.get('/', core.test)
}
const api = require('./api')

module.exports = function(app){
    app.get('/api/all/artists/', api.artistsAll) // get all artists
    app.get('/api/all/users/', api.usersAll) // get all users
    app.get('/api/all/songs/', api.songsAll) // get all songs
    app.get('/api/artist/:id/', api.artist) // get one artist by id
    app.get('/api/user/:id/', api.user) // get one user by id
    app.get('/api/song/:id/', api.song) // get one song by id
    app.post('/api/user/', api.addUser)
}


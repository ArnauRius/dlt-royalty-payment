const db = require('./database')

exports.artistsAll = function(req, res){
    res.json(db.getCollection('artists').data)
}

exports.usersAll = function(req, res){
    res.json(db.getCollection('users').data)
}

exports.songsAll = function(req, res){
    res.json(db.getCollection('songs').data)
}

exports.artist = function(req, res){
    res.json(db.getCollection('artists').findOne({ id: req.params.id}));
}

exports.user = function(req, res){
    res.json(db.getCollection('users').findOne({ id: req.params.id}));
}

exports.song = function(req, res){
    res.json(db.getCollection('songs').findOne({ id: req.params.id}));
}
exports.addArtist = function(req, res){
    res.json(db.getCollection('artists').insert({ id: req.params.id}));
}

exports.addUser = function(req, res){
    res.json(req.body);
}

exports.addSong = function(req, res){
    res.json(db.getCollection('songs').findOne({ id: req.params.id}));
}
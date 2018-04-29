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
	db.getCollection('artists').insert(req.body);
	res.json({status: 'ok'})
}

exports.addUser = function(req, res){
	db.getCollection('users').insert(req.body);
	res.json({status: 'ok'})
}

exports.addSong = function(req, res){
	db.getCollection('songs').insert(req.body);
	res.json({status: 'ok'})
}

const loki = require('lokijs')

const db = new loki('db.json')

db.addCollection('users', [
	{id: 'arnau@rius.com', artistRef: 'artists/arnau@rius.com', email: 'arnau@rius.com', name: 'Arnau', password: 'bc378a10ccd6c53217b30c1fa5d04ebecefaf42973ab24077e8c58f21775be2b869559512739ca5bfec6bb872afa32591772cec36453226bacf306a43b76c289'}
	])
db.addCollection('artists', [
	{id: 'arnau@rius.com', key: '03c29680b93aef0813aaeee53475b2e61c28ceff685e41082adcc500915a9359ef', songsRef: ['songs/coLwRKaSclHysP60fO3F','songs/Eeti7nkcTxn0CJuDynqu']}
	])
db.addCollection('songs', [
	{id: 'Eeti7nkcTxn0CJuDynqu', name: 'HEllo from the sky'}
	])

db.saveDatabase()

module.exports = db
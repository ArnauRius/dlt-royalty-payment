/* Model for the Artist instances */

const Model = require('./model')

class Artist extends Model{

    /**
     * Constructor for the Artist model
     * @param songs - List of songs' identifiers that the artist have uploaded
     */
    constructor(songs) {
        super()
        this.songs = songs
    }

    //Override from Model
    serialize(){
        return this.songs.length > 0 ? this.songs.toString() : '_'
    }

    //Override from Model
    static deserialize(serialized){
        return new Artist(serialized !== '_' ? serialized.split(',').map((pk) => parseInt(pk)) : [])
    }
}

module.exports = Artist
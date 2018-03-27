/* Model for the Artist instances */

const {Model} = require('./model')

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
        return this.songs.toString()
    }

    //Override from Model
    static deserialize(serialized){
        return new Artist(serialized.split(',').map((pk) => parseInt(pk)))
    }
}

module.exports = {
    Artist
}
import Model from 'Model'

class Artist extends Model{
    constructor(songs) {
        super()
        this.songs = songs; // list of songs that the artist have uploaded
    }
    serialize(){
        return this.songs.toString();
    }
    static deserialize(serialized){
        return new Artist(serialized.split(',').map((pk) => parseInt(pk)))
    }
}
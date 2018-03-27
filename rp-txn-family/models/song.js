/* Model for the Song instances */

const Model = require('./model')
const Royalty = require('./royalty')

class Song extends Model{

    /**
     * Constructor for the Royalty model
     * @param amount - Amount of revenue that the song has already earned
     * @param pub_key - Public Key of the artist that uploaded this song
     * @param royalties - List of Royalty models corresponding to this song
     */
    constructor(name, amount, pub_key, royalties) {
        super()
        this.name = name
        this.amount = amount
        this.pub_key = pub_key
        this.royalties = royalties
    }

    //Override from Model
    serialize(){
        return this.name+','+this.amount+','+this.pub_key+','+this.royalties.map((royalty) => royalty.serialize())
    }

    //Override from Model
    static deserialize(serialized){
        let name, amount, pub_key, royalties
        [name, amount, pub_key, ...royalties] = serialized.split(',')
        return new Song(name, parseFloat(amount), pub_key, royalties.map((royalty) => Royalty.deserialize(royalty)))
    }
}

module.exports = Song
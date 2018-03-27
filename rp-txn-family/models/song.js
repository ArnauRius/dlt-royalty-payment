/* Model for the Song instances */

const {Model} = require('./model')
const {Royalty} = require('./royalty')

class Song extends Model{

    /**
     * Constructor for the Royalty model
     * @param amount - Amount of revenue that the song has already earned
     * @param pub_key - Public Key of the artist that uploaded this song
     * @param royalties - List of Royalty models corresponding to this song
     */
    constructor(amount, pub_key, royalties) {
        super()
        this.amount = amount
        this.pub_key = pub_key
        this.royalties = royalties
    }

    //Override from Model
    serialize(){
        return this.amount+','+this.pub_key+','+this.royalties.map((royalty) => royalty.serialize())
    }

    //Override from Model
    static deserialize(serialized){
        let amount, pub_key, royalties
        [amount, pub_key, ...royalties] = serialized.split(',')
        return new Song(parseFloat(amount), pub_key, royalties.map((royalty) => Royalty.deserialize(royalty)))
    }
}

module.exports = {
    Song
}
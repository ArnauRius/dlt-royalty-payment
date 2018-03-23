import Model from 'Model'
import Royalty from 'Royalty'
class Song extends Model{
    constructor(amount, pub_key, royalties) {
        super()
        this.amount = amount;
        this.pub_key = pub_key;
        this.royalties = royalties;
    }
    serialize(){
        return this.amount+','+this.pub_key+','+this.royalties.map((royalty) => royalty.serialize())
    }
    static deserialize(serialized){
        let amount, pub_key, royalties;
        [amount, pub_key, ...royalties] = serialized.split(',')
        return new Song(parseFloat(amount), pub_key, royalties.map((royalty) => Royalty.deserialize(royalty)))
    }
}
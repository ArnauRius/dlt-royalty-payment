/* Model for the Royalty Payment Transaction Family's payload */

const {Model} = require('./model')

class Payload extends Model{

    /**
     * Constructor for the Payload model
     * @param action - Action identifier to be handled and executed by the transaction processor
     * @param data - Data to be used when executing the defined action
     */
    constructor(action, data) {
        super()
        this.action = action
        this.data = data
    }

    //Override from Model
    serialize(){
        return Buffer.from(JSON.stringify(this))
    }

    //Override from Model
    static deserialize(serialized){
        let json = JSON.parse(serialized)
        return new Payload(json.action, json.data)
    }
}

module.exports = {
    Payload
}
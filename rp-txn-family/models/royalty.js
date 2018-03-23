/* Model for the Royalty instances */

import Model from 'rp-txn-family/models/model'

class Royalty extends Model{

    /**
     * Constructor for the Royalty model
     * @param account - Account identifier where the revenues will go to
     * @param percentage - Percentage of the whole revenue that corresponds to the account
     */
    constructor(account, percentage) {
        super()
        this.account = account
        this.percentage = percentage
    }

    //Override from Model
    serialize(){
        return this.account+';'+this.percentage
    }

    //Override from Model
    static deserialize(serialized){
        let account, percentage
        [account, percentage] = serialized.split(';')
        return new Royalty(account, parseFloat(percentage))
    }
}
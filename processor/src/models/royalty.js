import Model from 'processor/src/models/model'

class Royalty extends Model{
    constructor(account, percentage) {
        super()
        this.account = account;
        this.percentage = percentage;
    }
    serialize(){
        return this.account+';'+this.percentage
    }
    static deserialize(serialized){
        let account, percentage;
        [account, percentage] = serialized.split(';')
        return new Royalty(account, parseFloat(percentage))
    }
}
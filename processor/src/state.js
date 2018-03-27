/* This file models and processes the blockchain state changes */

class State{

    constructor(context, timeout = 2) {
        this.context = context
        this.timeout = timeout
        this.addressCache = []
    }
}

module.exports = {
    State
}
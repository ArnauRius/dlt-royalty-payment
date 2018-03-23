/* This file models and processes the blockchain state changes */

class State{

    constructor(payload, timeout = 2) {
        this.payload = payload
        this.timeout = timeout
        this.stateEntries = []
    }
}
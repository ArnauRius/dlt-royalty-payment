/**
 * This class models a subspace used to generate sub-namespacing in the addresser
 * The subspace is a range of values for a same sub-namspace. It is delimited by a 'start' value
 * and a 'stop' value.
 * The sub-namespace will be compressed by all the numbers between 'start' and 'stop' in Hex format
 *
 * The max 'stop' value must be -> 16^('length'*2)
 * Where 'length' represents the number of bytes(number of hex chars / 2) of the length of the namespace.
 *
 * So, if for example we define a sub-namespace that uses 1 byte (so, 2 hex chars in the address), the
 * 'stop' maximum value should be 265.
 *
 * The namespace value that a given address will receive will depend on the address itself. So the address
 * will be used to compute which value between 'start' and 'stop' it will get for the namespace.
 *
 * If the resulting namespace value length for a given address is inferior to the specified namespace length,
 * the namespace value for that address will be completed with '0' values at the beginning of it
 *
 */
class Subspace {

    /**
     * Constructor for the Subspace class
     * @param start - Initial value for the subspace's range
     * @param stop - Maximum value for the subspace's range
     * @param length - Length of the namespace in number of bytes (number of hex chars / 2)
     */
    constructor(start, stop, length) {
        this.start = start
        this.stop = stop
        this.length = length*2 // Multiplied by 2, as we work in Hex, and for every Byte, 2 Hex chars are needed
    }

    /**
     * Given an address, computes the namespace value corresponding to it by providing a value between 'start' and
     * 'stop' in Hex format.
     * @param address
     */
    computeNamespace(address) {
        // Computes a value between 'start' and 'stop' for the given address
        var nameSpace = parseInt(address, 16) % (this.stop - this.start) + this.start

        // Converts the obtained value to Hex and substrings it to have a max length of 'length'
        nameSpace = nameSpace.toString(16).substring(0, this.length)

        // Adds as many '0' chars at the left of the namespace as needed to complete the desired 'length'
        return Array(this.length-nameSpace.length+1).join("0")+nameSpace
    }
}

module.exports = {
    Subspace
}
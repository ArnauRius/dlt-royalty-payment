import {createContext, CryptoFactory} from 'sawtooth-sdk/signing'
import {Secp256k1PrivateKey} from 'sawtooth-sdk/signing/secp256k1'

const ECSDA_Standard = 'secp256k1' //Standard used for valid key generation
const context = createContext(ECSDA_Standard)
const cryptoFactory = new CryptoFactory(context)

/**
 * Generates a new random private key
 * @return {privateKey} - a private key instance
 */
const generatePrivateKey = () =>  context.newRandomPrivateKey()

/**
 * Generates a new private key instance from a given 64 length hex encoded private key
 * @param hex - The 64 hex string
 */
const generatePrivateKeyFromHex = (hex) => Secp256k1PrivateKey.fromHex(hex)

/**
 * Generates a new signer instance.
 * A Signer wraps a private key and provides some convenient methods for signing
 * bytes and getting the private key’s associated public key.
 * @return {Signer} - a signer instance
 */
const generateSigner = () => cryptoFactory.newSigner(generatePrivateKey())

/**
 * Generates a new signer instance for a given key
 * @param privateKey
 * @return {Signer} - a signer instance
 */
const generateSignerFromKey = (privateKey) => cryptoFactory.newSigner(privateKey)

export {
    generateSigner,
    generatePrivateKeyFromHex,
    generateSignerFromKey
}





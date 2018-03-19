import {createContext, CryptoFactory} from 'sawtooth-sdk/signing';

const ECSDA_Standard = 'secp256k1' //Standard used for valid key generation
const context = createContext(ECSDA_Standard)
const cryptoFactory = new CryptoFactory(context)

/**
 * Generates a new random private key
 * @return {privateKey} - a private key instance
 */
const generatePrivateKey = () => context.newRandomPrivateKey()

/**
 * Generates a new signer instance.
 * A Signer wraps a private key and provides some convenient methods for signing
 * bytes and getting the private key’s associated public key.
 * @param privateKey
 * @return {Signer} - a signer instance
 */
const generateSigner = () => cryptoFactory.newSigner(generatePrivateKey())

export {
  generateSigner
}





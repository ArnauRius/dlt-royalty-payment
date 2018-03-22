// Sawtooth imports
import { TransactionProcessor } from 'sawtooth-sdk/processor/'

// Royalty Payment Transaction Handler import
import RPHandler from './src/rp_handler'

// Constants imports
import { VALIDATOR_URL } from './src/constants'


// Initialize Transaction Processor and add the Royalty Payment Transaction Handler
const transactionProcessor = new TransactionProcessor(VALIDATOR_URL)
transactionProcessor.addHandler(new RPHandler())
transactionProcessor.start()
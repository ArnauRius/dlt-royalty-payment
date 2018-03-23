// Sawtooth imports
import { TransactionProcessor } from 'sawtooth-sdk/processor/'

// Royalty Payment Transaction Handler import
import RPHandler from './src/handler'

const VALIDATOR_URL = 'tcp://localhost:4004'

// Initialize Transaction Processor and add the Royalty Payment Transaction Handler
const transactionProcessor = new TransactionProcessor(VALIDATOR_URL)
transactionProcessor.addHandler(new RPHandler())
transactionProcessor.start()
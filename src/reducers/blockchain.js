/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

// This class has to do with any actions that deal with blocks
import Blockchain from '../models/Blockchain'
import Block from '../models/Block'
import Transaction from '../models/Transaction'
import Vin from '../models/Vin'
import Vout from '../models/Vout'

import type { BlockData } from '../models/Block'
import type { TransactionData } from '../models/Transaction'
import type { VoutData } from '../models/Vout'

opaque type State = {
  blockchain: Array<BlockData>,
  unspentOutputs: { [address: string]: Array<VoutData> },
  transactions: { [transactionID: string]: TransactionData },
}

function initializeState (): State {
  return {
    blockchain: [],
    unspentOutputs: {},
    transactions: {}
  }
}

export default function blockchain (state: State = initializeState(), action: any) {
  switch (action.type) {
    case 'MINED_BLOCK':
      return addToBlockchain(state, new Block(action.block))
    case 'RECEIVED_BLOCKCHAIN':
      return receivedBlockchain(state, action.blockchainData)
    default:
      return state
  }
}

function receivedBlockchain (state: State, blockchainData: Array<BlockData>) {
  // Only do anything if the blockchain we received is the longest
  if (blockchainData.length <= state.blockchain.length) {
    return state
  }

  let newState = initializeState()
  blockchainData.forEach((blockData: BlockData) => {
    newState = addToBlockchain(newState, new Block(blockData))
  })

  return newState
}

function addToBlockchain (state: State, block: Block): State {
  // Deep copy state
  let blockchain = new Blockchain(state.blockchain)

  // Check block hashes
  if (blockchain.canAddBlock(block) === false) {
    // Can't add block
    console.log("CAN'T add block.")
    console.log(block)
    return state
  } else {
    // Add the block to the blockchain
    blockchain.addBlock(block)
  }

  // Update unspent outputs, TX caches (pure deep copy)
  let unspentOutputs: {[address: string]: Array<VoutData>} = {...state.unspentOutputs}
  let globalTransactions: {[transactionId: string]: TransactionData} = {...state.transactions}

  // Iterate through each of the blocks transactions
  block.transactions.forEach((transaction: Transaction) => {
    // Add the transaction to the global transactions object
    globalTransactions[transaction.id] = transaction.data()

    // Iterate through the transactions outputs
    transaction.vouts.forEach((vout: Vout, index: number) => {
      let destinationAddress: string = vout.address.toString('hex')
      // Make sure that there is an array for the outgoing address
      if (unspentOutputs[destinationAddress] === null || unspentOutputs[destinationAddress] === undefined) {
        unspentOutputs[destinationAddress] = []
      }

      unspentOutputs[destinationAddress] = [...unspentOutputs[destinationAddress], vout.data()]
    })

    transaction.vins.forEach((vin: Vin, index: number) => {
      // Get the corresponding Vout object
      let originatingTx = new Transaction(globalTransactions[vin.transactionId])
      let vout: Vout = originatingTx.vouts[vin.index]

      let destinationAddress: string = vout.address.toString('hex')

      // get rid of vout from senders unspent outputs
      // Custom indexOf since unspentOutputData is an object and deep equality
      // has to be explicitly defined
      let voutIndex = -1
      let voutData = vout.data()
      unspentOutputs[destinationAddress].forEach((unspentOutput: VoutData, index: number) => {
        if (unspentOutput.address === voutData.address &&
            unspentOutput.amount === voutData.amount) {
          voutIndex = index
        }
      })

      unspentOutputs[destinationAddress].splice(voutIndex, 1)
    })
  })

  let newState: State = Object.assign({}, state, {
    unspentOutputs: unspentOutputs,
    transactions: globalTransactions,
    blockchain: blockchain.data()
  })

  return newState
}

/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

// This class has to do with any actions that deal with transactions (adding a new transaction, etc.)

import Block from '../models/Block'
import Transaction from '../models/Transaction'

import type { TransactionData } from '../models/Transaction'
import type { BlockData } from '../models/Block'

opaque type State = {
  currentBlock: BlockData,
  address: ?string,
  mining: boolean
}

function initializeState (): State {
  let currentBlock: Block = new Block()
  let currentBlockData: BlockData = currentBlock.data()

  return {
    currentBlock: currentBlockData,
    address: null,
    mining: false
  }
}

export default function miner (state: State = initializeState(),
                              action: any,
                              { blockchain }: { blockchain: any }) {
  switch (action.type) {
    case 'ADD_ADDRESS':
      return addAddress(state, action.publicKey)
    case 'MINED_BLOCK':
      return mineCoin(state, new Block(action.block))
    case 'START_MINING':
      return {...state, mining: true}
    case 'STOP_MINING':
      return {...state, mining: false}
    case 'SELECT_MINING_ADDRESS':
      return selectMiningAddress(state, action.address)
    case 'RECEIVED_BLOCKCHAIN':
      // TODO (@jeffbarg): This is probably buggy.  If this code gets executed after the reducer
      // for blockchain, blockchain replacement won't be detected.
      // The blockchain will be replaced, lets replace the new block

      // If the received blockchain is empty, take no action
      if (action.blockchainData.length === 0) return state

      let lastBlock
      let currentBlockchainData = blockchain.blockchain

      // Pick larger blockchain
      if (currentBlockchainData.length >= action.blockchainData.length) {
        lastBlock = new Block(currentBlockchainData[currentBlockchainData.length - 1])
      } else {
        lastBlock = new Block(action.blockchainData[action.blockchainData.length - 1])
      }

      return mineCoin(state, lastBlock)

      // return state
    case 'RECEIVED_TRANSACTION':
      return receivedTransaction(state, new Transaction(action.transaction), blockchain.transactions)
    default:
      return state
  }
}

function selectMiningAddress (state: State, address: string) {
  let addressBuffer = Buffer.from(address, 'hex')

  let newBlock = new Block(state.currentBlock)
  if (newBlock.hasCoinbase()) {
    newBlock.removeCoinbase()
  }

  newBlock.addCoinbase(addressBuffer)

  return {
    ...state,
    address: address,
    currentBlock: newBlock.data()
  }
}

function receivedTransaction (state: State, transaction: Transaction, transactions: { [transactionID: string]: TransactionData }) {
  if (transactions[transaction.id] === undefined) {
    let newBlock: Block = new Block(state.currentBlock)

    // Only add the transaction if it is not currently in the transaction queue
    if (newBlock.transactions.some((existingTransaction) => { return existingTransaction.id === transaction.id })) {
      return state
    }

    // Don't add coinbase transactions to the current block
    if (transaction.isCoinbase() && newBlock.transactions.length > 0) {
      return state
    }

    newBlock.addTransaction(transaction)

    return {
      ...state,
      currentBlock: newBlock.data()
    }
  }
}

function addAddress (state: State, publicKey: Buffer): State {
  let currentBlock: Block = new Block(state.currentBlock)

  if (currentBlock.transactions.length === 0 || !currentBlock.transactions[0].isCoinbase()) {
    currentBlock.addCoinbase(publicKey)
  }

  let newState: State = Object.assign({}, state, {
    currentBlock: currentBlock.data()
  })

  if (newState.address === null || newState.address === undefined) {
    newState.address = publicKey.toString('hex')
  }

  return newState
}

/**
 * the `nonce` parameter is the nonce that successfully mines the current block
 */
function mineCoin (state: State, completeBlock: Block): State {
  // Reset block state
  let newBlock = new Block()
  newBlock.previousHash = completeBlock.hash()
  newBlock.height = completeBlock.height + 1

  if (state.address !== null && state.address !== undefined) {
    newBlock.addCoinbase(Buffer.from(state.address, 'hex'))
  }

  let currentTransactions = new Block(state.currentBlock).transactions
  currentTransactions.forEach((transaction) => {
    if (!completeBlock.transactions.some((minedBlockTx) => { return minedBlockTx.id === transaction.id })) {
      // Carry over any transactions that weren't just mined as part of completeBlock
      if (!transaction.isCoinbase()) {
        newBlock.addTransaction(transaction)
      }
    }
  })

  // Replace the currentBlock object
  return {
    ...state,
    currentBlock: newBlock.data()
  }
}

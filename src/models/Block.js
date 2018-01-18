/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

import Transaction from './Transaction'
import type { TransactionData } from './Transaction'

import Vout from './Vout'

import crypto from 'crypto'

let DEFAULT_DIFFICULTY = 14

export type BlockData = {
  nonce: number;
  transactionData: Array<TransactionData>;
  previousHash: ?string;
  timestamp: number;
  difficulty: number;
  height: number
}

export default class Block {
  nonce: number;
  transactions: Array<Transaction>;
  previousHash: ?Buffer;
  timestamp: number;
  difficulty: number;
  height: number

  constructor (blockData: BlockData = {
    nonce: 0,
    height: 0,
    transactionData: [],
    previousHash: null,
    timestamp: Date.now(),
    difficulty: DEFAULT_DIFFICULTY
  }) {
    this.nonce = blockData.nonce
    this.height = blockData.height

    this.transactions = blockData.transactionData.map((transactionData: TransactionData): Transaction => {
      return new Transaction(transactionData)
    })

    this.previousHash = (blockData.previousHash === null || blockData.previousHash === undefined)
                          ? null : Buffer.from(blockData.previousHash, 'hex')

    this.timestamp = blockData.timestamp
    this.difficulty = blockData.difficulty
  }
  /**
   * Hashes all the values
   */
  hash (nonce: number = this.nonce): Buffer {
    // Construct hasher with right algorithm
    const hash = crypto.createHash('sha256')

    // Prepare data
    let nonceData = Buffer.alloc(4)
    nonceData.writeInt32LE(nonce, 0)

    let heightData = Buffer.alloc(4)
    heightData.writeInt32LE(this.height, 0)

    // Update the hash
    hash.update(nonceData)
    hash.update(heightData)

    this.transactions.forEach((transaction) => {
      hash.update(transaction.hash())
    })

    if (this.previousHash !== null && this.previousHash !== undefined) {
      hash.update(this.previousHash)
    }

    hash.update(this.timestamp.toString())

    // Digest
    return hash.digest()
  }

  /**
   * Adds a transaction to the block and checks that all transactions can be executed atomically
   */
  addTransaction (transaction: Transaction) {
    this.transactions.push(transaction)
  }

  /**
   * Adds a coinbase transaction for the specified address
   */
  addCoinbase (address: Buffer) {
    let transaction = new Transaction()

    let vout = new Vout({
      address: address.toString('hex'),
      amount: 25,
      transactionId: transaction.id
    })

    transaction.vins = []
    transaction.vouts = [vout]

    this.transactions.push(transaction)
  }

  hasCoinbase (): boolean {
    if (this.transactions.length === 0) {
      return false
    }

    return this.transactions.some((transaction: Transaction) => {
      return transaction.isCoinbase()
    })
  }

  removeCoinbase () {
    if (this.transactions.length === 0) {
      return
    }

    // Return all none-coinbase transactions
    this.transactions = this.transactions.filter((transaction: Transaction) => {
      return (!transaction.isCoinbase())
    })
  }
  /**
   * Compares hash against 256 bit difficulty target
   */
  isMined (nonce: number = this.nonce): boolean {
    let difficulty = this.difficulty

    let difficultyTarget = Uint8Array.from(
      (new Uint8Array(32)).keys(),
      (index: number) => {
        if (index < (difficulty / 8)) {
          let trailingZeros = Math.min(8, difficulty - index * 8)
          return 2 ** (8 - trailingZeros) - 1
        } else {
          return 255
        }
      }
    )

    return Buffer.compare(
      this.hash(nonce),
      Buffer.from(difficultyTarget)
    ) < 0
  }

  isValid (): boolean {
    return this.isMined()
  }

  copy (): Block {
    return new Block(this.data())
  }

  data (): BlockData {
    return {
      nonce: this.nonce,
      transactionData: this.transactions.map((transaction: Transaction) => { return transaction.data() }),
      previousHash: (this.previousHash === null || this.previousHash === undefined) ? this.previousHash : this.previousHash.toString('hex'),
      timestamp: this.timestamp,
      difficulty: this.difficulty,
      height: this.height
    }
  }
}

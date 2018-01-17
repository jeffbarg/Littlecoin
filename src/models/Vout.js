/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

import crypto from 'crypto'

export type VoutData = {
  address: string;
  amount: number;
  transactionId: string;
}

export default class Vout {
  // The transaction object for this output
  transactionId: string

  // Public key corresponding to the address that controls the outputs of this transaction
  address: Buffer

  // The amount being sent
  amount: number

  constructor (voutData: VoutData) {
    this.address = Buffer.from(voutData.address, 'hex')
    this.amount = voutData.amount
    this.transactionId = voutData.transactionId
  }

  /**
   * Hashes all the values
   */
  hash (): Buffer {
    // Construct hasher with right algorithm
    const hash = crypto.createHash('sha256')

    // Prepare data
    let amountData = Buffer.alloc(4)
    amountData.writeInt32LE(this.amount, 0)

    // Update the hash
    hash.update(amountData)
    hash.update(this.address)

    // Digest
    return hash.digest()
  }

  data (): VoutData {
    return {
      address: this.address.toString('hex'),
      amount: this.amount,
      transactionId: this.transactionId
    }
  }
}

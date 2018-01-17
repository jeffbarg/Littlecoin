/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

import crypto from 'crypto'

export type VinData = {
  transactionId: string;
  index: number;
}

export default class Vin {
  // Transaction ID
  transactionId: string

  // Index of the vout in the list of transactions
  index: number

  constructor (vinData: VinData) {
    this.transactionId = vinData.transactionId
    this.index = vinData.index
  }

  hash (): Buffer {
    // Construct hasher with right algorithm
    const hash = crypto.createHash('sha256')

    // Prepare data
    let indexData = Buffer.alloc(4)
    indexData.writeInt32LE(this.index, 0)

    // Update the hash
    hash.update(indexData)
    hash.update(this.transactionId)

    // Digest
    return hash.digest()
  }

  data (): VinData {
    return {
      transactionId: this.transactionId,
      index: this.index
    }
  }
}

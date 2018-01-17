/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

import Vin from './Vin'
import Vout from './Vout'

import type { VinData } from './Vin'
import type { VoutData } from './Vout'

import crypto from 'crypto'
import eccrypto from 'eccrypto'

export type TransactionData = {
  id: string;
  signature: ?string;
  vinData: Array<VinData>;
  voutData: Array<VoutData>;
}

export default class Transaction {
  // Id of the Transaction
  id: string

  // Signature to prove that sender authorized the spending
  signature: ?Buffer

  vins: Array<Vin>
  vouts: Array<Vout>

  constructor (transactionData: TransactionData = {
    // Assign a random transaction ID
    id: crypto.randomBytes(32).toString('hex'),
    signature: null,
    vinData: [],
    voutData: []
  }) {
    this.id = transactionData.id

    let signatureData = transactionData.signature
    this.signature = (signatureData === undefined || signatureData === null)
                        ? null : Buffer.from(signatureData, 'hex')

    this.vins = transactionData.vinData.map((vinData: VinData): Vin => {
      return new Vin(vinData)
    })
    this.vouts = transactionData.voutData.map((voutData: VoutData): Vout => {
      return new Vout(voutData)
    })
  }

  /**
   * Hashes all the values
   */
  hash (): Buffer {
    // Construct hasher with right algorithm
    const hash = crypto.createHash('sha256')

    this.vins.forEach((vin: Vin) => {
      hash.update(vin.hash())
    })

    this.vouts.forEach((vout: Vout) => {
      hash.update(vout.hash())
    })

    hash.update(this.id)

    // Digest
    return hash.digest()
  }

  /**
   * The senderPrivateKey parameter has to match the Vout address that all
   * of the vins on this transaction object correspond to.
   */
  sign (senderPrivateKey: Buffer) {
    let tx = this

    this.signature = eccrypto.sign(senderPrivateKey, tx.hash()).then(function (sig) {
      tx.signature = sig
    })
  }

  isCoinbase (): boolean {
    return (this.vins.length === 0 && this.vouts.length === 1)
  }

  data (): TransactionData {
    return {
      id: this.id,
      signature: (this.signature === undefined || this.signature === null) ? this.signature : this.signature.toString('hex'),
      vinData: this.vins.map((vin: Vin) => { return vin.data() }),
      voutData: this.vouts.map((vout: Vout) => { return vout.data() })
    }
  }
}

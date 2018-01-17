/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

import Transaction from '../models/Transaction'
import Vin from '../models/Vin'
import Vout from '../models/Vout'

import eccrypto from 'eccrypto'

import type { Peer } from '../reducers/peers'

import type { TransactionData } from '../models/Transaction'
import type { VoutData } from '../models/Vout'

export const sendCoin = (senderPrivateKey: Buffer, destinationAddress: Buffer, amount: number) => {
  return function (dispatch: (action: any) => void, getState: () => any) {
    const blockchain = getState().blockchain
    const transactions = blockchain.transactions
    const unspentOutputs = blockchain.unspentOutputs
    const peers = getState().peers.peers

    // TODO: Verify inputs are valid
    let transaction = new Transaction()

    // Corresponding uncompressed (65-byte) public key.
    const senderPublicKey = eccrypto.getPublic(senderPrivateKey)

    let unspentOutputsForSender = unspentOutputs[senderPublicKey.toString('hex')]
    let vins = []
    let vouts = []
    let totalAccumulated = 0

    if (unspentOutputsForSender === null || unspentOutputsForSender === undefined) {
      // Fail
      console.log('FAILURE // BALANCE IS TOO LOW // ' + totalAccumulated + ' // ' + amount + ' // ' + senderPublicKey.toString('hex'))
      return
    }

    // Prepare inputs
    unspentOutputsForSender.forEach((unspentOutputData: VoutData, index: number) => {
      if (totalAccumulated >= amount) {
        return
      }

      let outputTransactionData: TransactionData = transactions[unspentOutputData.transactionId]

      // Custom indexOf since unspentOutputData is an object and deep equality
      // has to be explicitly defined
      let voutIndex = -1
      outputTransactionData.voutData.forEach((txOutput: VoutData, index: number) => {
        if (unspentOutputData.address === txOutput.address &&
            txOutput.amount === unspentOutputData.amount) {
          voutIndex = index
        }
      })

      let vin = new Vin({
        transactionId: outputTransactionData.id,
        index: voutIndex
      })

      vins.push(vin)

      totalAccumulated += unspentOutputData.amount
    })

    if (totalAccumulated < amount) {
      // Failed // Balance is too low
      console.log('FAILURE // BALANCE IS TOO LOW // ' + totalAccumulated + ' // ' + amount + ' // ' + senderPublicKey.toString('hex'))
      return
    }

    // Prepare destination output
    const destinationVout = new Vout({
      address: destinationAddress.toString('hex'),
      amount: amount,
      transactionId: transaction.id
    })

    vouts.push(destinationVout)

    // Return change
    if (totalAccumulated > amount) {
      const returnOutput = new Vout({
        address: senderPublicKey,
        amount: totalAccumulated - amount,
        transactionId: transaction.id
      })

      vouts.push(returnOutput)
    }

    // Add vins and vouts to transaction object
    transaction.vins = vins
    transaction.vouts = vouts

    // Sign the transaction
    transaction.sign(senderPrivateKey)

    // Broadcast the transaction to peers
    let easyrtc = window.easyrtc
    peers.forEach((peer: Peer) => {
      easyrtc.sendDataWS(peer.easyrtcid, 'TRANSACTION', transaction.data())
    })

    // Dispatch the transaction
    dispatch(receivedTransaction(transaction))
  }
}

export const receivedTransaction = (transaction: Transaction) => {
  return {
    type: 'RECEIVED_TRANSACTION',
    transaction: transaction.data()
  }
}

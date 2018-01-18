/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

import Block from '../models/Block'
import Blockchain from '../models/Blockchain'

import type { Peer } from '../reducers/peers'

export const startMining = () => {
  return {
    type: 'START_MINING'
  }
}

export const stopMining = () => {
  return {
    type: 'STOP_MINING'
  }
}

export const selectMiningAddress = (publicKey: string) => {
  return {
    type: 'SELECT_MINING_ADDRESS',
    address: publicKey
  }
}

export const minedBlock = (block: Block) => {
  // Need to wrap in a Thunk to get the state
  return function (dispatch: (action: any) => void, getState: () => any) {
    const easyrtc = window.easyrtc
    const state = getState()

    const currentBlockchain = new Blockchain(state.blockchain.blockchain)
    if (!currentBlockchain.canAddBlock(block)) {
      console.log("can't add block -- won't dispatch")
      return
    }

    state.peers.peers.forEach((peer: Peer) => {
      easyrtc.sendDataWS(peer.easyrtcid, 'BLOCK', block.data())
    })

    dispatch(receivedBlock(block))
  }
}

export const receivedBlock = (block: Block) => {
  return {
    type: 'MINED_BLOCK',
    block: block.data()
  }
}

export const clearBlockchain = () => {
  return {
    type: 'CLEAR_BLOCKCHAIN'
  }
}

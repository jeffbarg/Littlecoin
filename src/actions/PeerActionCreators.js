/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

import Block from '../models/Block'
import Transaction from '../models/Transaction'

export const joinNetwork = (networkName: string) => {
  return function (dispatch: (action: any) => void, getState: () => any) {
    const easyrtc = window.easyrtc

    easyrtc.connect(networkName, (easyrtcid) => {
      dispatch(gotNetworkId(easyrtcid))
    }, (errorCode, message) => {
      console.log(errorCode)
      console.log(message)
    })
  }
}

export const gotNetworkId = (networkId: ?string) => {
  return {
    type: 'CONNECT_NODE',
    id: networkId
  }
}

export const receivedPeerlist = (peers: Array<{username: string, easyrtcid: string}>) => {
  return function (dispatch: (action: any) => void, getState: () => any) {
    const existingPeers = getState().peers.peers

    // Get the list of peers that are new (do not exist in current peers)
    let newPeers = peers.filter((peer) => {
      let peerAlreadyExists = existingPeers.some((existingPeer) => {
        return existingPeer.easyrtcid === peer.easyrtcid
      })

      return peerAlreadyExists === false
    })

    // Get the list of peers that disconnected
    let removedPeers = existingPeers.filter((existingPeer) => {
      let peerStillExists = peers.some((peer) => {
        return existingPeer.easyrtcid === peer.easyrtcid
      })

      return peerStillExists === false
    })

    newPeers.forEach((newPeer) => {
      dispatch(connectedPeer(newPeer))
    })

    removedPeers.forEach((removedPeer) => {
      dispatch(disconnectedPeer(removedPeer))
    })
  }
}

export const connectedPeer = (peer: {username: string, easyrtcid: string}) => {
  return function (dispatch: (action: any) => void, getState: () => any) {
    const easyrtc = window.easyrtc
    const otherEasyrtcid = peer.easyrtcid

    // Send over the blockchain
    easyrtc.sendDataWS(otherEasyrtcid, 'BLOCKCHAIN', getState().blockchain.blockchain)

    // Send over current transaction queue
    const currentBlock = new Block(getState().miner.currentBlock)
    currentBlock.transactions.forEach((transaction: Transaction) => {
      if (transaction.isCoinbase() === false) {
        easyrtc.sendDataWS(otherEasyrtcid, 'TRANSACTION', transaction.data())
      }
    })

    dispatch({
      type: 'CONNECTED_PEER',
      peer
    })
  }
}

export const disconnectedPeer = (peer: {username: string, easyrtcid: string}) => {
  return {
    type: 'DISCONNECTED_PEER',
    peer
  }
}

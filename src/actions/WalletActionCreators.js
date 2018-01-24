/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

import crypto from 'crypto'
import eccrypto from 'eccrypto'

export const addAddress = () => {
  // A new random 32-byte private key.
  const privateKey = crypto.randomBytes(32)

  // Corresponding uncompressed (65-byte) public key.
  const publicKey = eccrypto.getPublic(privateKey)

  return {
    type: 'ADD_ADDRESS',
    publicKey: publicKey.toString('hex'),
    privateKey: privateKey.toString('hex')
  }
}

export const removeAddress = (publicKey: string) => {
  return {
    type: 'REMOVE_ADDRESS',
    publicKey
  }
}

export const changePrimaryAddress = (publicKey: string) => {
  return function (dispatch: (action: any) => void, getState: () => any) {
    const peers = getState().peers.peers
    const easyrtc = window.easyrtc

    peers.forEach((peer) => {
      const otherEasyrtcid = peer.easyrtcid

      // Send over this peer (include selected public address)
      const nodeId = getState().peers.nodeId

      if (nodeId != null) {
        let selfPeer = {
          username: easyrtc.idToName(nodeId),
          easyrtcid: nodeId,
          publicAddress: publicKey
        }

        easyrtc.sendDataWS(otherEasyrtcid, 'PEER', selfPeer)
      }
    })

    dispatch({
      type: 'CHANGE_PRIMARY_ADDRESS',
      publicKey
    })
  }
}

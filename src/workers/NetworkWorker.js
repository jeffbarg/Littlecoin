/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

import type { Store } from 'redux'

// Actions
import { receivedTransaction, receivedBlockchain,
         receivedBlock, receivedPeerlist, gotNetworkId, updatePeer } from '../actions'

// Models
import Block from '../models/Block'
import Transaction from '../models/Transaction'

export const setupNetwork = (store: Store) => {
  const dispatch = store.dispatch.bind(store)
  const easyrtc = window.easyrtc

  easyrtc.setSocketUrl('https://54.172.240.234:8443')

  easyrtc.enableDebug(false)
  easyrtc.enableDataChannels(false)
  easyrtc.enableVideo(false)
  easyrtc.enableAudio(false)
  easyrtc.enableVideoReceive(false)
  easyrtc.enableAudioReceive(false)

  // Additionally pass dispatch object to each function
  easyrtc.setPeerListener((a, b, c) => receiveData(a, b, c, dispatch))
  easyrtc.setRoomOccupantListener((a, b, c) => roomData(a, b, c, dispatch))

  easyrtc.setDisconnectListener(() => {
    dispatch(gotNetworkId(null))
  })
}

function receiveData (who: string,
                      msgType: string,
                      content: any,
                      dispatch: (action: any) => void) {
  switch (msgType) {
    case 'BLOCKCHAIN':
      dispatch(receivedBlockchain(content))
      break
    case 'BLOCK':
      const broadcastBlock = new Block(content)
      dispatch(receivedBlock(broadcastBlock))
      break
    case 'TRANSACTION':
      const transaction = new Transaction(content)
      dispatch(receivedTransaction(transaction))
      break
    case 'PEER':
      dispatch(updatePeer(content))
    default:
  }
}

function roomData (roomName: string,
                   occupantList: any,
                   isPrimary: boolean,
                   dispatch: (action: any) => void) {
  console.log('roomData: ' + JSON.stringify({roomName, occupantList, isPrimary}))

  const easyrtc = window.easyrtc

  dispatch(receivedPeerlist(
    Object.keys(occupantList).map((name) => {
      const occupantValue = occupantList[name]
      const peerId: string = occupantValue.easyrtcid

      return {
        username: easyrtc.idToName(peerId),
        easyrtcid: peerId
      }
    })
  ))
}

/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

// This class has to do with any actions that deal with peers (adding a peer, removing a peer, disconnecting, etc..)

export type Peer = {
  username: string,
  easyrtcid: string
}

opaque type State = {
  nodeId: ?string,
  peers: Peer[]
}

function initializeState (): State {
  return {
    nodeId: null,
    peers: []
  }
}

export default function peers (state: State = initializeState(),
                                     action: any) {
  let peerId: string

  switch (action.type) {
    case 'CONNECT_NODE':
      return {...state, nodeId: action.id}
    case 'CONNECTED_PEER':
      return connectedPeer(state, action.peer)
    case 'DISCONNECTED_PEER':
      return disconnectedPeer(state, action.peer)
    case 'RECEIVED_PEERLIST':
      return receivedPeerlist(state, action.peers)
    default:
      return state
  }

  function connectedPeer (state: State, peer: Peer) {
    peerId = peer.easyrtcid

    // Check if we already have this peer or if the peer is the node itself
    if (state.peers.some((existingPeer) => {
      return existingPeer.easyrtcid === peerId
    }) || peerId === state.nodeId) {
      return state
    } else {
      return {...state, peers: [...state.peers, peer]}
    }
  }

  function disconnectedPeer (state: State, peer: Peer) {
    let peerId = peer.easyrtcid
    return {...state, peers: state.peers.filter(peer => peer.easyrtcid !== peerId)}
  }

  function receivedPeerlist (state: State, peers: Array<Peer>) {
    const existingPeers = state.peers

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

    // Copy state
    let newState = {...state}

    newPeers.forEach((newPeer) => {
      newState = connectedPeer(newState, newPeer)
    })

    removedPeers.forEach((removedPeer) => {
      newState = disconnectedPeer(newState, removedPeer)
    })

    return newState
  }
}

/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

// This class has to do with any actions that deal with address management

type Address = {publicKey: string, privateKey: string}

type State = {
  addresses: Address[],
  primaryAddress: ?Address
}

function initializeState (): State {
  return {
    addresses: [],
    primaryAddress: null
  }
}

export default function wallet (state: State = initializeState(),
                                action: {type: string, publicKey: string, privateKey: string}) {
  switch (action.type) {
    case 'ADD_ADDRESS':
      return addAddress(state, {publicKey: action.publicKey, privateKey: action.privateKey})
    case 'CHANGE_PRIMARY_ADDRESS':
      return changePrimaryAddress(state, action.publicKey)
    case 'REMOVE_ADDRESS':
      return removeAddress(state, action.publicKey)
    default:
      return state
  }
}

function removeAddress (state: State, publicKey: string): State {
  // Filter out any addresses with the publicKey
  let newState = Object.assign({}, state, {
    addresses: state.addresses.filter((existingAddress) => {
      return existingAddress.publicKey !== publicKey
    })
  })

  // Reject action to delete all addresses
  if (newState.addresses.length === 0) {
    return state
  }

  return newState
}

function changePrimaryAddress (state: State, publicKey: string): State {
  // Search the addresses to find the full address
  let primaryAddress: ?Address = state.addresses.find((address) => {
    return address.publicKey === publicKey
  })

  // If there is no address with a corresponding publicKey, do nothing
  if (primaryAddress === undefined) {
    return state
  }

  let newState = Object.assign({}, state, {
    primaryAddress: primaryAddress
  })

  return newState
}

function addAddress (state: State, address: Address): State {
  let newState = Object.assign({}, state, {
    addresses: [...state.addresses, address]
  })

  if (state.addresses.length === 0) {
    newState.primaryAddress = newState.addresses[0]
  }

  return newState
}

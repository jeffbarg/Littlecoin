/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

import React from 'react'
import { connect } from 'react-redux'
import { ListGroup, ListGroupItem, Label } from 'react-bootstrap'
import copy from 'copy-to-clipboard'

import { addAddress, changePrimaryAddress, removeAddress } from '../actions'

let AddressList = ({ addresses, primaryAddress, onAddAddress, onChangePrimaryAddress, onRemoveAddress, balances }) => {
  const removeAddress = (publicKey) => {
    let confirmation = window.confirm('Are you sure you want to delete this address?\n\n The publicKey of the address you are about to delete is\n\n' + publicKey.toString('hex'))
    if (confirmation === true) {
      onRemoveAddress(publicKey)
    }
  }
  const removeButton = (address) => (
    <span
      onClick={() => {
        removeAddress(address.publicKey)
      }}
      className='glyphicon glyphicon-remove clickable'
      style={{float: 'right', position: 'absolute', top: 10, right: 10}}
    />
  )
  return (
    <div>
      <h4>Addresses</h4>
      <ListGroup>
        {addresses.map((address, index) => (
          <div key={address.publicKey}>
            <ListGroupItem header={'Address ' + (index + 1)}
              bsStyle={(address.publicKey === primaryAddress.publicKey) ? 'info' : undefined}
              onClick={() => {
                copy(address.publicKey)
                onChangePrimaryAddress(address.publicKey)
              }}
              style={{ wordBreak: 'break-all' }}>

              {index > 0 ? removeButton(address) : undefined }

              <h4>Public Key</h4>
              {address.publicKey}
              <h4>Private Key</h4>
              {address.privateKey}

              <h1><Label bsStyle='success'>{balances[index]}</Label></h1>
            </ListGroupItem>
          </div>
        ))}
        <ListGroupItem onClick={onAddAddress} style={{textAlign: 'center'}}>
          <span className='glyphicon glyphicon-plus' style={{marginTop: 2}} /> Add a New Address
        </ListGroupItem>
      </ListGroup>
    </div>
  )
}

const getBalance = (blockchain, address) => {
  let unspentOutputs = blockchain.unspentOutputs
  let addressTxs = unspentOutputs[address]

  if (addressTxs === null || addressTxs === undefined) {
    return 0
  }

  let totalUnspent = 0
  addressTxs.forEach((vout) => {
    totalUnspent += vout.amount
  })

  return totalUnspent
}

const getBalances = (blockchain, addresses) => {
  return addresses.map((address) => {
    return getBalance(blockchain, address.publicKey)
  })
}

const mapStateToProps = state => {
  return {
    balances: getBalances(state.blockchain, state.wallet.addresses),
    addresses: state.wallet.addresses,
    primaryAddress: state.wallet.primaryAddress
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onChangePrimaryAddress: (publicKey) => {
      dispatch(changePrimaryAddress(publicKey))
    },
    onRemoveAddress: (publicKey) => {
      dispatch(removeAddress(publicKey))
    },
    onAddAddress: () => {
      dispatch(addAddress())
    }
  }
}

AddressList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddressList)

export default AddressList

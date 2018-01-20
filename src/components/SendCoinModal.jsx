/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { sendCoin } from '../actions'

import { Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock, ToggleButton, ToggleButtonGroup, Label } from 'react-bootstrap'

class SendCoinModal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      destinationAddress: '',
      amount: 0,
      sendingAddress: this.props.availableAddresses[0]
    }

    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.getValidationState = this.getValidationState.bind(this)
    this.getAmountValidationState = this.getAmountValidationState.bind(this)
    this.getAddressValidationState = this.getAddressValidationState.bind(this)
    this.onChangeSendingAddress = this.onChangeSendingAddress.bind(this)
    this.onSelectDestinationPeer = this.onSelectDestinationPeer.bind(this)
  }

  handleAmountChange (e) {
    const newAmount = Number(e.target.value)
    this.setState({amount: newAmount})
  }

  handleAddressChange (e) {
    const newAddress = e.target.value
    this.setState({destinationAddress: newAddress})
  }

  getValidationState () {
    return (
      this.getAddressValidationState() === 'success' &&
      this.getAmountValidationState() === 'success'
    )
  }

  getAddressValidationState () {
    if (this.state.destinationAddress === null ||
        this.state.destinationAddress === undefined ||
        this.state.destinationAddress === '') {
      return null
    }

    if (this.state.destinationAddress.length % 2 === 1) {
      return 'error'
    }

    return (/^[0-9A-F]{130}$/i.test(this.state.destinationAddress)) ? 'success' : 'error'
  }

  getAmountValidationState () {
    const getBalance = (blockchain, address) => {
      let unspentOutputs = blockchain.unspentOutputs
      let addressTxs = unspentOutputs[address]

      if (addressTxs === null || addressTxs === undefined) {
        console.log("ADDRESS HAD NO BALANCE!")
        return 0
      }

      let totalUnspent = 0
      addressTxs.forEach((vout) => {
        totalUnspent += vout.amount
      })

      return totalUnspent
    }
    
    const spendingAmount = this.state.amount
    
    if (spendingAmount > 0) {
      if (this.state.sendingAddress != null) {
        const blockchain = this.props.blockchain
        const sendingKey = this.state.sendingAddress.publicKey
        const balance = getBalance(this.props.blockchain, sendingKey)

        if (balance < spendingAmount) {
          return 'error'
        } else {
          return 'success'
        }
      } else {
        // Return warning if no sending address selected
        return 'warning'
      }
    }
    else if (spendingAmount === 0) return 'warning'
    else if (spendingAmount < 0) return 'error'
    return null
  }

  onChangeSendingAddress (e) {
    console.log(e)
    this.setState({
      sendingAddress: e
    })
  }

  onSelectDestinationPeer (peerAddress) {
    console.log('onSelectDestinationPeer')
    console.log(peerAddress)

    this.setState({
      destinationAddress: peerAddress
    })
  }

  render () {
    const getBalance = (blockchain, address) => {
      let unspentOutputs = blockchain.unspentOutputs
      let addressTxs = unspentOutputs[address]

      if (addressTxs === null || addressTxs === undefined) {
        console.log("ADDRESS HAD NO BALANCE!")
        return 0
      }

      let totalUnspent = 0
      addressTxs.forEach((vout) => {
        totalUnspent += vout.amount
      })

      return totalUnspent
    }

    return (
      <div>
        <Modal.Header style={{textOverflow: 'ellipsis', overflow: 'auto'}}>
          <Modal.Title style={{display: 'block', textOverflow: 'ellipsis', overflow: 'auto'}}>Send Coins</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault() }}>
            <FormGroup controlId='fromAddress'>
              <ControlLabel>Address to send from</ControlLabel>
              <FormControl componentClass='div' bsClass=''>
                <ToggleButtonGroup
                  vertical
                  block
                  type='radio'
                  name='sendingAddress'
                  value={this.state.sendingAddress}
                  onChange={this.onChangeSendingAddress}
                >
                  {this.props.availableAddresses.map((address) => {
                    return (
                      <ToggleButton 
                        key={address.publicKey} 
                        value={address}>
                        <Label bsStyle='success' style={{float: 'left', marginTop: 4}}>   {getBalance(this.props.blockchain, address.publicKey)}</Label>{address.publicKey.substr(0, 50)}...
                        </ToggleButton>
                    )
                  })}
                </ToggleButtonGroup>
              </FormControl>
            </FormGroup>

            <FormGroup
              controlId='formBasicText'
              validationState={this.getAddressValidationState()}
            >
              <ControlLabel>Address to send to</ControlLabel>
                <ToggleButtonGroup
                  type='radio'
                  name='destinationAddress'
                  vertical
                  block
                  value={this.state.destinationAddress}
                  onChange={this.onSelectDestinationPeer}
                  style={{marginBottom: 5}}
                >
                  {this.props.peers.map((peer, index) => {
                    return (
                      <ToggleButton
                        key={peer.easyrtcid}
                        disabled={peer.publicAddress == null}
                        value={peer.publicAddress}>
                        Peer {index + 1}: {peer.easyrtcid}
                      </ToggleButton>
                    )
                  })}
                </ToggleButtonGroup>
              <FormControl
                type='text'
                value={this.state.destinationAddress}
                placeholder='Public Key'
                onChange={this.handleAddressChange}
              />
              <FormControl.Feedback />
              <HelpBlock>Validation is based on whether this is a valid address.</HelpBlock>
            </FormGroup>

            <FormGroup
              controlId='formBasicText'
              validationState={this.getAmountValidationState()}
            >
              <ControlLabel>Amount to send</ControlLabel>
              <FormControl
                type='text'
                value={this.state.amount}
                placeholder='Amount'
                onChange={this.handleAmountChange}
              />
              <FormControl.Feedback />
              <HelpBlock>Validation is based on whether there are enough funds to spend.</HelpBlock>
            </FormGroup>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
          <Button bsStyle='primary'
            disabled={!this.getValidationState()}
            onClick={() => {
              this.props.sendCoin(this.state.sendingAddress.privateKey, this.state.destinationAddress, this.state.amount)
              this.props.onHide()
            }}
                >Send Coins</Button>
        </Modal.Footer>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    availableAddresses: state.wallet.addresses,
    blockchain: state.blockchain,
    peers: state.peers.peers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    sendCoin: (senderPrivateKey, destinationAddress, amount) => {
      const privateKeyBuffer = Buffer.from(senderPrivateKey, 'hex')
      const address = Buffer.from(destinationAddress, 'hex')
      dispatch(sendCoin(privateKeyBuffer, address, amount))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendCoinModal)

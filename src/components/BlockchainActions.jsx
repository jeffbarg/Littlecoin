/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { startMining, stopMining, disconnectNetwork } from '../actions'

import SendCoinModal from './SendCoinModal'
import ConnectNetworkModal from './ConnectNetworkModal'

import Block from '../models/Block'

import { Grid, Col, Button, Modal } from 'react-bootstrap'

class BlockchainActions extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showSendCoinModal: false,
      showConnectNetworkModal: false
    }

    this.closeSendCoinModal = this.closeSendCoinModal.bind(this)
    this.openSendCoinModal = this.openSendCoinModal.bind(this)

    this.closeConnectNetworkModal = this.closeConnectNetworkModal.bind(this)
    this.openConnectNetworkModal = this.openConnectNetworkModal.bind(this)
  }

  closeSendCoinModal () {
    this.setState({ showSendCoinModal: false })
  }

  openSendCoinModal () {
    this.setState({ showSendCoinModal: true })
  }

  closeConnectNetworkModal () {
    this.setState({ showConnectNetworkModal: false })
  }

  openConnectNetworkModal (e, alreadyJoinedNetwork) {
    e.target.blur()

    if (alreadyJoinedNetwork) {
      this.props.disconnectNetwork()
    } else {
      this.setState({ showConnectNetworkModal: true })
    }
  }

  render () {
    let miningSpinner = this.props.mining ? (<span class='glyphicon glyphicon-cog spinning pull-left' style={{marginTop: 2}} />) : undefined

    return (
      <Grid fluid className='BlockchainActions' style={{padding: 0, paddingBottom: 10}}>

        <Col sm={4} xs={12}>
          <Button style={{marginBottom: 10}}
            block
            bsStyle='success'
            onClick={this.openSendCoinModal}>
            Send Coins
          </Button>
        </Col>
        <Col sm={4} xs={12}>
          <Button style={{marginBottom: 10}}
            block
            bsStyle={this.props.mining ? 'danger' : 'primary'}
            disabled={!this.props.canMine}
            onClick={() => { this.props.toggleMining(this.props.mining) }}>
            {miningSpinner} {this.props.mining ? 'Stop Mining' : 'Start Mining'}
          </Button>
        </Col>
        <Col sm={4} xs={12}>
          <Button style={{marginBottom: 10}}
            block
            bsStyle={this.props.joinedNetwork ? 'network-disconnect' : 'info'}
            onClick={(e) => { this.openConnectNetworkModal(e, this.props.joinedNetwork) }}>
            {this.props.joinedNetwork? 'Disconnect From Network' : 'Connect To Network'}
          </Button>
        </Col>

        <Modal show={this.state.showConnectNetworkModal} onHide={this.closeConnectNetworkModal}>
          <ConnectNetworkModal onHide={this.closeConnectNetworkModal} />
        </Modal>

        <Modal show={this.state.showSendCoinModal} onHide={this.closeSendCoinModal}>
          <SendCoinModal onHide={this.closeSendCoinModal} />
        </Modal>
      </Grid>
    )
  }
}

const mapStateToProps = state => {
  return {
    mining: state.miner.mining,
    canMine: (new Block(state.miner.currentBlock)).hasCoinbase(),
    joinedNetwork: (state.peers.nodeId !== null) && (state.peers.nodeId !== null)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    disconnectNetwork: () => {
      dispatch(disconnectNetwork())
    },
    toggleMining: (mining) => {
      dispatch(mining ? stopMining() : startMining())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlockchainActions)

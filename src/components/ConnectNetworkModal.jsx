/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { joinNetwork } from '../actions'

import { Row, Col, Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'

class ConnectNetworkModal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      networkName: ''
    }

    this.handlePeerNameChange = this.handlePeerNameChange.bind(this)
  }

  handlePeerNameChange (e) {
    let networkName = e.target.value

    this.setState({
      networkName: networkName
    })
  }

  render () {
    return (
      <div>
        <Modal.Header style={{textOverflow: 'ellipsis', overflow: 'auto'}}>
          <Modal.Title style={{display: 'block', textOverflow: 'ellipsis', overflow: 'auto'}}>Network Connection</Modal.Title>
        </Modal.Header>

        <form onSubmit={(e) => { e.preventDefault() }}>
          <Modal.Body>
            <Button
              block
              bsStyle='primary'
              onClick={() => {
                this.props.connectNode('littlecoin.network')
                this.props.onHide()
              }}>Join Main Network</Button>
            <Row>
              <Col xs={5}><hr /></Col>
              <Col xs={2} style={{marginTop: 10, textAlign: 'center'}}><small>OR</small></Col>
              <Col xs={5}><hr /></Col>
            </Row>

            <FormGroup
              controlId='formBasicText'
              >
              <ControlLabel>Choose Custom Network Name to Connect To</ControlLabel>
              <FormControl
                type='text'
                value={this.state.networkName}
                placeholder='Network Name'
                onChange={this.handlePeerNameChange}
                />
              <FormControl.Feedback />
              <HelpBlock>Copy the Network ID that you want to join on the <code>LittleCoin</code> protocol.</HelpBlock>
              <HelpBlock>A "network" is simply an identifier that helps facilitate finding other peers who have joined the same network.  In a real-world public blockchain, you might start with a list of trusted peers' IP addresses and ask for their peers.  You might continue this process until you are convinced you have all (or enough) existing peers.</HelpBlock>
            </FormGroup>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.props.onHide}>Close</Button>
            <Button bsStyle='primary'
              type='submit'
              disabled={this.state.networkName == null || this.state.networkName.length === 0}
              onClick={() => {
                this.props.connectNode(this.state.networkName.toLowerCase())
                this.props.onHide()
              }}
                  >Connect</Button>
          </Modal.Footer>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
    connectNode: (networkName) => {
      dispatch(joinNetwork(networkName))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectNetworkModal)

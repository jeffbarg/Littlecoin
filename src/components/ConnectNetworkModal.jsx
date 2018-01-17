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

import { Modal, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'

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
            <FormGroup
              controlId='formBasicText'
              >
              <ControlLabel>Network Name to Connect To</ControlLabel>
              <FormControl
                type='text'
                value={this.state.networkName}
                placeholder='Network Name'
                onChange={this.handlePeerNameChange}
                autoFocus
                />
              <FormControl.Feedback />
              <HelpBlock>Copy the Network ID that you want to join on the <code>LittleCoin</code> protocol. (must be all lowercase letters, '.', or '-')</HelpBlock>
            </FormGroup>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.props.onHide}>Close</Button>
            <Button bsStyle='primary'
              type='submit'
              onClick={() => {
                this.props.connectNode(this.state.networkName)
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

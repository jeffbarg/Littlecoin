/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { connect } from 'react-redux'

import { Button, Navbar, ButtonToolbar, Overlay, Tooltip, Label } from 'react-bootstrap'

import copy from 'copy-to-clipboard'

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      nodeIdCopiedToClipboardTextDisplayed: false
    }

    this.getTarget = this.getTarget.bind(this)
    this.copyToClipboard = this.copyToClipboard.bind(this)
  }

  copyToClipboard (e) {
    let button = e.target

    // Unfocus the button after a minor delay for visual effect
    setTimeout(() => {
      button.blur()
    }, 50)

    let that = this

    // Copy node ID to clipboard
    copy(this.props.nodeId)

    // Show tooltip to alert user that data has been copied
    this.setState({
      nodeIdCopiedToClipboardTextDisplayed: true
    })

    setTimeout(() => {
      that.setState({
        nodeIdCopiedToClipboardTextDisplayed: false
      })
    }, 1250)
  }

  getTarget () {
    return ReactDOM.findDOMNode(this.refs.target)
  }

  render () {
    return (
      <header>
        <Navbar inverse collapseOnSelect style={{zIndex: 1030, borderRadius: 0}}>
          <Navbar.Header>
            <Navbar.Brand href='/'>
              <img alt='logo' src='./logo_40_40.png' className='rounded-circle' style={{marginRight: 10, height: 20, width: 20, float: 'left'}} />
                LittleCoin
              </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Navbar.Form pullLeft>
              <Button bsStyle='link' href='https://github.com/jeffbarg/littlecoin'>
                <Label>GitHub Source Code</Label>
              </Button>
            </Navbar.Form>
            <Navbar.Form pullRight>
              <ButtonToolbar>
                <Button
                  ref='target'
                  bsStyle='link'
                  type='submit'
                  disabled={!this.props.joinedNetwork}
                  onClick={this.copyToClipboard}>
                  Node ID <Label bsStyle={this.props.nodeId ? 'success' : 'danger'}>{this.props.nodeId ? this.props.nodeId : 'Disconnected'}</Label>
                </Button>
                <Overlay
                  show={this.state.nodeIdCopiedToClipboardTextDisplayed}
                  target={this.getTarget}
                  placement='bottom'
                  container={this}
                  containerPadding={20}
                  >
                  <Tooltip id='overload-bottom'>Node ID copied to clipboard!</Tooltip>
                </Overlay>
              </ButtonToolbar>
            </Navbar.Form>
          </Navbar.Collapse>
        </Navbar>
      </header>
    )
  }
}

const mapStateToProps = state => {
  return {
    nodeId: state.peers.nodeId,
    joinedNetwork: (state.peers.nodeId !== null) && (state.peers.nodeId !== null)
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button } from 'react-bootstrap'
import { clearBlockchain } from '../actions'

class BlockchainManagement extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <Button style={{marginBottom: 10}}
        block
        bsStyle='danger'
        onClick={() => { this.props.clearBlockchain() }}>
        Clear Blockchain
      </Button>
    )
  }
}
const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clearBlockchain: () => {
      if (window.confirm('Are you sure you want to delete your local blockchain data?  You will still sync with any other nodes you are connected to.')) {
        dispatch(clearBlockchain())
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlockchainManagement)

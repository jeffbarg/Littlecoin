/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'

import { startMining, stopMining } from '../actions'

import VisibleTransaction from './VisibleTransaction'

import { ListGroup } from 'react-bootstrap'
import Block from '../models/Block'

class MinerProgress extends Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  render () {
    return (
      <div>
        <h4>Transaction Queue</h4>
        <ListGroup>
          {this.props.currentBlock.transactions.map((transaction) => {
            return (
              <VisibleTransaction transaction={transaction} />
            )
          })}
        </ListGroup>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentBlock: new Block(state.miner.currentBlock),
    mining: state.miner.mining
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleMining: (mining) => {
      dispatch(mining ? stopMining() : startMining())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MinerProgress)

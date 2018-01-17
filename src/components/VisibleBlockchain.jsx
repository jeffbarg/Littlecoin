/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'

import VisibleBlock from './VisibleBlock'

import Blockchain from '../models/Blockchain'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

let reversed = (arr) => {
  let newArr = [...arr]
  newArr.reverse()
  return newArr
}

let VisibleBlockchain = ({ blockchain }) => {
  const numExpandedBlocks = 3

  return (
    <div>
      <Row>
        <ReactCSSTransitionGroup transitionName='example' transitionEnterTimeout={700} transitionLeaveTimeout={700}>
          {reversed(blockchain.blocks).map((block, index) => (
            <Col md={4} sm={6} xs={12} key={block.height}>
              <VisibleBlock block={block} defaultExpanded={block.height >= blockchain.blocks.length - numExpandedBlocks} />
            </Col>
        ))}
        </ReactCSSTransitionGroup>
      </Row>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    blockchain: new Blockchain(state.blockchain.blockchain)
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VisibleBlockchain)

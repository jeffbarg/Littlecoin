/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

import React from 'react'
import { Panel, FormGroup, FormControl, ControlLabel, ListGroup } from 'react-bootstrap'

import VisibleTransaction from './VisibleTransaction'

let VisibleBlock = ({ block, defaultExpanded }) => {
  let transactions = (block) => (
    <FormGroup>
      <ControlLabel>Transactions</ControlLabel>
      <ListGroup>
        {block.transactions.slice(0).map((transaction, index) => (
          <VisibleTransaction key={index} transaction={transaction} />
          ))}
      </ListGroup>
    </FormGroup>
  )
  return (
    <Panel
      defaultExpanded={defaultExpanded}
      bsStyle={block.isValid() ? 'default' : 'default'}
      eventKey={block.height}>

      <Panel.Heading>
        <Panel.Title toggle>{'Block #' + (block.height + 1)}</Panel.Title>
      </Panel.Heading>

      <Panel.Collapse>
        <Panel.Body>
          <FormGroup>
            <ControlLabel>Nonce</ControlLabel>
            <FormControl readOnly value={block.nonce} />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Previous Hash</ControlLabel>
            <FormControl readOnly value={block.previousHash ? block.previousHash.toString('hex') : ''} />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Hash</ControlLabel>
            <FormControl disabled value={block.hash().toString('hex')} />
          </FormGroup>

          {transactions(block)}
        </Panel.Body>
      </Panel.Collapse>
    </Panel>
  )
}

export default VisibleBlock

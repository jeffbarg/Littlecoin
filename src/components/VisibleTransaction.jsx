/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

import React from 'react'
import { InputGroup, ListGroupItem, FormControl } from 'react-bootstrap'

let VisibleTransaction = ({ transaction }) => {
  let getTxInput = (transaction) => {
    if (transaction.vins.length === 0) {
      return null
    }

    if (transaction.vouts.length === 1) {
      return '?'
    }

    return transaction.vouts[1].address.toString('hex')
  }

  let getTxOutput = (transaction) => {
    return transaction.vouts[0].address.toString('hex')
  }

  let getTxAmount = (transaction) => {
    return transaction.vouts[0].amount
  }

  return (
    <ListGroupItem bsStyle={transaction.isCoinbase() ? 'info' : null}>
      <InputGroup>
        <InputGroup.Addon><span class='glyphicon glyphicon-btc' /></InputGroup.Addon>
        <FormControl type='text' value={getTxAmount(transaction)} />
      </InputGroup>
      <InputGroup>
        <InputGroup.Addon><span>From:</span></InputGroup.Addon>
        <FormControl type='text' value={getTxInput(transaction)} />
      </InputGroup>
      <InputGroup>
        <InputGroup.Addon><span>To:</span></InputGroup.Addon>
        <FormControl type='text' value={getTxOutput(transaction)} />
      </InputGroup>
    </ListGroupItem>
  )
}

export default VisibleTransaction

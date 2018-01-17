/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

import topologicallyCombineReducers from 'topologically-combine-reducers'

import blockchain from './blockchain'
import miner from './miner'
import wallet from './wallet'
import peers from './peers'

const reducers = topologicallyCombineReducers({
  blockchain,
  miner,
  peers,
  wallet
}, {
  // Explicit State Dependencies
  miner: ['blockchain']
})

export default reducers

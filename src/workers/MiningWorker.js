/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

import type { Store } from 'redux'
import Block from '../models/Block'
import { minedBlock } from '../actions'

const NUM_MINE_ITERATIONS = 100

export const mine = (store: Store) => {
  const dispatch = store.dispatch.bind(store)
  const getState = store.getState.bind(store)

  let nonce = 1

  // This is run for NUM_MINE_ITERATIONS nonce attempts
  function iteration () {
    const state = getState()
    const currentBlock = new Block(state.miner.currentBlock)
    let isMining = state.miner.mining

    if (isMining) {
      // Start at current position and loop to last position.
      while (nonce % NUM_MINE_ITERATIONS !== 0) {
        if (currentBlock.isMined(nonce)) {
          let completeBlock = currentBlock.copy()
          completeBlock.nonce = nonce

          dispatch(minedBlock(completeBlock))
          nonce = 0
          break
        }
        nonce++
      }
    }

    nonce++

    setTimeout(iteration, 10) // Wait 10 ms to let the UI update.
  }

  // Start Iterating
  iteration()
}

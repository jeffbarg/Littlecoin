/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

import type { BlockData } from '../models/Block'

export const receivedBlockchain = (blockchainData: Array<BlockData>) => {
  return {
    type: 'RECEIVED_BLOCKCHAIN',
    blockchainData: blockchainData
  }
}

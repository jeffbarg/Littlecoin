/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

import Block from './Block'
import type { BlockData } from './Block'

export default class Blockchain {
  blocks: Array<Block>;

  constructor (blocks: Array<BlockData> = []) {
    this.blocks = blocks.map((blockData) => {
      return new Block(blockData)
    })
  }

  hasBlock (height: number): boolean {
    // Check if there is a block with this height
    return this.blocks.some((block) => {
      return (block.height === height)
    })
  }

  canAddBlock (block: Block): boolean {
    let length = this.blocks.length
    if (length === 0) {
      return true
    }

    let lastBlock: Block = this.blocks[length - 1]
    let previousHash = block.previousHash

    // If there are blocks in the chain, previous hash should be set
    if (previousHash === null || previousHash === undefined) {
      return false
    }

    return Buffer.compare(
      lastBlock.hash(),
      previousHash
    ) === 0
  }

  size (): number {
    return this.blocks.length
  }

  /**
   * Impure function to add a block to this blockchain
   */
  addBlock (block: Block) {
    this.blocks.push(block)
  }

  data (): Array<BlockData> {
    return this.blocks.map((block: Block) => { return block.data() })
  }
}

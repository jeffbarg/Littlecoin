/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

import React, { Component } from 'react'
import VisibleBlockchain from './VisibleBlockchain'
import AddressList from './AddressList'
import PeerList from './PeerList'
import MinerProgress from './MinerProgress'
import BlockchainActions from './BlockchainActions'
import Header from './Header'

import { Grid, Row, Col } from 'react-bootstrap'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { showModal: false }

    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
  }

  close () {
    this.setState({ showModal: false })
  }

  open () {
    this.setState({ showModal: true })
  }

  render () {
    return (
      <div className='App'>
        {/* First, navigational header */}
        <Header />

        {/* Then Actions */}
        <BlockchainActions />

        {/* Then the display of the current local state of the blockchain */}
        <Grid fluid>
          <Row>
            <Col sm={3} md={2} style={{zIndex: 1000, marginBottom: 20}}>
              <PeerList />
              <AddressList />
              <MinerProgress />
            </Col>

            <Col sm={9} md={10}>
              <VisibleBlockchain />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default App

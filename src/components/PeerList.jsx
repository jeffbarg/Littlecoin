/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

import React from 'react'
import { connect } from 'react-redux'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

let AddressList = ({ peers }) => {
  return (
    <div>
      <h4>Peers</h4>
      <ListGroup>
        {peers.map((peer, index) => (
          <div key={index}>
            <ListGroupItem header={(peer.easyrtcid === peer.username) ? 'Peer ' + (index + 1) : peer.username}
              style={{ wordBreak: 'break-all' }}>
              {peer.easyrtcid}
            </ListGroupItem>
          </div>
        ))}
      </ListGroup>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    peers: state.peers.peers
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

AddressList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddressList)

export default AddressList

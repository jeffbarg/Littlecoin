/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// @flow

const PeerActionCreators = require('./PeerActionCreators')
const SyncActionCreators = require('./SyncActionCreators')
const TransactionActionCreators = require('./TransactionActionCreators')
const MiningActionCreators = require('./MiningActionCreators')
const WalletActionCreators = require('./WalletActionCreators')

module.exports = {
  ...PeerActionCreators,
  ...SyncActionCreators,
  ...TransactionActionCreators,
  ...MiningActionCreators,
  ...WalletActionCreators
}

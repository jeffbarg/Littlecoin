/**
 * Copyright (c) Jeff Barg 2017
 *
 * All rights reserved.
 *
 * @author jeffbarg
 */

// React
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

// Redux
import { Provider } from 'react-redux'
import { compose, createStore, applyMiddleware } from 'redux'

// Rexux Middleware
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import littlecoinApp from './reducers'
import { selectMiningAddress, stopMining, joinNetwork, addAddress } from './actions'

import { mine } from './workers/MiningWorker'
import { setupNetwork } from './workers/NetworkWorker'

// Service worker
import registerServiceWorker from './registerServiceWorker'

// Styles
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';

const enhancer = compose(
  applyMiddleware(thunk, logger),
  persistState(['wallet', 'blockchain', 'miner'])
)

let store = createStore(
  littlecoinApp,
  enhancer
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// Always make sure miner is not mining to start (since all of miner state is persisted)
store.dispatch(stopMining())

// Default to mining to first address
if (store.getState().wallet.addresses.length > 0) {
  let firstAddress = store.getState().wallet.addresses[0].publicKey
  store.dispatch(selectMiningAddress(firstAddress))
} else {
  store.dispatch(addAddress())
}

mine(store)
setupNetwork(store)

registerServiceWorker()

# LittleCoin
![](https://img.shields.io/badge/stability-experimental-orange.svg)
![](https://img.shields.io/badge/style-standard-green.svg)

[LittleCoin](https://littlecoin.io/) is an in-browser cryptocurrency built on React, Redux, WebCrypto, and WebSockets/WebRTC.

[![](https://i.imgur.com/JYU5S80.png)](https://littlecoin.io/)

## Overview
#### This is not meant for real use, and should only be viewed as an educational project.

All operations (mining, sending and receiving coins) happen in browser.  The only server component to this project is an instance of an EasyRTC server to orchestrate peer-to-peer connections.  The latest version of this project is also kindly hosted on Netlify at [https://littlecoin.io/](https://littlecoin.io/).  Right now, this version supports only running a full node on a main network.  Future work will allow for light clients and seperate test networks for demonstration purposes.

The mining reward per block is 25 coins, and the difficulty for each block is 12 bits (three "0"s in the hexidecimal representation of the hash)

## Quick Start
This project was bootstrapped with create-react-app.  In order to run it locally:

1. Download the project.
2. Run ```npm install``` to download dependencies
3. Run ```npm run start``` and visit http://localhost:3000/

You can add an address and start mining coins. Try opening two different browsers (could be on different devices!) and connecting to the same network "test".  The blockchains should sync up in both browsers.

## Development Roadmap
- [x] Visualize a blockchain using bootstrap components
- [x] Mine coins in the background, receive coins, and send coins (transactions are broadcast to all nodes, but are not executed until mined into a block)
- [X] Sync on a main network with all other nodes
- [ ] Migrate from EasyRTC to a better WebRTC solution that allows full P2P connections
- [ ] Investigate use of Merkle trees to allow for "light" client (remove need to download full blockchain)
- [ ] Vary block difficulty to normalize mining time
- [ ] Improve UI / UX to make the project more usable
- [ ] Separate network "rooms" to allow test networks and a main network
- [ ] Add unit test suite
## FAQ
#### Is this actually useful?
Probably not.  This project was inspired by Anders Brownworth's very helpful [blockchain demo](https://anders.com/blockchain/), and I wanted to take the concept a little further (add the ability to actually make transactions and sync with a P2P network).  In theory, this is all that's required to make a fully-functional cryptocurrency.

The source code should hopefully be readable enough to follow along and learn about blockchains, but it likely has several bugs and is **not** guaranteed to be secure in any way.

#### How can I learn from this project?
The best way to learn about this project is to read the original [Bitcoin paper](https://bitcoin.org/bitcoin.pdf), and try to understand how each part is implemented in the LittleCoin source code.  

Some aspects of the paper ("light" clients, merkle tree transaction verification, etc...) are not yet implemented yet.

## Contributing
[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

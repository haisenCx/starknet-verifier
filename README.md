## Installation

1. Clone this repo:

```console
git clone git@github.com:reddio-com/starknet-verifier.git
```

2. Install NPM packages:

```console
cd starknet-verifier
npm install
```

3. .sepolia.env

```console
export HARDHAT_ENV=sepolia
export RPC_PROVIDER=https://sepolia.infura.io/v3/80b72ad34e16495595abeb6ccc30255a
export ADMIN_PRIVATE_KEY=0x57ecc1d002c1fff33077b1ab5ac2900a21a35bc0493b22adc9003967080bb245
export ETHERSCAN_KEY=https://sepolia.etherscan.io
```


4. Deploy

```console
npm run deploy:sepolia
```

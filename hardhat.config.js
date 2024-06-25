/* global ethers task */
require('@nomicfoundation/hardhat-toolbox');
const { RPC_PROVIDER, ADMIN_PRIVATE_KEY } = process.env;

module.exports = {
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: RPC_PROVIDER,
        accounts: [ADMIN_PRIVATE_KEY],
      },
    },

    sepolia: {
      url: RPC_PROVIDER,
      accounts: [ADMIN_PRIVATE_KEY],
    },
    mainnet: {
      url: RPC_PROVIDER,
      accounts: [ADMIN_PRIVATE_KEY],
    },
  },
  mocha: {
    timeout: 90000, // timeout in milliseconds
  },
  solidity: '0.6.12',
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
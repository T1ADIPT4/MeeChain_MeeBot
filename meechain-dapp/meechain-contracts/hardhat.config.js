
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Fuse Mainnet
    fuse: {
      url: "https://rpc.fuse.io/",
      chainId: 122,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 10000000000, // 10 gwei
    },
    // Fuse Spark Testnet
    spark: {
      url: "https://rpc.fusespark.io/",
      chainId: 123,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 10000000000, // 10 gwei
    },
    // Local development
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    // Hardhat network for testing
    hardhat: {
      chainId: 31337,
      mining: {
        auto: true,
        interval: 0
      }
    }
  },
  etherscan: {
    // Fuse Explorer API (if available)
    apiKey: {
      fuse: "YOUR_FUSE_API_KEY"
    },
    customChains: [
      {
        network: "fuse",
        chainId: 122,
        urls: {
          apiURL: "https://explorer.fuse.io/api",
          browserURL: "https://explorer.fuse.io"
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  mocha: {
    timeout: 60000 // 60 seconds
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

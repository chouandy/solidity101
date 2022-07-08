import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import 'hardhat-deploy';

import { HardhatUserConfig } from 'hardhat/config';
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0,
      allowUnlimitedContractSize: true,
      accounts: {
        mnemonic: 'dice shove sheriff police boss indoor hospital vivid tenant method game matter',
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
      },
      forking: {
        url: 'https://mainnet.infura.io/v3/fdea71e51fa145c4a6d6c2e94670c04f',
        blockNumber: 15000000,
      },
    },
    'mainnet-beta': {
      url: process.env.MAINNET_BETA_HTTP_RPC_URL,
      accounts: process.env.MAINNET_BETA_DEPLOYER_PRIVATE_KEY ? [process.env.MAINNET_BETA_DEPLOYER_PRIVATE_KEY] : [],
      gas: 6000000,
    },
  },
};

export default config;

//For LocalHost

// const fs = require('fs');

// require('@nomiclabs/hardhat-waffle');

// const privateKey = fs.readFileSync('.secret').toString().trim();

// module.exports = {
//   defaultNetwork: 'goerli',
//   networks: {
//     goerli: {
//       url: process.env.NEXT_PUBLIC_ALCHEMY_API_URL,
//       accounts: [privateKey],
//     },
//   },
//   solidity: '0.8.17',
// };

//For Production
require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
	defaultNetwork: 'goerli',
	networks: {
		hardhat: {},
		goerli: {
			url: process.env.NEXT_PUBLIC_ALCHEMY_API_URL,
			accounts: [process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY],
		},
	},
	solidity: {
		version: '0.8.17',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	paths: {
		sources: './contracts',
		tests: './test',
		cache: './cache',
		artifacts: './artifacts',
	},
	mocha: {
		timeout: 20000,
	},
};


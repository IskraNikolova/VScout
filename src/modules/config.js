export default {
  network: {
    ip: 'api.avax.network',
    protocol: 'https',
    networkId: 1,
    chainId: 'X',
    port: 443,
    cChainId: 43114,
    explorerApiBaseUrl: 'https://explorerapi.avax-dev.network/',
    contract: '0x95042281AF6566Fc6748f28263CeEecaEfB4D2B4',
    endpointCChain: 'api.avax.network/ext/bc/C/rpc',
    address: '0x4aBeF613822Fb2031D897E792f89C896dDaFC466',
    admin: 'X-avax18u9njlrvx76ap6rpdxsf27v7cawu278rw83yyf',
    defaultSubnetID: '11111111111111111111111111111111LpoYY',
    coinApiBase: 'https://rest.coinapi.io/v1/assets/',
    endpointUrls: [
      // { name: 'Avalanche Mainnet', url: 'https://api.avax.network:443/', urlView: '' },
      { name: 'Avalanche Mainnet', url: 'https://vscout.io/vscout-api/', urlView: '' },
      { name: 'Localhost', url: 'http://127.0.0.1:9650/', urlView: 'http://127.0.0.1:9650/' },
      { name: 'Fuji Testnet', url: 'https://api.avax-test.network:443/', urlView: 'https://api.avax-test.network:443/' }
    ]
  }
}

// PROD
// cChainId: 43114,
// explorerApiBaseUrl: 'https://explorerapi.avax-dev.network/',
// contract: 0x95042281AF6566Fc6748f28263CeEecaEfB4D2B4
// endpointCChain: 'api.avax.network/ext/bc/C/rpc',
// address: '0x4aBeF613822Fb2031D897E792f89C896dDaFC466',
// admin: 'X-avax18u9njlrvx76ap6rpdxsf27v7cawu278rw83yyf',

// DEV
// cChainId: 43113,
// explorerApiBaseUrl: 'https://explorerapi.avax-test.network/',
// contract: '0xeF817ea18ec2c6BcE52C8Fb371bE116e219D63D5'
// endpointCChain: 'api.avax-test.network/ext/bc/C/rpc',
// address: '0x4aBeF613822Fb2031D897E792f89C896dDaFC466',
// admin: 'X-fuji18u9njlrvx76ap6rpdxsf27v7cawu278rz44mgk',

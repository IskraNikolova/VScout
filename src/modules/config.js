export default {
  network: {
    ip: 'api.avax.network',
    protocol: 'https',
    networkId: 1,
    chainId: 'X',
    port: 443,
    cChainId: 43114,
    explorerApiBaseUrl: 'https://explorerapi.avax-dev.network/',
    contract: '0x209D694B5c46B36CBf287BB43cDc999410A2c766',
    endpointCChain: 'api.avax.network/ext/bc/C/rpc',
    address: '0x4aBeF613822Fb2031D897E792f89C896dDaFC466',
    admin: 'X-avax18u9njlrvx76ap6rpdxsf27v7cawu278rw83yyf',
    defaultSubnetID: '11111111111111111111111111111111LpoYY',
    coinApiBase: 'https://rest.coinapi.io/v1/assets/',
    endpointUrls: [
      { name: 'Avalanche Mainnet', url: 'https://api.avax.network:443/', urlView: 'https://api.avax.network:443/' },
      { name: 'Localhost', url: 'http://127.0.0.1:9650/', urlView: 'http://127.0.0.1:9650/' },
      { name: 'Fuji Testnet', url: 'https://api.avax-test.network:443/', urlView: 'https://api.avax-test.network:443/' }
    ]
  }
}

// PROD
// cChainId: 43114,
// explorerApiBaseUrl: 'https://explorerapi.avax-dev.network/',
// contract: '0x209D694B5c46B36CBf287BB43cDc999410A2c766',
// endpointCChain: 'api.avax.network/ext/bc/C/rpc',
// address: '0x4aBeF613822Fb2031D897E792f89C896dDaFC466',
// admin: 'X-avax18u9njlrvx76ap6rpdxsf27v7cawu278rw83yyf',

// DEV
// explorerApiBaseUrl: 'https://explorerapi.avax-test.network/',
// contract: '0x46897F5a28D5fafF39A423780A758FB2E8540Bb2',
// endpointCChain: 'api.avax-test.network/ext/bc/C/rpc',
// address: '0x4aBeF613822Fb2031D897E792f89C896dDaFC466',
// admin: 'X-fuji18u9njlrvx76ap6rpdxsf27v7cawu278rz44mgk',

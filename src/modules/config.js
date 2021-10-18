export default {
  network: {
    ip: 'api.avax.network',
    protocol: 'https',
    networkId: 1,
    chainId: 'X',
    port: 443,
    cChainId: 43114,
    explorerApiBaseUrl: 'https://explorerapi.avax.network/',
    contract: '0x95042281AF6566Fc6748f28263CeEecaEfB4D2B4',
    endpointCChain: 'vscout.io/ws',
    address: '0x4aBeF613822Fb2031D897E792f89C896dDaFC466',
    admin: 'X-avax18u9njlrvx76ap6rpdxsf27v7cawu278rw83yyf',
    defaultSubnetID: '11111111111111111111111111111111LpoYY',
    coinApiBase: 'https://rest.coinapi.io/v1/assets/',
    endpointUrls: [
      { name: 'Avalanche Mainnet', url: 'https://vscout.io/vscout-api/', urlView: '' },
      { name: 'Localhost', url: 'http://127.0.0.1:9650/', urlView: 'http://127.0.0.1:9650/' }
      // { name: 'Fuji Testnet', url: 'https://api.avax-test.network:443/', urlView: 'https://api.avax-test.network:443/' }
    ]
  }
}

// PROD
// cChainId: 43114,
// explorerApiBaseUrl: 'https://explorerapi.avax-dev.network/',
// contract: '0x95042281AF6566Fc6748f28263CeEecaEfB4D2B4',
// // endpointCChain: 'vscout.io/vscout-api/ext/bc/C/rpc',
// // endpointCChain: 'api.avax.network/ext/bc/C/ws',
// endpointCChain: 'vscout.io/ws',
// address: '0x4aBeF613822Fb2031D897E792f89C896dDaFC466',
// admin: 'X-avax18u9njlrvx76ap6rpdxsf27v7cawu278rw83yyf',

// DEV
// cChainId: 43113,
// explorerApiBaseUrl: 'https://explorerapi.avax-test.network/',
// contract: '0x8087A3b850Bd391315FefEC7a754e6024517beAE',
// endpointCChain: '127.0.0.1:9650/ext/bc/C/ws',
// address: '0x4aBeF613822Fb2031D897E792f89C896dDaFC466',
// admin: 'X-fuji18u9njlrvx76ap6rpdxsf27v7cawu278rz44mgk',

const { network } = require('./../../modules/config').default

export default function () {
  return {
    theme: 'dark',
    peersMap: {},
    inData: {},
    addressBalance: {},
    nodeID: '',
    subnets: [],
    nodesVersions: {},
    blockchains: [],
    stakedAVAX: 0,
    validatedStake: 0,
    delegatedStake: 0,
    endpointsMemory: [],
    defaultValidators: [],
    isBlockchainView: true,
    subnetID: network.defaultSubnetID,
    networkEndpoint: network.endpointUrls[0],
    peers: {},
    nodeInfo: {
      networkID: '',
      networkName: '',
      nodeVersion: 'avalanche/'
    },
    currentCurrency: 'usd',
    currenciesPriceList: {},
    high_24h: {},
    low_24h: {},
    price_change_24h: {},
    price_change_24h_percentage: {}
  }
}

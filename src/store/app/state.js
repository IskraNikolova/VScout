const { network } = require('./../../modules/config')
  .default

export default function () {
  return {
    assets: [],
    theme: 'dark',
    defaultValidators: [],
    notificationNode: {},
    notifications: [],
    inData: {},
    addressBalance: {},
    nodeID: '',
    subnets: [],
    nodesVersions: {},
    blockchains: [],
    stakedAVAX: 0,
    validatedStake: 0,
    delegatedStake: 0,
    isBlockchainView: true,
    subnetID: network.defaultSubnetID,
    networkEndpoint: network.endpointUrls[0],
    currentCurrency: 'usd',
    nodeInfo: {
      networkID: '',
      networkName: '',
      nodeVersion: 'avalanche/'
    }
  }
}

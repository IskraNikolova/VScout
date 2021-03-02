const { network } = require('./../../modules/config').default

export default function () {
  return {
    theme: 'dark',
    notificationNode: {},
    notifications: [],
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
    defaultValidators: [],
    isBlockchainView: true,
    subnetID: network.defaultSubnetID,
    networkEndpoint: network.endpointUrls[0],
    peers: {},
    nodeInfo: {
      networkID: '',
      networkName: '',
      nodeVersion: 'avalanche/'
    }
  }
}

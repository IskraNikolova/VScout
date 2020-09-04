const { network } = require('./../../modules/config').default

export default function () {
  return {
    nodeID: '',
    subnets: [],
    subnetID: network.defaultSubnetID,
    stakedAVA: 0,
    validatedStake: 0,
    delegatedStake: 0,
    nodeHealth: {},
    validators: [],
    delegators: [],
    blockchains: [],
    assetsCount: 1,
    endpointsMemory: [],
    pendingValidators: [],
    defaultValidators: [],
    pendingDelegators: [],
    isBlockchainView: true,
    hasNetworkConnection: true,
    hasNodeConnection: true,
    networkEndpoint: network.endpointUrls[0],
    nodeInfo: {
      networkID: '4',
      networkName: '',
      nodeVersion: 'avalanche/',
      peers: []
    }
  }
}

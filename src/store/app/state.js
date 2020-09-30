const { network } = require('./../../modules/config').default
import { BN } from 'avalanche'

export default function () {
  return {
    currentSupply: new BN(1),
    nodeID: '',
    height: 0,
    subnets: [],
    subnetID: network.defaultSubnetID,
    stakedAVA: 0,
    validatedStake: 0,
    delegatedStake: 0,
    nodeHealth: {},
    validators: [],
    delegators: [],
    delegationsCount: 0,
    blockchains: [],
    assetsCount: 0,
    endpointsMemory: [],
    pendingValidators: [],
    defaultValidators: [],
    pendingDelegators: [],
    isBlockchainView: true,
    hasNetworkConnection: true,
    hasNodeConnection: true,
    networkEndpoint: network.endpointUrls[0],
    nodeInfo: {
      networkID: '',
      networkName: '',
      nodeVersion: 'avalanche/',
      peers: []
    }
  }
}

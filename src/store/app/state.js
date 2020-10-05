const { network } = require('./../../modules/config').default
import { BN } from 'avalanche'

export default function () {
  return {
    height: 0,
    nodeID: '',
    subnets: [],
    stakedAVA: 0,
    nodeHealth: {},
    validators: [],
    delegators: [],
    avaxUsdPrice: 0,
    blockchains: [],
    assetsCount: 0,
    validatedStake: 0,
    endpointsMemory: [],
    pendingValidators: [],
    defaultValidators: [],
    pendingDelegators: [],
    isBlockchainView: true,
    hasNodeConnection: true,
    currentSupply: new BN(1),
    hasNetworkConnection: true,
    subnetID: network.defaultSubnetID,
    networkEndpoint: network.endpointUrls[0],
    nodeInfo: {
      networkID: '',
      networkName: '',
      nodeVersion: 'avalanche/',
      peers: []
    }
  }
}

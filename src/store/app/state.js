const { network } = require('./../../modules/config').default

export default function () {
  return {
    nodeID: '',
    subnets: [],
    subnetID: '',
    stakedAVA: 0,
    nodeHealth: {},
    validators: [],
    delegators: [],
    blockchains: [],
    prevTotalTxs: 0,
    totalTxsCount: 0,
    txHKey: 'minute',
    currentSubnet: {},
    assetsByChain: {},
    txsHistoryState: {},
    endpointsMemory: [],
    pendingValidators: [],
    pendingDelegators: [],
    currentBlockchain: {},
    txsFor24H: {
      transactionCount: 0,
      transactionVolume: 0
    },
    prevTxsFor24H: {
      transactionCount: 0,
      transactionVolume: 0
    },
    isBlockchainView: true,
    hasNetworkConnection: true,
    networkEndpoint: network.endpointUrls[0],
    nodeInfo: {
      networkID: '',
      networkName: '',
      nodeVersion: '',
      peers: []
    }
  }
}

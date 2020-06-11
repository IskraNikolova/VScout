const { network } = require('./../../modules/config').default

export default function () {
  return {
    nodeID: '',
    subnets: [],
    nodeHealth: {},
    validators: [],
    delegators: [],
    blockchains: [],
    prevTotalTxs: 0,
    totalTxsCount: 0,
    txHKey: 'minute',
    currentSubnet: {},
    assetsByChain: {},
    subnetID: '',
    isBlockchainView: true,
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
    networkEndpoint: network.endpointUrls[0]
  }
}

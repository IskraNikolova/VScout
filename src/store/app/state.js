const { network } = require('./../../modules/config').default

export default function () {
  return {
    validators: [],
    pendingValidators: [],
    lastBlock: {},
    blockTime: 0,
    lastBlockTime: [],
    blockchains: [],
    subnetID: network.defaultSubnetID,
    txsFor24H: { transactionCount: 0, transactionVolume: 0 },
    totalTxsCount: 0,
    txsHistory: [],
    txHKey: 'day'
  }
}

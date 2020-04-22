const { network } = require('./../../modules/config').default

export default function () {
  return {
    validators: [],
    lastBlock: {},
    blockTime: 0,
    lastBlockTime: [],
    blockchains: [],
    subnetID: network.defaultSubnetID
  }
}

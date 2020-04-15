const { network } = require('./../../modules/config').default

export default function () {
  return {
    validators: [],
    lastBlock: {},
    blockchains: [],
    subnetID: network.defaultSubnetID
  }
}

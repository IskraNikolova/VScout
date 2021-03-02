const { network } = require('../../modules/config').default

export default function () {
  return {
    endpointsMemory: [],
    isBlockchainView: true,
    peers: {},
    peersMap: {},
    networkEndpoint: network.endpointUrls[0],
    currentSubnet: { id: network.defaultSubnetID },
    currentBlockchain: { subnetID: network.defaultSubnetID, name: 'X-Chain' }
  }
}

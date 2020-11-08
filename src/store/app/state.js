const { network } = require('./../../modules/config').default
import { BN } from 'avalanche'

export default function () {
  return {
    addressBalance: {},
    currentCurrency: 'usd',
    height: 0,
    nodeID: '',
    subnets: [],
    stakedAVA: 0,
    nodeHealth: {},
    validators: [],
    delegators: [],
    currenciesPriceList: {},
    high_24h: {},
    low_24h: {},
    price_change_24h: {},
    price_change_24h_percentage: {},
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

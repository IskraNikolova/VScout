const { network } = require('../../modules/config').default

import {
  SET_ENDPOINT,
  SET_CURRENT_SUBNET,
  SET_ENDPOINTS_MEMORY,
  SET_CURRENT_BLOCKCHAIN,
  GET_NODE_PEERS,
  GET_INFO_PEERS,
  REMOVE_ENDPOINTS_MEMORY
} from './types'

const mutations = {
  [GET_NODE_PEERS]: (state, { peers }) => {
    state.peers = peers
  },
  [GET_INFO_PEERS]: (state, { peersMap }) => {
    state.peersMap = peersMap
  },
  [SET_ENDPOINT]: (state, { endpoint }) => {
    state.networkEndpoint = endpoint
  },
  [SET_CURRENT_SUBNET]: (state, { subnet }) => {
    state.currentSubnet = subnet
    state.isBlockchainView = false
    state.subnetID = subnet.id
  },
  [SET_ENDPOINTS_MEMORY]: (state, { endpoint }) => {
    if (state.endpointsMemory.includes(endpoint) ||
    network.endpointUrls.find(e => e.url === endpoint)) return
    state.endpointsMemory.push(endpoint)
  },
  [SET_CURRENT_BLOCKCHAIN]: (state, { blockchain }) => {
    state.currentBlockchain = blockchain
    state.isBlockchainView = true
    state.subnetID = blockchain.subnetID
  },
  [REMOVE_ENDPOINTS_MEMORY]: (state, { endpoint }) => {
    state.endpointsMemory = state.endpointsMemory.filter(a => a !== endpoint)
  }
}

export default mutations

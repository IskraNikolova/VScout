const { network } = require('./../../modules/config').default
import Vue from 'vue'

import {
  SET_NODE_ID,
  SET_SUBNETS,
  SET_ENDPOINT,
  SET_TOTAL_TXS,
  SET_VALIDATORS,
  SET_BLOCKCHAINS,
  SET_TXS_HISTORY,
  SET_NODE_HEALTH,
  SET_CURRENT_SUBNET,
  SET_TX_FOR_24_HOURS,
  SET_PREVIOUS_24_TXS,
  SET_ENDPOINTS_MEMORY,
  SET_PENDING_VALIDATORS,
  SET_CURRENT_BLOCKCHAIN,
  SET_PREVIOUS_TOTAL_TXS,
  REMOVE_ENDPOINTS_MEMORY,
  SET_ASSETS_BY_BLOCKCHAINS
} from './types'

const mutations = {
  [SET_NODE_ID]: (state, { nodeID }) => {
    state.nodeID = nodeID
  },
  [SET_SUBNETS]: (state, { subnets }) => {
    state.subnets = subnets
  },
  [SET_ENDPOINT]: (state, { endpoint }) => {
    state.networkEndpoint = endpoint
  },
  [SET_TOTAL_TXS]: (state, { totalTxsCount }) => {
    state.totalTxsCount = totalTxsCount
  },
  [SET_VALIDATORS]: (state, { validators }) => {
    state.validators = validators
  },
  [SET_BLOCKCHAINS]: (state, { blockchains }) => {
    state.blockchains = blockchains
  },
  [SET_TXS_HISTORY]: (state, { key, txsHistory }) => {
    state.txHKey = key
    if (!txsHistory) return
    state.txsHistoryState[key] = txsHistory
  },
  [SET_NODE_HEALTH]: (state, { nodeID, nodeHealth }) => {
    if (!state.nodeHealth[nodeID]) Vue.set(state.nodeHealth, nodeID, {})
    state.nodeHealth[nodeID] = nodeHealth
  },
  [SET_CURRENT_SUBNET]: (state, { subnet }) => {
    state.currentSubnet = subnet
    state.isBlockchainView = false
    state.subnetID = subnet.id
  },
  [SET_TX_FOR_24_HOURS]: (state, { txsFor24H }) => {
    state.txsFor24H = txsFor24H
  },
  [SET_PREVIOUS_24_TXS]: (state, { prevTxsFor24H }) => {
    state.prevTxsFor24H = prevTxsFor24H
  },
  [SET_ENDPOINTS_MEMORY]: (state, { endpoint }) => {
    if (state.endpointsMemory.includes(endpoint) ||
    network.endpointUrls.indexOf(endpoint) > 1) return
    state.endpointsMemory.push(endpoint)
  },
  [SET_PENDING_VALIDATORS]: (state, { validators }) => {
    state.pendingValidators = validators
  },
  [SET_CURRENT_BLOCKCHAIN]: (state, { blockchain }) => {
    state.currentBlockchain = blockchain
    state.isBlockchainView = true
    state.subnetID = blockchain.subnetID
  },
  [SET_PREVIOUS_TOTAL_TXS]: (state, { prevTotalTxs }) => {
    state.prevTotalTxs = prevTotalTxs
  },
  [REMOVE_ENDPOINTS_MEMORY]: (state, { endpoint }) => {
    state.endpointsMemory = state.endpointsMemory.filter(a => a !== endpoint)
  },
  [SET_ASSETS_BY_BLOCKCHAINS]: (state, { assetsByChain }) => {
    state.assetsByChain = assetsByChain
    Object.keys(state.assetsByChain).map((key) => {
      state.assetsByChain[key].sort((a, b) => {
        return Number(b.currentSupply) - Number(a.currentSupply)
      })
    })
  }
}

export default mutations

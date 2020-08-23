import Vue from 'vue'
import { round } from './../../utils/commons'

import { VMDict } from './../../utils/constants'

const { network } = require('./../../modules/config').default

import {
  SET_NODE_ID,
  SET_SUBNETS,
  SET_SUBNET_ID,
  SET_ENDPOINT,
  SET_NODE_INFO,
  SET_VALIDATORS,
  SET_STAKED_AVA,
  SET_DELEGATORS,
  SET_BLOCKCHAINS,
  SET_NODE_HEALTH,
  SET_NETWORK_STATUS,
  SET_CURRENT_SUBNET,
  SET_ENDPOINTS_MEMORY,
  SET_DEFAULT_VALIDATORS,
  SET_PENDING_DELEGATORS,
  SET_PENDING_VALIDATORS,
  SET_CURRENT_BLOCKCHAIN,
  REMOVE_ENDPOINTS_MEMORY,
  SET_ASSETS_BY_BLOCKCHAINS
} from './types'

const mutations = {
  [SET_NETWORK_STATUS]: (state, { hasNetworkConnection }) => {
    state.hasNetworkConnection = hasNetworkConnection
  },
  [SET_NODE_ID]: (state, { nodeID }) => {
    state.nodeID = nodeID
  },
  [SET_SUBNETS]: (state, { subnets }) => {
    state.subnets = subnets
  },
  [SET_NODE_INFO]: (state, { nodeInfo }) => {
    state.nodeInfo = nodeInfo
  },
  [SET_ENDPOINT]: (state, { endpoint }) => {
    if (!endpoint) endpoint = network.endpointUrls[0]
    state.networkEndpoint = endpoint
  },
  [SET_VALIDATORS]: (state, { validators }) => {
    state.validators = validators
  },
  [SET_STAKED_AVA]: (state, { all, validatedStake, delegatedStake }) => {
    state.stakedAVA = round(all, 100)
    state.validatedStake = round(validatedStake, 1000)
    state.delegatedStake = round(delegatedStake, 1000)
  },
  [SET_DELEGATORS]: (state, { delegators }) => {
    state.delegators = delegators
  },
  [SET_BLOCKCHAINS]: (state, { blockchains }) => {
    blockchains = blockchains.map(b => {
      b.vmName = VMDict[b.vmID].name
      return b
    })
    state.blockchains = blockchains
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
  [SET_SUBNET_ID]: (state, { subnetID }) => {
    state.subnetID = subnetID
  },
  [SET_ENDPOINTS_MEMORY]: (state, { endpoint }) => {
    if (state.endpointsMemory.includes(endpoint) ||
    network.endpointUrls.indexOf(endpoint) > 1) return
    state.endpointsMemory.push(endpoint)
  },
  [SET_DEFAULT_VALIDATORS]: (state, { defaultValidators }) => {
    state.defaultValidators = defaultValidators
  },
  [SET_PENDING_VALIDATORS]: (state, { validators }) => {
    state.pendingValidators = validators
  },
  [SET_PENDING_DELEGATORS]: (state, { delegators }) => {
    state.pendingDelegators = delegators
  },
  [SET_CURRENT_BLOCKCHAIN]: (state, { blockchain }) => {
    state.currentBlockchain = blockchain
    state.isBlockchainView = true
    state.subnetID = blockchain.subnetID
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

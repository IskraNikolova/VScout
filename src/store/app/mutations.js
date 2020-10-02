import Vue from 'vue'

import { VMDict } from './../../utils/constants'

import {
  SET_NODE_ID,
  SET_SUBNETS,
  SET_HEIGHT,
  SET_SUBNET_ID,
  SET_NODE_INFO,
  SET_VALIDATORS,
  SET_STAKED_AVA,
  SET_DELEGATORS,
  SET_BLOCKCHAINS,
  SET_NODE_HEALTH,
  SET_ASSETS_COUNT,
  SET_NETWORK_STATUS,
  SET_CURRENT_SUPPLY,
  SET_DEFAULT_VALIDATORS,
  SET_PENDING_DELEGATORS,
  SET_PENDING_VALIDATORS
} from './types'

const mutations = {
  [SET_NETWORK_STATUS]: (state, { hasNetworkConnection }) => {
    state.hasNetworkConnection = hasNetworkConnection
  },
  [SET_CURRENT_SUPPLY]: (state, { currentSupply }) => {
    state.currentSupply = currentSupply
  },
  [SET_NODE_ID]: (state, { nodeID }) => {
    state.nodeID = nodeID
  },
  [SET_SUBNETS]: (state, { subnets }) => {
    state.subnets = subnets
  },
  [SET_HEIGHT]: (state, { height }) => {
    state.height = height
  },
  [SET_NODE_INFO]: (state, { nodeInfo }) => {
    state.nodeInfo = nodeInfo
  },
  [SET_VALIDATORS]: (state, { validators }) => {
    state.validators = validators
  },
  [SET_STAKED_AVA]: (state, { all, validatedStake, delegatedStake }) => {
    state.stakedAVA = all
    state.validatedStake = validatedStake
    state.delegatedStake = delegatedStake
  },
  [SET_DELEGATORS]: (state, { delegators }) => {
    state.delegators = delegators
  },
  [SET_BLOCKCHAINS]: (state, { blockchains }) => {
    blockchains = blockchains.map(b => {
      b.vmName = VMDict[b.vmID].name
      b.vmDocumentation = VMDict[b.vmID].documentation
      return b
    })
    state.blockchains = blockchains
  },
  [SET_NODE_HEALTH]: (state, { nodeID, nodeHealth }) => {
    if (!state.nodeHealth[nodeID]) Vue.set(state.nodeHealth, nodeID, {})
    state.nodeHealth[nodeID] = nodeHealth
  },
  [SET_SUBNET_ID]: (state, { subnetID }) => {
    state.subnetID = subnetID
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
  [SET_ASSETS_COUNT]: (state, { assetsCount }) => {
    state.assetsCount = assetsCount
  }
}

export default mutations

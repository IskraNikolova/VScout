import Vue from 'vue'

import {
  SET_CODE,
  GET_TX_AVM,
  GET_HEIGHT,
  SET_TX_HASH_EVM,
  GET_CURRENT_SUPPLY,
  SET_NETWORK_STATUS,
  GET_NODE_HEALTH,
  SET_DELEGATORS,
  SET_VALIDATORS,
  SET_VALIDATOR,
  SET_PENDING_VALIDATORS,
  SET_PENDING_DELEGATORS,
  SET_ASSETS_COUNT
} from './types'

const mutations = {
  [SET_CODE]: (state, { code }) => {
    state.code = code
  },
  [GET_TX_AVM]: (state, { txAVM }) => {
    state.txAVM = txAVM
  },
  [GET_HEIGHT]: (state, { height }) => {
    state.height = height
  },
  [SET_TX_HASH_EVM]: (state, { txHash }) => {
    state.txHash = txHash
  },
  [GET_CURRENT_SUPPLY]: (state, { currentSupply }) => {
    state.currentSupply = currentSupply
  },
  [SET_NETWORK_STATUS]: (state, { hasNetworkConnection }) => {
    state.hasNetworkConnection = hasNetworkConnection
  },
  [GET_NODE_HEALTH]: (state, { nodeID, nodeHealth }) => {
    if (!state.nodeHealth[nodeID]) Vue.set(state.nodeHealth, nodeID, {})
    state.nodeHealth[nodeID] = nodeHealth
  },
  [SET_PENDING_VALIDATORS]: (state, { validators }) => {
    state.pendingValidators = validators
  },
  [SET_PENDING_DELEGATORS]: (state, { delegators }) => {
    state.pendingDelegators = delegators
  },
  [SET_ASSETS_COUNT]: (state, { assetsCount }) => {
    state.assetsCount = assetsCount
  },
  [SET_DELEGATORS]: (state, { delegators }) => {
    state.delegators = delegators
  },
  [SET_VALIDATORS]: (state, { validators }) => {
    state.validators = validators
  },
  [SET_VALIDATOR]: (state, { validator }) => {
    state.validator = validator
  }
}

export default mutations

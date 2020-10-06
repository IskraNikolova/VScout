import Vue from 'vue'

import { VMDict } from './../../utils/constants'

import {
  GET_NODE_ID,
  GET_SUBNETS,
  GET_HEIGHT,
  SET_BALANCE,
  SET_SUBNET_ID,
  GET_NODE_INFO,
  SET_VALIDATORS,
  SET_STAKED_AVA,
  SET_DELEGATORS,
  GET_BLOCKCHAINS,
  GET_AVAX_PRICE,
  GET_NODE_HEALTH,
  SET_ASSETS_COUNT,
  SET_NETWORK_STATUS,
  GET_CURRENT_SUPPLY,
  SET_DEFAULT_VALIDATORS,
  SET_PENDING_DELEGATORS,
  SET_PENDING_VALIDATORS
} from './types'

const mutations = {
  [SET_NETWORK_STATUS]: (state, { hasNetworkConnection }) => {
    state.hasNetworkConnection = hasNetworkConnection
  },
  [GET_CURRENT_SUPPLY]: (state, { currentSupply }) => {
    state.currentSupply = currentSupply
  },
  [GET_AVAX_PRICE]: (state, { avaxUsdPrice }) => {
    state.avaxUsdPrice = avaxUsdPrice
  },
  [GET_NODE_ID]: (state, { nodeID }) => {
    state.nodeID = nodeID
  },
  [GET_SUBNETS]: (state, { subnets }) => {
    state.subnets = subnets
  },
  [SET_BALANCE]: (state, { addressBalance }) => {
    state.addressBalance = addressBalance
  },
  [GET_HEIGHT]: (state, { height }) => {
    state.height = height
  },
  [GET_NODE_INFO]: (state, { nodeInfo }) => {
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
  [GET_BLOCKCHAINS]: (state, { blockchains }) => {
    blockchains = blockchains.map(b => {
      b.vmName = VMDict[b.vmID].name
      b.vmDocumentation = VMDict[b.vmID].documentation
      return b
    })
    state.blockchains = blockchains
  },
  [GET_NODE_HEALTH]: (state, { nodeID, nodeHealth }) => {
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

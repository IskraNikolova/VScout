import Vue from 'vue'
import { clean } from './../../utils/commons.js'

import {
  SET_CODE,
  GET_TX_AVM,
  GET_HEIGHT,
  SET_TX_HASH_EVM,
  GET_SUPPLY,
  SET_NETWORK_STATUS,
  GET_NODE_HEALTH,
  SET_DELEGATORS,
  SET_DELEGATORS_COUNT,
  SET_VALIDATORS,
  SET_VALIDATOR,
  GET_AVAX_PRICE,
  UPDATE_VALIDATOR,
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
  [UPDATE_VALIDATOR]: (state, { validator }) => {
    const validators = state.defaultValidators
    if (!validators) return
    const currentValidator = validators
      .find(val => val.nodeID.includes(validator.nodeID))
    if (!currentValidator) return
    const newVal = clean(validator)
    const index = state.validators.indexOf(currentValidator)
    if (index < 0) return
    state.validators[index] = { ...currentValidator, ...newVal }
  },
  [GET_AVAX_PRICE]: (state, { avaxPrice }) => {
    const currentPrice = avaxPrice.current_price
    const high24h = avaxPrice.high_24h
    const low24h = avaxPrice.low_24h
    state.currenciesPriceList = currentPrice
    state.high_24h = high24h
    state.low_24h = low24h
    state.price_change_24h = avaxPrice.price_change_24h_in_currency
    state.price_change_24h_percentage = avaxPrice.price_change_percentage_24h_in_currency
  },
  [GET_HEIGHT]: (state, { height }) => {
    state.height = height
  },
  [SET_TX_HASH_EVM]: (state, { txHash }) => {
    state.txHash = txHash
  },
  [GET_SUPPLY]: (state, { currentSupply, totalSupply }) => {
    if (!currentSupply) return
    state.currentSupply = currentSupply

    if (!totalSupply) return
    state.totalSupply = totalSupply
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
  [SET_DELEGATORS_COUNT]: (state, { delegatorsCount }) => {
    state.delegatorsCount = delegatorsCount
  },
  [SET_VALIDATORS]: (state, { validators }) => {
    state.validators = validators
  },
  [SET_VALIDATOR]: (state, { validator }) => {
    state.validator = validator
  }
}

export default mutations

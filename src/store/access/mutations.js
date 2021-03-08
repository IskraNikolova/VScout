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
  GET_AVAX_PRICE,
  SET_DEFAULT_VALIDATORS,
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
  [SET_DEFAULT_VALIDATORS]: (state, { defaultValidators }) => {
    // let result
    // if (defaultValidators) result = defaultValidators.map(a => Object.assign({}, a, { delegators: a.delegators ? a.delegators.length : 0 }))
    // console.log(result)
    state.defaultValidators = defaultValidators
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
  [GET_CURRENT_SUPPLY]: (state, { currentSupply }) => {
    if (!currentSupply) return
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

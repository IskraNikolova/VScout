import Vue from 'vue'

import {
  SET_BLOCK,
  SET_VALIDATORS,
  SET_PENDING_VALIDATORS,
  SET_BLOCKCHAINS,
  SET_CURRENT_BLOCKCHAIN,
  SET_ENDPOINT,
  SET_TOTAL_TXS,
  SET_PREVIOUS_TOTAL_TXS,
  SET_BLOCK_TIME,
  SET_LAST_BLOCK_TIME,
  SET_TX_FOR_24_HOURS,
  SET_PREVIOUS_24_TXS,
  SET_KEY_TXH,
  SET_TXS_HISTORY
} from './types'

const mutations = {
  [SET_BLOCK]: (state, { lastBlock }) => {
    state.lastBlock = lastBlock
  },
  [SET_VALIDATORS]: (state, { validators }) => {
    state.validators = validators
  },
  [SET_PENDING_VALIDATORS]: (state, { validators }) => {
    state.pendingValidators = validators
  },
  [SET_BLOCKCHAINS]: (state, { blockchains }) => {
    state.blockchains = blockchains
  },
  [SET_CURRENT_BLOCKCHAIN]: (state, { blockchain }) => {
    state.currentBlockchain = blockchain
  },
  [SET_ENDPOINT]: (state, { endpoint }) => {
    state.networkEndpoint = endpoint
  },
  [SET_BLOCK_TIME]: (state, { blockTime }) => {
    state.blockTime = blockTime
  },
  [SET_LAST_BLOCK_TIME]: (state, { blockTime }) => {
    state.lastBlockTime.push(blockTime)
  },
  [SET_TX_FOR_24_HOURS]: (state, { txsFor24H }) => {
    state.txsFor24H = txsFor24H
  },
  [SET_PREVIOUS_24_TXS]: (state, { prevTxsFor24H }) => {
    state.prevTxsFor24H = prevTxsFor24H
  },
  [SET_TOTAL_TXS]: (state, { totalTxsCount }) => {
    state.totalTxsCount = totalTxsCount
  },
  [SET_PREVIOUS_TOTAL_TXS]: (state, { prevTotalTxs }) => {
    state.prevTotalTxs = prevTotalTxs
  },
  [SET_KEY_TXH]: (state, { txHKey }) => {
    state.txHKey = txHKey
  },
  [SET_TXS_HISTORY]: (state, { key, txsHistory }) => {
    if (!state.txsHistory[key]) Vue.set(state.txsHistory, key, [])
    state.txsHistory[key] = txsHistory
  }
}

export default mutations

import Vue from 'vue'

import {
  SET_BLOCK,
  SET_VALIDATORS,
  SET_BLOCKCHAINS,
  SET_SUBNETID,
  SET_TOTAL_TXS,
  SET_BLOCK_TIME,
  SET_LAST_BLOCK_TIME,
  SET_TX_FOR_24_HOURS,
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
  [SET_BLOCKCHAINS]: (state, { blockchains }) => {
    state.blockchains = blockchains
  },
  [SET_SUBNETID]: (state, { subnetID }) => {
    state.subnetID = subnetID
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
  [SET_TOTAL_TXS]: (state, { totalTxsCount }) => {
    state.totalTxsCount = totalTxsCount
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

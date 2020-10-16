import {
  SET_CODE,
  GET_TX_AVM,
  SET_TX_HASH_EVM
} from './types'

const mutations = {
  [SET_CODE]: (state, { code }) => {
    state.code = code
  },
  [GET_TX_AVM]: (state, { txAVM }) => {
    state.txAVM = txAVM
  },
  [SET_TX_HASH_EVM]: (state, { txHash }) => {
    state.txHash = txHash
  }
}

export default mutations

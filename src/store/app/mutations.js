import {
  SET_BLOCK,
  SET_VALIDATORS,
  SET_BLOCKCHAINS,
  SET_SUBNETID
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
  }
}

export default mutations

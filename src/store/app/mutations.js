import {
  SET_BLOCK,
  SET_VALIDATORS,
  SET_BLOCKCHAINS,
  SET_SUBNETID,
  SET_BLOCK_TIME,
  SET_LAST_BLOCK_TIME
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
  }
}

export default mutations

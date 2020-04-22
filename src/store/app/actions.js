import {
  INIT_APP,
  GET_LAST_BLOCK,
  SET_BLOCK,
  GET_VALIDATORS,
  SET_VALIDATORS,
  GET_BLOCKCHAINS,
  SET_BLOCKCHAINS,
  SET_BLOCK_TIME,
  GET_BLOCK_TIME
} from './types'

import {
  _getBlock,
  _getBlockchains,
  _getValidators
} from './../../modules/network'

import { secBetweenTwoTime } from './../../utils/commons'

async function initApp ({ dispatch, getters }) {
  await dispatch(GET_LAST_BLOCK)
  setInterval(() => {
    Promise.all([dispatch(GET_LAST_BLOCK), dispatch(GET_BLOCK_TIME), dispatch(GET_VALIDATORS, { subnetID: getters.subnetID })])
  }, 4000)

  await dispatch(GET_BLOCKCHAINS)
  await dispatch(GET_VALIDATORS, { subnetID: getters.subnetID })
}

async function getLastBlock ({ commit }) {
  try {
    const lastBlock = await _getBlock()
    commit(SET_BLOCK, { lastBlock })
  } catch (err) {
    console.log(err)
  }
}

async function getBlockTime ({ commit, getters }) {
  try {
    const preLastBlock = await _getBlock({ id: getters.lastBlock.parentID })
    const blockTime = secBetweenTwoTime(getters.lastBlock.timestamp, preLastBlock.timestamp)
    commit(SET_BLOCK_TIME, { blockTime })
  } catch (err) {
    console.log(err)
  }
}

async function getBlockchains ({ commit }) {
  try {
    const { blockchains } = await _getBlockchains()
    commit(SET_BLOCKCHAINS, { blockchains })
  } catch (err) {
    console.log(err)
  }
}

async function getValidators ({ commit }, { subnetID }) {
  try {
    const { validators } = await _getValidators({ subnetID })
    validators.sort(compare)
    commit(SET_VALIDATORS, { validators })
  } catch (err) {
    console.log(err)
  }
}

function compare (a, b) {
  if (b.stakeAmount < a.stakeAmount) {
    return -1
  } else if (b.stakeAmount > a.stakeAmount) {
    return 1
  }
  return Number(a.startTime) - Number(b.startTime)
}

export default {
  [INIT_APP]: initApp,
  [GET_LAST_BLOCK]: getLastBlock,
  [GET_VALIDATORS]: getValidators,
  [GET_BLOCKCHAINS]: getBlockchains,
  [GET_BLOCK_TIME]: getBlockTime
}

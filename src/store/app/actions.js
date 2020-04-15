import {
  INIT_APP,
  GET_LAST_BLOCK,
  SET_BLOCK,
  GET_VALIDATORS,
  SET_VALIDATORS,
  GET_BLOCKCHAINS,
  SET_BLOCKCHAINS
} from './types'

import {
  _getBlock,
  _getBlockchains,
  _getValidators
} from './../../modules/network'

async function initApp ({ dispatch, getters }) {
  await dispatch(GET_LAST_BLOCK)
  setInterval(async () => {
    await dispatch(GET_LAST_BLOCK)
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
    commit(SET_VALIDATORS, { validators })
  } catch (err) {
    console.log(err)
  }
}

export default {
  [INIT_APP]: initApp,
  [GET_LAST_BLOCK]: getLastBlock,
  [GET_VALIDATORS]: getValidators,
  [GET_BLOCKCHAINS]: getBlockchains
}

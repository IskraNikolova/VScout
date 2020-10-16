import {
  SET_CODE,
  GET_TX_AVM,
  SET_TX_HASH_EVM,
  SET_VALIDATOR_INFO
} from './types.js'

import {
  _getTxApi
} from './../../modules/network.js'

import {
  _setValidatorInfo
} from './../../modules/networkCChain.js'

async function getTxAvm ({ commit }, { txID }) {
  try {
    const txAVM = await _getTxApi(txID.trim())

    commit(GET_TX_AVM, { txAVM })
  } catch (err) {
    throw new Error(err.message)
  }
}

async function setValidatorInfo (
  { commit }, { link, name, website, bio, avatar, nodeID }) {
  try {
    const txHash = await _setValidatorInfo({
      link,
      name,
      website,
      bio,
      avatar,
      nodeID
    })
    commit(SET_TX_HASH_EVM, { txHash })
    commit(SET_CODE, { code: null })
  } catch (err) {
    throw new Error(err.message)
  }
}

export default {
  [GET_TX_AVM]: getTxAvm,
  [SET_VALIDATOR_INFO]: setValidatorInfo
}

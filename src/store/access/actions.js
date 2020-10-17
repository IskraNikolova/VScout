import {
  SET_CODE,
  GET_TX_AVM,
  VERIFY_OWNER,
  SET_TX_HASH_EVM,
  SET_VERIFY_CODE,
  SET_VALIDATOR_INFO
} from './types.js'

import {
  _getTxApi
} from './../../modules/network.js'

import {
  _setVerifyCode,
  _setValidatorInfo
} from './../../modules/networkCChain.js'

import {
  _outputSearch
} from './../../modules/transactions.js'

async function getTxAvm ({ commit },
  { txID }) {
  try {
    const txAVM = await _getTxApi(txID.trim())

    commit(GET_TX_AVM, { txAVM })
  } catch (err) {
    throw new Error(err.message)
  }
}

let isSearchSuccess = false
async function verifyOwner ({ dispatch },
  { txID, index, rewardOwner }) {
  try {
    const txAVM = await _getTxApi(txID.trim())
    const inputs = txAVM.inputs
    if (!inputs) {
      if (isSearchSuccess) return true
      const searchResult = _outputSearch(
        txAVM,
        rewardOwner
      )
      isSearchSuccess = searchResult
      return searchResult
    } else {
      for (let i = 0; i < inputs.length; i++) {
        const output = inputs[i].output
        const addresses = output.addresses
        for (let i = 0; i < addresses.length; i++) {
          const address = addresses[i]
          if (address === rewardOwner.substr(2)) {
            return true
          }
        }
        if (index > 100) {
          throw new Error('Verification Failed!Invalid Sender!')
        }

        index++
        await dispatch(VERIFY_OWNER, {
          txID: output.transactionID,
          index,
          rewardOwner
        })
      }
    }
  } catch (err) {
    throw new Error('Verification Failed! ' + err.message)
  }
}

async function setVerifyCode ({ commit },
  { code, nodeID }) {
  try {
    await _setVerifyCode({ code, nodeID })
  } catch (err) {
    console.log(err.message)
    throw new Error(err.message)
  }
  commit(SET_CODE, { code })
}

async function setValidatorInfo (
  { commit }, { nodeID, name, website, avatar, bio, link }) {
  try {
    const txHash = await _setValidatorInfo({
      nodeID, name, website, avatar, bio, link
    })
    commit(SET_TX_HASH_EVM, { txHash })
    commit(SET_CODE, { code: null })
  } catch (err) {
    throw new Error(err.message)
  }
}

export default {
  [GET_TX_AVM]: getTxAvm,
  [VERIFY_OWNER]: verifyOwner,
  [SET_VERIFY_CODE]: setVerifyCode,
  [SET_VALIDATOR_INFO]: setValidatorInfo
}

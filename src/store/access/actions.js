import {
  SET_CODE,
  GET_TX_AVM,
  VERIFY_OWNER,
  SET_TX_HASH_EVM,
  SET_VERIFY_CODE,
  SET_VALIDATOR,
  SET_VALIDATOR_INFO
} from './types.js'

import {
  _getTxApi,
  _getValidator,
  // _getValidators,
  _getNodeUptime
} from './../../modules/network.js'

// const {
//   network
// } = require('./../../modules/config.js')
//   .default

import {
  getAvatar
} from './../../utils/commons.js'

import {
  _setVerifyCode,
  _setValidatorInfo,
  _getValidatorById
} from './../../modules/networkCChain.js'

import {
  _outputSearch
} from './../../modules/transactions.js'

async function setValidator ({ commit }, { id }) {
  try {
    const response = await Promise.all([
      _getValidator({ id }),
      _getValidatorById(id),
      _getNodeUptime(id)
    ])

    const val = response[0].data
    const info = response[1]
    val.avatarUrl = info.avatarUrl ? info.avatarUrl : getAvatar(id).monster
    val.name = info.name ? info.name : id
    val.link = info.link ? info.link : ''
    val.bio = info.bio ? info.bio : ''
    val.website = info.website ? info.website : ''
    val.link = info.link ? info.link : ''
    const uptimes = response[2]

    if (!uptimes) val.uptimes = []
    else val.uptimes = uptimes.data

    const t = {
      'https://bit.ly/3q5aMGC': {
        avatar: '/statics/circle_symbol.svg',
        bio: 'Masternodes, Full Nodes, Staking Services',
        link: 'https://www.allnodes.com/?utm_source=vscout&utm_medium=validator-list',
        website: 'Allnodes'
      },
      '/statics/circle_symbol.svg': {
        avatar: '/statics/circle_symbol.svg',
        bio: 'Masternodes, Full Nodes, Staking Services',
        link: 'https://www.allnodes.com/?utm_source=vscout&utm_medium=validator-list',
        website: 'Allnodes'
      }
    }
    const temp = t[`${val.avatarUrl}`]
    if (temp) {
      val.avatar = temp.avatar
      val.bio = val.bio ? val.bio : temp.bio
      val.link = val.link ? val.link : temp.link
      val.website = val.website ? val.website : temp.website
    }
    // const endpoint = getters.networkEndpoint.url
    // if (endpoint !== network.endpointUrls[0].url) {
    //   const subnetID = getters.subnetID
    //   const response = await _getValidators({
    //     subnetID,
    //     endpoint
    //   })

    //   if (response.data.error) return
    //   const { validators } = response.data.result

    //   const v = validators
    //     .find(val => val.nodeID.includes(id))
    //   if (!v) return
    //   val.uptime = v.uptime
    //   val.connected = v.connected
    // }

    // const validator = getters.nonDefvalidatorById(id)
    // if (validator) val.uptime = validator.uptime
    commit(SET_VALIDATOR, { validator: val })
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

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
    commit(SET_CODE, { code })
  } catch (err) {
    throw new Error(err.message)
  }
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
  [SET_VALIDATOR]: setValidator,
  [SET_VERIFY_CODE]: setVerifyCode,
  [SET_VALIDATOR_INFO]: setValidatorInfo
}

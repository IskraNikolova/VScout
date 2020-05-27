import moment from 'moment'
const BigNumber = require('bignumber.js')

import {
  INIT_APP,
  SIGN_TX,
  CREATE_USER,
  FUND_ACCOUNT,
  GET_LAST_BLOCK,
  SET_BLOCK,
  GET_TOTAL_TXS,
  SET_TOTAL_TXS,
  SET_PREVIOUS_TOTAL_TXS,
  GET_VALIDATORS,
  SET_VALIDATORS,
  GET_PENDING_VALIDATORS,
  SET_PENDING_VALIDATORS,
  GET_BLOCKCHAINS,
  SET_BLOCKCHAINS,
  SET_BLOCK_TIME,
  GET_BLOCK_TIME,
  GET_TX_FOR_24_HOURS,
  SET_TX_FOR_24_HOURS,
  SET_PREVIOUS_24_TXS,
  GET_TXS_HISTORY,
  SET_TXS_HISTORY,
  GET_ASSETS_BY_BLOCKCHAINS,
  SET_ASSETS_BY_BLOCKCHAINS,
  GET_NODE_ID,
  GET_ACCOUNT,
  CREATE_ACCOUNT,
  LIST_ACCOUNTS,
  ADD_VALIDATOR_TO_DEFAULT_SUBNET
} from './types'

import {
  UPDATE_UI
} from './../ui/types'

import {
  _getBlock,
  _sign,
  _issueTx,
  _exportAVA,
  _importAVA,
  _getBlockchains,
  _getValidators,
  _getPendingValidators,
  _getAggregates,
  _getAggregatesWithI,
  _getLastTx,
  _getTxStatus,
  _getAssetsForChain,
  _getNodeId,
  _getAccount,
  _createAccount,
  _createUser,
  _listAccounts,
  _addDefaultSubnetValidator
} from './../../modules/network'

import { secBetweenTwoTime, makeMD5 } from './../../utils/commons'

const promises = (dispatch, getters) => [
  dispatch(GET_TOTAL_TXS),
  dispatch(GET_TX_FOR_24_HOURS),
  dispatch(GET_TXS_HISTORY),
  dispatch(GET_VALIDATORS, { subnetID: getters.currentBlockchain.subnetID })
]

async function initApp ({ dispatch, getters }) {
  // todo refactor this
  await dispatch(GET_BLOCKCHAINS)
  await dispatch(GET_ASSETS_BY_BLOCKCHAINS)
  await Promise.all(promises(dispatch, getters))
  setInterval(async () => {
    await Promise.all(promises(dispatch, getters))
  }, 4000)
}

async function getLastBlock ({ commit, getters }) {
  try {
    const lastBlock = await _getBlock({ endpoint: getters.networkEndpoint })
    commit(SET_BLOCK, { lastBlock })
  } catch (err) {
    console.log(err)
  }
}

async function getBlockTime ({ commit, getters }) {
  try {
    const preLastBlock = await _getBlock({
      id: getters.lastBlock.parentID,
      endpoint: getters.networkEndpoint
    })
    const blockTime = secBetweenTwoTime(
      getters.lastBlock.timestamp,
      preLastBlock.timestamp)
    commit(SET_BLOCK_TIME, { blockTime })
  } catch (err) {
    console.log(err)
  }
}

async function getBlockchains ({ commit, getters }) {
  try {
    const { blockchains } = await _getBlockchains({
      endpoint: getters.networkEndpoint
    })
    commit(SET_BLOCKCHAINS, { blockchains })
  } catch (err) {
    console.log(err)
  }
}

async function getTxsFor24H ({ commit, getters }) {
  try {
    const minAgo = moment().subtract(24, 'hours')
    const { transactionCount, transactionVolume } = await _getAggregates(
      minAgo.toISOString(),
      moment().toISOString()
    )
    commit(SET_PREVIOUS_24_TXS, { prevTxsFor24H: getters.txsFor24H })
    commit(SET_TX_FOR_24_HOURS, {
      txsFor24H: {
        transactionCount,
        transactionVolume: Math.round(transactionVolume / 10 ** 9)
      }
    })
  } catch (err) {
    console.log(err)
  }
}

async function getTotalTXs ({ commit, getters }) {
  try {
    const response = await _getLastTx()
    if (response.count) {
      const totalTxsCount = response.count
      commit(SET_PREVIOUS_TOTAL_TXS, { prevTotalTxs: getters.totalTxsCount })
      commit(SET_TOTAL_TXS, { totalTxsCount })
    }
  } catch (err) {
    console.log(err)
  }
}

const temp = {
  minute: {
    sub: { value: 30, label: 'minute' },
    interval: { value: 60, label: 's' },
    label: '60 seconds'
  },
  hourTwo: {
    sub: { value: 2, label: 'hour' },
    interval: { value: 5, label: 'm' },
    label: '5 minutes'
  },
  day: {
    sub: { value: 1, label: 'day' },
    interval: { value: '', label: 'hour' },
    label: '1 hour'
  },
  week: {
    sub: { value: 7, label: 'days' },
    interval: { value: '', label: 'day' },
    label: '24 hours'
  },
  month: {
    sub: { value: 1, label: 'months' },
    interval: { value: '', label: 'day' },
    label: '1 day'
  },
  year: {
    sub: { value: 1, label: 'years' },
    interval: { value: '', label: 'month' },
    label: '1 month'
  }
}

async function getTxsHistory ({ commit, getters }) {
  try {
    const { sub, interval, label } = temp[getters.txHKey]
    const minAgo = moment().subtract(sub.value, sub.label)
    const aggregates = await _getAggregatesWithI(
      minAgo.toISOString(),
      moment().toISOString(),
      `${interval.value}${interval.label}`
    )

    aggregates.intervals.map(a => {
      if (moment(a.endTime) > moment() &&
        aggregates.intervalSize) {
        aggregates.intervals.pop()
      }
    })

    aggregates.label = label
    aggregates.key = getters.txHKey
    commit(SET_TXS_HISTORY, { key: getters.txHKey, txsHistory: aggregates })
  } catch (err) {
    console.log(err)
  }
}

async function getValidators ({ commit, getters }, { subnetID }) {
  try {
    var { validators } = await _getValidators({
      subnetID,
      endpoint: getters.networkEndpoint
    })
    validators = validators
      .filter(i => i.endTime >= Date.now() / 1000)
      .sort(compare)
    const val = map(validators)
    commit(SET_VALIDATORS, { validators: val })
  } catch (err) {
    console.log(err)
  }
}

async function getAssetsByBlockchain ({ commit }) {
  try {
    const assetsByChain = await _getAssetsForChain()
    commit(SET_ASSETS_BY_BLOCKCHAINS, { assetsByChain })
  } catch (err) {
    console.log(err)
  }
}

async function getPendingValidators ({ commit, getters }, { subnetID }) {
  try {
    var { validators } = await _getPendingValidators({
      subnetID,
      endpoint: getters.networkEndpoint
    })
    validators = validators.filter(i => i.endTime >= Date.now() / 1000)
    validators.sort(compare)
    const val = map(validators)
    commit(SET_PENDING_VALIDATORS, { validators: val })
  } catch (err) {
    console.log(err)
  }
}

async function getNodeId ({ getters }) {
  try {
    const result = await _getNodeId({ endpoint: getters.networkEndpoint })
    return result.nodeID
  } catch (err) {
    console.log(err)
    return null
  }
}

async function getAccount ({ commit, getters }, { address, type }) {
  try {
    const account = await _getAccount({
      endpoint: getters.networkEndpoint,
      params: { address }
    })
    if (type === 'destination') {
      commit(UPDATE_UI, {
        addValidatorDialog: {
          isOpen: true,
          destinationAccount: account,
          payingAccount: getters.ui.addValidatorDialog.payingAccount
        }
      })
    } else {
      commit(UPDATE_UI, {
        addValidatorDialog: {
          isOpen: true,
          destinationAccount: getters.ui.addValidatorDialog.destinationAccount,
          payingAccount: account
        }
      })
    }
  } catch (err) {
    commit(UPDATE_UI, {
      addValidatorDialog: {
        isOpen: true,
        destinationAccount: {
          address: null
        }
      }
    })
  }
}

async function createAccount ({ dispatch, getters }, { username, password, type }) {
  try {
    const params = { username, password }
    const response = await _createAccount({
      endpoint: getters.networkEndpoint,
      params
    })

    if (response.data.error) {
      throw new Error(response.data.error.message)
    }

    const account = response.data.result
    await dispatch(GET_ACCOUNT, { address: account.address, type })
  } catch (err) {
    throw new Error(err.message)
  }
}

async function createUser ({ getters }, { username, password }) {
  try {
    const params = { username, password }
    const response = await _createUser({
      endpoint: getters.networkEndpoint,
      params
    })
    if (response.data.error) {
      throw new Error(response.data.error.message)
    }

    return response.data.result
  } catch (err) {
    throw new Error(err.message)
  }
}

async function listAccounts ({ getters }, { username, password }) {
  try {
    const params = { username, password }
    const response = await _listAccounts({
      endpoint: getters.networkEndpoint,
      params
    })
    if (response.data.error) {
      throw new Error(response.data.error.message)
    }

    return response.data.result
  } catch (err) {
    throw new Error(err.message)
  }
}

async function addValidatorToDefaultS ({ getters }, { params, signer }) {
  try {
    const endpoint = getters.networkEndpoint
    const account = await _getAccount({
      endpoint,
      params: { address: signer }
    })

    const nonce = Number(account.nonce) + 1
    params.payerNonce = nonce
    if (account.balance < params.stakeAmount) {
      throw new Error('Insufficient funds!')
    }
    const { unsignedTx } = await _addDefaultSubnetValidator({
      endpoint: getters.networkEndpoint,
      params
    })
    return unsignedTx
  } catch (err) {
    throw new Error(err.message)
  }
}

async function signTransaction ({ getters }, { transaction, signer, username, password }) {
  try {
    const endpoint = getters.networkEndpoint
    const tx = await _sign({ endpoint, params: { tx: transaction, signer, username, password } })
    await _issueTx({ endpoint, params: tx })
  } catch (err) {
    throw new Error(err.message)
  }
}

async function fundAccount ({ getters }, { amount, username, password }) {
  try {
    const to = getters.ui.addValidatorDialog.payingAccount.address
    const nonce = Number(getters.ui.addValidatorDialog.payingAccount.nonce)
    const payerNonce = nonce + 1
    const endpoint = getters.networkEndpoint

    // export AVA
    const params = { to, amount, username, password }
    const txID = await _exportAVA({ endpoint, params })

    // getTxStatus
    let txStat = await _getTxStatus({ endpoint, params: txID })
    if (!txStat) {
      throw new Error('Check your balance')
    }

    const interval = setInterval(async () => {
      if (txStat.status !== 'Processing') {
        // import
        const tx = await _importAVA({
          endpoint,
          params: {
            username,
            password,
            to,
            payerNonce
          }
        })
        // issueTx
        await _issueTx({ endpoint, params: tx })
        clearInterval(interval)
      }
      txStat = await _getTxStatus({ endpoint, params: txID })
    }, 1000)
  } catch (err) {
    throw new Error(err)
  }
}

function map (validators) {
  let index = 1
  const s = stake(validators)
  const vals = validators.map(val => {
    const sa = val.stakeAmount ? val.stakeAmount : val.weight
    const rank = index++
    const validator = `${val.id.substr(0, 9)}...`
    const precent = getPrecent(sa, s)
    const identity = val.id
    const stakenAva = parseFloat(sa)
    const stakeAva = getAvaFromnAva(sa)
    const stake = stakeAva
    const startTime = val.startTime
    const endTime = val.endTime
    const MD5 = makeMD5()
    const seed = val.id
    const hash = MD5.hex(seed)
    const img = 'http://www.gravatar.com/avatar/' + hash + '?d=identicon&s=150'
    const img2 = 'http://www.gravatar.com/avatar/' + hash + '?d=monsterid&s=150'
    return {
      rank,
      validator,
      precent,
      identity,
      stake,
      stakenAva,
      startTime,
      endTime,
      img,
      img2
    }
  })

  return vals
}

function getPrecent (v, s) {
  v = new BigNumber(getAvaFromnAva(v))
  const allStake = new BigNumber(s)
  const y = new BigNumber(100)
  const res = v.multipliedBy(y)

  const result = res.dividedBy(allStake)
  return result.toFixed(8)
}

function stake (validators) {
  return validators.reduce((a, b) => {
    if (!b.stakeAmount) return
    return a + (parseFloat(b.stakeAmount) / 10 ** 9)
  }, 0.0)
}

function getAvaFromnAva (v) {
  return Number(v) / 10 ** 9
}

// todo opt
function compare (a, b) {
  const get = (a, b) => { return b - a }
  if (Number(b.stakeAmount) < Number(a.stakeAmount)) {
    return -1
  } else if (Number(b.stakeAmount) > Number(a.stakeAmount)) {
    return 1
  } else {
    if (get(a.startTime, a.endTime) > get(b.startTime, b.endTime)) {
      return -1
    } else if (get(a.startTime, a.endTime) < get(b.startTime, b.endTime)) {
      return 1
    }

    return 0
  }
}

export default {
  [INIT_APP]: initApp,
  [SIGN_TX]: signTransaction,
  [FUND_ACCOUNT]: fundAccount,
  [GET_LAST_BLOCK]: getLastBlock,
  [GET_VALIDATORS]: getValidators,
  [GET_PENDING_VALIDATORS]: getPendingValidators,
  [GET_BLOCKCHAINS]: getBlockchains,
  [GET_BLOCK_TIME]: getBlockTime,
  [GET_TX_FOR_24_HOURS]: getTxsFor24H,
  [GET_TOTAL_TXS]: getTotalTXs,
  [GET_TXS_HISTORY]: getTxsHistory,
  [GET_ASSETS_BY_BLOCKCHAINS]: getAssetsByBlockchain,
  [GET_NODE_ID]: getNodeId,
  [GET_ACCOUNT]: getAccount,
  [LIST_ACCOUNTS]: listAccounts,
  [CREATE_ACCOUNT]: createAccount,
  [CREATE_USER]: createUser,
  [ADD_VALIDATOR_TO_DEFAULT_SUBNET]: addValidatorToDefaultS

}

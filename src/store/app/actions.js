import moment from 'moment'
const BigNumber = require('bignumber.js')

import {
  INIT_APP,
  GET_LAST_BLOCK,
  SET_BLOCK,
  GET_TOTAL_TXS,
  SET_TOTAL_TXS,
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
  GET_TXS_HISTORY,
  SET_TXS_HISTORY
} from './types'

import {
  _getBlock,
  _getBlockchains,
  _getValidators,
  _getPendingValidators,
  _getAggregates,
  _getAggregatesWithI,
  _getLastTx
} from './../../modules/network'

import { secBetweenTwoTime, makeMD5 } from './../../utils/commons'
const promises = (dispatch, getters) => [
  dispatch(GET_TOTAL_TXS),
  dispatch(GET_TX_FOR_24_HOURS),
  dispatch(GET_TXS_HISTORY),
  dispatch(GET_VALIDATORS, { subnetID: getters.subnetID })
]
async function initApp ({ dispatch, getters }) {
  await dispatch(GET_BLOCKCHAINS)
  await Promise.all(promises(dispatch, getters))
  setInterval(async () => {
    await Promise.all(promises(dispatch, getters))
  }, 4000)
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
    console.log(blockchains)
    commit(SET_BLOCKCHAINS, { blockchains })
  } catch (err) {
    console.log(err)
  }
}

async function getTxsFor24H ({ commit }) {
  try {
    const minAgo = moment().subtract(24, 'hours')
    const { transactionCount, transactionVolume } = await _getAggregates(minAgo.toISOString(), moment().toISOString())
    commit(SET_TX_FOR_24_HOURS, { txsFor24H: { transactionCount, transactionVolume: Math.round(transactionVolume / 10 ** 9) } })
  } catch (err) {
    console.log(err)
  }
}

async function getTotalTXs ({ commit }) {
  try {
    const response = await _getLastTx()
    if (response.count) {
      const totalTxsCount = response.count

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
    interval: { value: 10, label: 'm' },
    label: '10 minutes'
  },
  day: {
    sub: { value: 1, label: 'day' },
    interval: { value: '', label: 'hour' },
    label: '1 hour'
  },
  week: {
    sub: { value: 7, label: 'days' },
    interval: { value: '', label: 'day' },
    label: '1 day'
  },
  month: {
    sub: { value: 1, label: 'months' },
    interval: { value: '', label: 'week' },
    label: '7 days'
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
    const aggregates = await _getAggregatesWithI(minAgo.toISOString(), moment().toISOString(), `${interval.value}${interval.label}`)
    aggregates.label = label
    commit(SET_TXS_HISTORY, { key: getters.txHKey, txsHistory: aggregates })
  } catch (err) {
    console.log(err)
  }
}

async function getValidators ({ commit }, { subnetID }) {
  try {
    var { validators } = await _getValidators({ subnetID })
    validators = validators.filter(i => i.endTime >= Date.now() / 1000)
    validators.sort(compare)
    const val = map(validators)
    commit(SET_VALIDATORS, { validators: val })
  } catch (err) {
    console.log(err)
  }
}

async function getPendingValidators ({ commit, getters }, { subnetID }) {
  try {
    var { validators } = await _getPendingValidators({ subnetID })
    validators = validators.filter(i => i.endTime >= Date.now() / 1000)
    validators.sort(compare)
    const val = map(validators)
    commit(SET_PENDING_VALIDATORS, { validators: val })
  } catch (err) {
    console.log(err)
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
  [GET_LAST_BLOCK]: getLastBlock,
  [GET_VALIDATORS]: getValidators,
  [GET_PENDING_VALIDATORS]: getPendingValidators,
  [GET_BLOCKCHAINS]: getBlockchains,
  [GET_BLOCK_TIME]: getBlockTime,
  [GET_TX_FOR_24_HOURS]: getTxsFor24H,
  [GET_TOTAL_TXS]: getTotalTXs,
  [GET_TXS_HISTORY]: getTxsHistory
}

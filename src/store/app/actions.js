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
  _getAggregates,
  _getAggregatesWithI,
  _getTxs
} from './../../modules/network'

import { secBetweenTwoTime, makeMD5 } from './../../utils/commons'

async function initApp ({ dispatch, getters }) {
  // await dispatch(GET_LAST_BLOCK)
  await dispatch(GET_TXS_HISTORY)
  await dispatch(GET_TX_FOR_24_HOURS)
  setInterval(async () => {
    const hasChanges = await dispatch(GET_TOTAL_TXS)
    if (hasChanges) {
      Promise.all(
        [
          dispatch(GET_TX_FOR_24_HOURS),
          dispatch(GET_TXS_HISTORY),
          // await dispatch(GET_LAST_BLOCK)
          // dispatch(GET_BLOCK_TIME),
          dispatch(GET_VALIDATORS, { subnetID: getters.subnetID })
        ])
    }
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

async function getTxsFor24H ({ commit }) {
  try {
    const minAgo = moment().subtract(24, 'hours')
    const txsFor24H = await _getAggregates(minAgo.toISOString(), moment().toISOString())
    commit(SET_TX_FOR_24_HOURS, { txsFor24H: txsFor24H.transactionCount })
  } catch (err) {
    console.log(err)
  }
}

async function getTotalTXs ({ commit, getters }) {
  try {
    const txs = await _getTxs()
    const isChange = getters.totalTxsCount < txs.count
    const totalTxsCount = txs.count
    commit(SET_TOTAL_TXS, { totalTxsCount })
    return isChange
  } catch (err) {
    console.log(err)
  }
}

const temp = {
  minute: {
    sub: { value: 1, label: 'minute' },
    interval: { value: 1, label: 's' }
  },
  hour: {
    sub: { value: 1, label: 'hour' },
    interval: { value: 5, label: 'm' }
  },
  day: {
    sub: { value: 1, label: 'day' },
    interval: { value: '', label: 'hour' }
  },
  week: {
    sub: { value: 7, label: 'days' },
    interval: { value: '12', label: 'h' }
  },
  month: {
    sub: { value: 1, label: 'months' },
    interval: { value: '', label: 'day' }
  },
  year: {
    sub: { value: 1, label: 'years' },
    interval: { value: '', label: 'month' }
  }
}

async function getTxsHistory ({ commit, getters }) {
  try {
    const { sub, interval } = temp[getters.txHKey]
    const minAgo = moment().subtract(sub.value, sub.label)
    const aggregates = await _getAggregatesWithI(minAgo.toISOString(), moment().toISOString(), `${interval.value}${interval.label}`)
    console.log(aggregates)
    commit(SET_TXS_HISTORY, { key: getters.txHKey, txsHistory: aggregates })
  } catch (err) {
    console.log(err)
  }
}

async function getValidators ({ commit, getters }, { subnetID }) {
  try {
    var { validators } = await _getValidators({ subnetID })
    validators = validators.filter(i => i.endTime >= Date.now() / 1000)
    validators.sort(compare)
    const val = map(validators, getters.lastBlock)
    commit(SET_VALIDATORS, { validators: val })
  } catch (err) {
    console.log(err)
  }
}

function map (validators, lastBlock) {
  let index = 1
  const s = stake(validators)
  const vals = validators.map(val => {
    const rank = index++
    const validator = `${val.id.substr(0, 9)}...`
    const precent = getPrecent(val.stakeAmount, s)
    const identity = val.id
    const stakenAva = parseFloat(val.stakeAmount)
    const stakeAva = getAvaFromnAva(val.stakeAmount)
    const stake = stakeAva
    // todo last vote
    const lastVote = lastBlock.timestamp
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
      lastVote,
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
  [GET_BLOCKCHAINS]: getBlockchains,
  [GET_BLOCK_TIME]: getBlockTime,
  [GET_TX_FOR_24_HOURS]: getTxsFor24H,
  [GET_TOTAL_TXS]: getTotalTXs,
  [GET_TXS_HISTORY]: getTxsHistory
}

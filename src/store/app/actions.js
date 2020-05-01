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

import { secBetweenTwoTime, makeMD5 } from './../../utils/commons'
const BigNumber = require('bignumber.js')

async function initApp ({ dispatch, getters }) {
  await dispatch(GET_LAST_BLOCK)
  setInterval(() => {
    Promise.all(
      [
        dispatch(GET_LAST_BLOCK),
        // dispatch(GET_BLOCK_TIME),
        dispatch(GET_VALIDATORS, { subnetID: getters.subnetID })
      ])
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

async function getValidators ({ commit, getters }, { subnetID }) {
  try {
    var { validators } = await _getValidators({ subnetID })
    // validators = validators.filter(i => i.endTime >= Date.now() / 1000)
    validators.sort(compare)
    const val = map(validators, getters.lastBlock)
    commit(SET_VALIDATORS, { validators: val })
  } catch (err) {
    console.log(err)
  }
}

function map (validators, lastBlock) {
  let index = 1
  const vals = validators.map(val => {
    const rank = index++
    const validator = `${val.id.substr(0, 9)}...`
    const precent = getPrecent(val.stakeAmount)
    const identity = val.id
    const stakenAva = Math.floor(val.stakeAmount)
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

function getPrecent (v) {
  v = new BigNumber(getAvaFromnAva(v))
  const allStake = new BigNumber(360000000)
  const y = new BigNumber(100)
  const res = v.multipliedBy(y)

  const result = res.dividedBy(allStake)
  return round(result)
}

function getAvaFromnAva (v) {
  return Number(v) / 10 ** 9
}

function round (result) {
  const multiplier = Math.pow(1000, 1 || 0)
  const res = Math.round(result * multiplier) / multiplier
  return res
}

function compare (a, b) {
  if (Number(b.stakeAmount) < Number(a.stakeAmount)) {
    return -1
  } else if (Number(b.stakeAmount) > Number(a.stakeAmount)) {
    return 1
  }

  return 0
}

export default {
  [INIT_APP]: initApp,
  [GET_LAST_BLOCK]: getLastBlock,
  [GET_VALIDATORS]: getValidators,
  [GET_BLOCKCHAINS]: getBlockchains,
  [GET_BLOCK_TIME]: getBlockTime
}

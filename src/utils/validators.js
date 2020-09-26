const BigNumber = require('bignumber.js')

import { fromNow, countDownCounter } from './../modules/time.js'
import { getRemainingCapacity } from './stake.js'
import { round, getAvatar } from './commons.js'
import { getAvaFromnAva } from './avax.js'
// import { _getValidatorById } from './../modules/networkRpc'

/**
* @param {Array} Array of validators
* @param {Array} Array of current validators on Default Subnet
* @returns {Array} Array with processing validators
*/
export async function validatorProcessing (validators, delegators, defaultValidators) {
  const val = await mapValidators(validators, delegators, defaultValidators)

  // get all staked AVAX
  const allStake = val.reduce((a, b) => {
    return a + parseFloat(b.totalnAva)
  }, 0.0)

  const validatedStake = val.reduce((a, b) => {
    return a + parseFloat(b.stakenAva)
  }, 0.0)

  const delegatedStake = val.reduce((a, b) => {
    return a + parseFloat(b.delegateStakenAva)
  }, 0.0)

  // get and set percent for total stake (own and delegated)
  let validatorsResult = val.map((v) => {
    v.percent = getPercent(v.totalnAva, allStake)
    return v
  })

  // sort validators by total stake and duration
  validatorsResult = validatorsResult.sort(compare)

  // set rank of validators
  const result = validatorsResult.map((v, i) => {
    v.rank = i + 1
    const currentValidators = validatorsResult.slice(0, i + 1)
    v.cumulativeStake = cumulativeStake(currentValidators)
    return v
  })
  return {
    allStake: getAvaFromnAva(allStake),
    validatedStake: getAvaFromnAva(validatedStake),
    delegatedStake: getAvaFromnAva(delegatedStake),
    validators: result
  }
}

export function compare (a, b) {
  const get = (a, b) => { return b - a }
  const compareStake = parseFloat(b.total) - parseFloat(a.total)
  const temp = {
    false: compareStake,
    true: get(b.startTime, b.endTime) - get(a.startTime, a.endTime)
  }

  return temp[compareStake === 0]
}

export async function mapValidators (validators, delegators, defaultValidators) {
  if (!validators) return []

  const res = await Promise.all(validators.map(async (val) => {
    const nodeID = val.nodeID
    // const info = await _getValidatorById(nodeID)
    let delegateStake = 0
    let delegatePotentialReward = 0
    let delegatorsCount = 0
    let weight = 0
    let stakeAmount = 0
    let remainingCapacity = 0

    if (val.weight) {
      weight = val.weight

      const currentValidator = defaultValidators
        .find(v => v.nodeID === nodeID)
      stakeAmount = currentValidator.stakenAva
    } else {
      stakeAmount = val.stakeAmount

      const props = getDelegatorsForNode(val, delegators)
      delegateStake = props.delegateStake
      delegatorsCount = props.delegatorsCount
      delegatePotentialReward = props.potentialReward
      remainingCapacity = getRemainingCapacity(stakeAmount, delegateStake)
    }

    const avatar = getAvatar(nodeID).monster // info.avatarUrl ? info.avatarUrl : getAvatar(nodeID).monster
    const name = nodeID // info.name ? info.name : nodeID
    const total = parseFloat(stakeAmount) + parseFloat(delegateStake)
    const countDownCounterRes = countDownCounter(val.endTime)
    const remainingTime = countDownCounterRes.countdown
    const isMinimumAmountForStake = countDownCounterRes.isMinimumAmountForStake

    return {
      ...val,
      name,
      avatar,
      weight,
      nodeID,
      delegatorsCount,
      totalnAva: total,
      total: getAvaFromnAva(total),
      fromNowST: fromNow(val.startTime),
      delegateStakenAva: delegateStake,
      stake: getAvaFromnAva(stakeAmount),
      stakenAva: parseFloat(stakeAmount),
      delegateStake: getAvaFromnAva(delegateStake),
      remainingCapacity,
      remainingTime,
      isMinimumAmountForStake,
      delegatePotentialReward,
      link: '' // info.link
    }
  }))
  return res
}

export function getDelegatorsForNode (validator, delegators) {
  if (!delegators) {
    return {
      delegateStake: 0,
      delegatorsCount: 0,
      potentialReward: 0
    }
  }

  const currentDelegators = delegators
    .filter(d => d.nodeID === validator.nodeID)

  const delegateStake = currentDelegators
    .reduce((a, b) => {
      return a + parseFloat(b.stakeAmount)
    }, 0.0)

  const potentialReward = currentDelegators
    .reduce((a, b) => {
      return a + parseFloat(b.potentialReward)
    }, 0.0)

  return {
    delegateStake,
    delegatorsCount: currentDelegators.length,
    potentialReward
  }
}

export function mapDelegators (delegators) {
  if (!delegators) return []
  return delegators.map((delegator, i) => {
    const nodeId = delegator.nodeID
    const { avatar } = getAvatar(nodeId)

    return {
      ...delegator,
      avatar,
      nodeId,
      index: i + 1,
      fromNowST: fromNow(delegator.startTime),
      stake: getAvaFromnAva(delegator.stakeAmount),
      stakenAva: parseFloat(delegator.stakeAmount)
    }
  })
}

function cumulativeStake (currentValidators) {
  return currentValidators.reduce((result, item) => {
    result += parseFloat(item.percent)
    return Math.min(round(result, 10), 100)
  }, 0.0)
}

function getPercent (v, s) {
  v = new BigNumber(v)
  const allStake = new BigNumber(s)
  const y = new BigNumber(100)
  const res = v.multipliedBy(y)

  const result = res.dividedBy(allStake)

  return result.toFixed(7)
}

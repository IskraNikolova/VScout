const BigNumber = require('bignumber.js')

import { countDownCounter } from './../modules/time.js'
import { getRemainingCapacity } from './stake.js'
import { round, getAvatar } from './commons.js'
import { getAvaFromnAva } from './avax.js'
// import { _getValidatorById } from './../modules/networkRpc'

/**
* @param {Array} Array of validators
* @param {Array} Array of current validators on Default Subnet
* @returns {Array} Array with processing validators
*/
export function validatorProcessing (validators, delegatorsD, defaultValidators, isInit) {
  const {
    validatorsMap,
    validatedStake,
    delegatedStake
  } = mapValidators(validators, delegatorsD, defaultValidators, isInit)

  // get all staked AVAX
  const allStake = BigNumber
    .sum(validatedStake, delegatedStake)

  // get and set percent for total stake (own and delegated)
  let validatorsResult = validatorsMap.map((v) => {
    v.percent = getPercent(v.totalStakeAmount, allStake)
    return v
  })

  // let delegators = []
  // validatorsMap.forEach((val) => {
  //   if (!val.delegators) return

  //   delegators
  //     .push(...mapDelegators(val.delegators))
  // })
  // delegators = delegators.map((d, i) => {
  //   return { ...d, index: i + 1 }
  // })

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
  const compareStake = parseFloat(b.totalStakeAmount) - parseFloat(a.totalStakeAmount)
  const temp = {
    false: compareStake,
    true: get(b.startTime, b.endTime) - get(a.startTime, a.endTime)
  }

  return temp[compareStake === 0]
}

export function mapValidators (validators, delegators, defaultValidators, isInit) {
  if (!validators) return []

  let validatedStake = new BigNumber(0)
  let delegatedStake = new BigNumber(0)

  const validatorsMap = validators.map((val) => {
    // const info = await _getValidatorById(val.nodeID)
    validatedStake = BigNumber.sum(validatedStake, val.stakeAmount)

    const currentValidator = defaultValidators
      .find(v => v.nodeID === val.nodeID)

    // todo issue Incorrect uptime sometimes returned by getCurrentValidators delete after BUGFIX
    if (!isInit) {
      const prev = parseFloat(currentValidator.uptime)
      const next = parseFloat(val.uptime)
      if (prev - next > 0.25) val.uptime = currentValidator.uptime
    }

    if (val.weight) {
      val.stakeAmount = currentValidator.stakeAmount
    }

    let currentDelegators = val.delegators
    if (!currentDelegators) {
      currentDelegators = delegators
        .filter(d => d.nodeID === val.nodeID)
    }

    const props = getDelegatorDetails(currentDelegators)
    const delegateStake = props.delegateStake
    delegatedStake = BigNumber.sum(delegatedStake, delegateStake)
    const delegatePotentialReward = props.potentialReward

    const countDownCounterRes = countDownCounter(val.endTime)
    const remainingTime = countDownCounterRes.countdown

    const totalStakeAmount = BigNumber.sum(val.stakeAmount, delegateStake)
    const remainingCapacity = getRemainingCapacity(val.stakeAmount, delegateStake)
    const isMinimumAmountForStake = countDownCounterRes.isMinimumAmountForStake

    const avatar = getAvatar(val.nodeID).monster // info.avatarUrl ? info.avatarUrl : getAvatar(val.nodeID).monster
    const name = val.nodeID // info.name ? info.name : val.nodeID

    return {
      ...val,
      name,
      avatar,
      link: '', // info.link
      remainingTime,
      delegateStake,
      totalStakeAmount,
      remainingCapacity,
      isMinimumAmountForStake,
      delegatePotentialReward,
      delegators: currentDelegators
    }
  })

  return {
    validatorsMap,
    validatedStake,
    delegatedStake
  }
}

export function mapPendingValidators (validators, defaultValidators) {
  if (!validators) return []

  return validators.map((val) => {
    let currentValidator = {}

    if (val.weight) {
      currentValidator = defaultValidators
        .find(v => v.nodeID === val.nodeID)
      val.stakeAmount = currentValidator.stakeAmount
    }

    const countDownCounterRes = countDownCounter(val.endTime)
    const remainingTime = countDownCounterRes.countdown

    const totalStakeAmount = parseFloat(val.stakeAmount)
    const remainingCapacity = getRemainingCapacity(val.stakeAmount, 0)
    const isMinimumAmountForStake = true

    const avatar = getAvatar(val.nodeID).monster
    const name = val.nodeID

    return {
      ...val,
      name,
      avatar,
      remainingTime,
      totalStakeAmount,
      remainingCapacity,
      isMinimumAmountForStake
    }
  })
}

export function getDelegatorDetails (delegators) {
  if (!delegators) {
    return {
      delegateStake: 0,
      potentialReward: 0
    }
  }

  const delegateStake = delegators
    .reduce((a, b) => {
      return BigNumber.sum(a, b.stakeAmount)
    }, 0.0)

  const potentialReward = delegators
    .reduce((a, b) => {
      return BigNumber.sum(a, b.potentialReward)
    }, 0.0)

  return {
    delegateStake,
    potentialReward
  }
}

export function mapDelegators (delegators) {
  if (!delegators) return []

  return delegators.map((delegator, i) => {
    const { avatar } = getAvatar(
      delegator
        .rewardOwner
        .addresses[0]
    )
    return {
      ...delegator,
      avatar,
      index: i + 1
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

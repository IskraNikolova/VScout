const BigNumber = require('bignumber.js')

import { round, getAvatar } from './commons.js'
import { getRemainingCapacity } from './stake.js'
import { countDownCounter, diff, substract24Hours, add24Hours } from './../modules/time.js'
import { _getValidatorById } from './../modules/networkCChain.js'

/**
* @param {Array} Array of validators
* @param {Array} Array of delegators
* @param {Array} Array of current validators on Default Subnet
* @param {Boolean} is init app processing
* @returns {Object} Object with { sum of all stake (valiadate + delegate), all validate stake, all delegate stake, processing validators }
*/
export async function validatorProcessing (
  validators,
  delegatorsD,
  defaultValidators,
  isInit) {
  if (!validators) {
    return {
      allStake: 0,
      validatedStake: 0,
      delegatedStake: 0,
      validators: []
    }
  }

  const data = await mapValidators(
    validators,
    delegatorsD,
    defaultValidators,
    isInit
  )

  const {
    validatorsMap,
    validatedStake,
    delegatedStake,
    incomingVal,
    outcomingVal
  } = data

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
    allStake,
    validatedStake,
    delegatedStake,
    validators: result,
    incomingVal,
    outcomingVal
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

export async function mapDefaultValidators (
  validators,
  defaultValidators,
  isInit) {
  const validatorsMap = await Promise.all(validators.map(async (val) => {
    if (!defaultValidators) defaultValidators = []

    const currentValidator = defaultValidators
      .find(v => v.nodeID === val.nodeID)

    let info = {}
    if (currentValidator) {
      info = {
        name: currentValidator.name,
        link: currentValidator.link,
        bio: currentValidator.bio,
        website: currentValidator.website,
        avatarUrl: currentValidator.avatar,
        rating: currentValidator.rating ? currentValidator.rating : '0'
      }
    }
    try {
      if (isInit) {
        info = await _getValidatorById(val.nodeID)
      }
    } catch (err) {
      if (currentValidator) {
        info = {
          name: currentValidator.name,
          link: currentValidator.link,
          bio: currentValidator.bio,
          website: currentValidator.website,
          avatarUrl: currentValidator.avatar,
          rating: currentValidator.rating ? currentValidator.rating : '0'
        }
      }
    }

    if (val.weight) {
      val.stakeAmount = currentValidator.stakeAmount
      val.rewardOwner = currentValidator.rewardOwner
      val.delegationFee = currentValidator.delegationFee
      val.delegators = currentValidator.delegators
      val.potentialReward = currentValidator.potentialReward
    }

    const avatar = info.avatarUrl ? info.avatarUrl : getAvatar(val.nodeID).monster
    const name = info.name ? info.name : val.nodeID

    return {
      ...val,
      rating: info.rating,
      name,
      avatar,
      link: info.link,
      bio: info.bio,
      website: info.website
    }
  }))

  return {
    validators: validatorsMap
  }
}

export async function mapValidators (
  validators,
  del,
  defaultValidators,
  isInit) {
  let validatedStake = new BigNumber(0)
  let delegatedStake = new BigNumber(0)
  const incomingVal = { validators: 0, stake: new BigNumber(0) }
  const outcomingVal = { validators: 0, stake: new BigNumber(0) }

  const hours24Ago = substract24Hours()
  const next24Hours = add24Hours()
  const validatorsMap = await Promise.all(validators.map(async (val) => {
    if (!defaultValidators) defaultValidators = []

    if (Number(val.startTime) >= Number(hours24Ago)) {
      incomingVal.validators++
      incomingVal.stake = BigNumber
        .sum(val.stakeAmount, incomingVal.stake)
    } else if (Number(val.endTime) <= Number(next24Hours)) {
      outcomingVal.validators++
      outcomingVal.stake = BigNumber
        .sum(val.stakeAmount, incomingVal.stake)
    }

    const currentValidator = defaultValidators
      .find(v => v.nodeID === val.nodeID)
    let info = {}
    if (currentValidator) {
      info = {
        name: currentValidator.name,
        link: currentValidator.link,
        bio: currentValidator.bio,
        website: currentValidator.website,
        avatarUrl: currentValidator.avatar,
        rating: currentValidator.rating ? currentValidator.rating : '0'
      }
    }
    try {
      if (isInit) {
        info = await _getValidatorById(val.nodeID)
      }
    } catch (err) {
      console.log(err)
      if (currentValidator) {
        info = {
          name: currentValidator.name,
          link: currentValidator.link,
          bio: currentValidator.bio,
          website: currentValidator.website,
          avatarUrl: currentValidator.avatar,
          rating: currentValidator.rating ? currentValidator.rating : '0'
        }
      }
    }

    if (val.weight) {
      val.stakeAmount = currentValidator.stakeAmount
      val.rewardOwner = currentValidator.rewardOwner
      val.delegationFee = currentValidator.delegationFee
      val.delegators = currentValidator.delegators
      val.potentialReward = currentValidator.potentialReward
    }

    validatedStake = BigNumber
      .sum(validatedStake, val.stakeAmount)

    let currentDelegators = val.delegators
    if (!currentDelegators && del) {
      currentDelegators = del
        .filter(d => d.nodeID === val.nodeID)
    }

    const props = getDelegatorDetails(currentDelegators)
    const delegateStake = props.delegateStake
    delegatedStake = BigNumber.sum(delegatedStake, delegateStake)
    const delegatePotentialReward = props.potentialReward

    const countDownCounterRes = countDownCounter(val.endTime)
    const remainingTime = countDownCounterRes.countdown

    const totalStakeAmount = BigNumber
      .sum(val.stakeAmount, delegateStake)

    const remainingCapacity = getRemainingCapacity(
      val.stakeAmount,
      delegateStake
    )

    const isMinimumAmountForStake = countDownCounterRes
      .isMinimumAmountForStake

    const avatar = info.avatarUrl ? info.avatarUrl : getAvatar(val.nodeID).monster
    const name = info.name ? info.name : val.nodeID
    const duration = diff(val.endTime, val.startTime)

    return {
      ...val,
      rating: info.rating,
      name,
      avatar,
      duration,
      link: info.link,
      bio: info.bio,
      website: info.website,
      remainingTime,
      delegateStake: delegateStake.toString(),
      totalStakeAmount: totalStakeAmount.toString(),
      remainingCapacity,
      isMinimumAmountForStake,
      delegatePotentialReward,
      delegators: currentDelegators
    }
  }))

  return {
    validatorsMap,
    validatedStake,
    delegatedStake,
    incomingVal,
    outcomingVal
  }
}

export function mapPendingValidators (
  validators,
  defaultValidators) {
  if (!validators) return []

  return validators.map((val) => {
    let currentValidator = {}
    if (val.weight) {
      currentValidator = defaultValidators
        .find(v => v.nodeID === val.nodeID)
      val.stakeAmount = currentValidator.stakeAmount
    }

    const countDownCounterRes = countDownCounter(val.endTime)
    const remainingTime = countDownCounterRes
      .countdown

    const totalStakeAmount = parseFloat(val.stakeAmount)
    const remainingCapacity = getRemainingCapacity(val.stakeAmount, 0)
    const isMinimumAmountForStake = true

    const avatar = getAvatar(val.nodeID).monster
    const name = val.nodeID
    const duration = diff(val.endTime, val.startTime)

    return {
      ...val,
      name,
      avatar,
      duration,
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
  const incomingDel = { delegations: 0, stake: new BigNumber(0) }
  const outcomingDel = { delegations: 0, stake: new BigNumber(0) }

  const hours24Ago = substract24Hours()
  const next24Hours = add24Hours()
  const result = delegators.map((delegator, i) => {
    if (Number(delegator.startTime) >= Number(hours24Ago)) {
      incomingDel.delegations++
      incomingDel.stake = BigNumber
        .sum(delegator.stakeAmount, incomingDel.stake)
    } else if (Number(delegator.endTime) <= Number(next24Hours)) {
      outcomingDel.delegations++
      outcomingDel.stake = BigNumber
        .sum(delegator.stakeAmount, outcomingDel.stake)
    }
    const { avatar } = getAvatar(
      delegator
        .rewardOwner
        .addresses[0]
    )
    const duration = diff(delegator.endTime, delegator.startTime)
    return {
      ...delegator,
      duration,
      avatar,
      index: i + 1
    }
  })

  return {
    delegators: result,
    incomingDel,
    outcomingDel
  }
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

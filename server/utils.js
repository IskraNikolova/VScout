const moment = require('moment')
const BigNumber = require('bignumber.js')

const CAPACITY = 5

module.exports = {
  mapValidators: async (validators) => {
    let validatedStake = new BigNumber(0)
    let delegatedStake = new BigNumber(0)
    const delegators = []
    let incomingVal = { validators: 0, stake: new BigNumber(0) }
    let outcomingVal = { validators: 0, stake: new BigNumber(0) }
  
    const hours24Ago = substract24Hours()
    const next24Hours = add24Hours()
    const validatorsMap = await Promise.all(validators.map(async (val) => {
      if (Number(val.startTime) >= Number(hours24Ago)) {
        incomingVal.validators++
        incomingVal.stake = BigNumber
          .sum(val.stakeAmount, incomingVal.stake)
      } else if (Number(val.endTime) <= Number(next24Hours)) {
        outcomingVal.validators++
        outcomingVal.stake = BigNumber
          .sum(val.stakeAmount, incomingVal.stake)
      }

      validatedStake = BigNumber
        .sum(validatedStake, val.stakeAmount)
  
      let currentDelegators = val.delegators
      delegators.push.apply(delegators, currentDelegators)

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
  
      const duration = diff(val.endTime, val.startTime)
  
      return {
        ...val,
        duration,
        remainingTime,
        delegateStake: delegateStake.toString(),
        totalStakeAmount: totalStakeAmount.toString(),
        remainingCapacity,
        isMinimumAmountForStake,
        delegatePotentialReward,
        delegators: currentDelegators
      }
    }))
    const result = process({
      validatorsMap,
      validatedStake,
      delegatedStake
    })
    return {
        ...result,
        delegators,
        incomingVal,
        outcomingVal
    }
  }
}

function process ({
    validatorsMap,
    validatedStake,
    delegatedStake
    }) {

    // get all staked AVAX
    const allStake = BigNumber
      .sum(validatedStake, delegatedStake)

    // get and set percent for total stake (own and delegated)
    let validatorsResult = validatorsMap.map((v) => {
      v.percent = getPercent(v.totalStakeAmount, allStake)
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
      allStake,
      validatedStake,
      delegatedStake,
      validators: result
    }
}
function substract24Hours()  {
  return moment().subtract(24, 'h').format('X')
}

function add24Hours () {
  return moment().add(24, 'h').format('X')
}

function diff (s, e) {
  const a = moment(new Date(Number(s) * 1000))
  const b = moment(new Date(Number(e) * 1000))
  const result = a.diff(b)
  return result
}
function countDownCounter (e) {
  const currentTime = moment(new Date() / 1000)
  const leftTime = moment(new Date(Number(e))) - currentTime
  let duration = moment.duration(leftTime, 'seconds')
  duration = moment.duration(duration.asSeconds(), 'seconds')

  const isMinimumAmountForStake = (duration.months() < 1 && duration.days() >= 14) || duration.months() >= 1
  const months = duration.months().toString().padStart(2, '0')
  const days = duration.days().toString().padStart(2, '0')
  const hours = duration.hours().toString().padStart(2, '0')
  const minutes = duration.minutes().toString().padStart(2, '0')
  // const seconds = duration.seconds().toString().padStart(2, '0')
  const result = `${months} : ${days} : ${hours} : ${minutes}`

  return { countdown: result, isMinimumAmountForStake }
}

function getDelegatorDetails (delegators) {
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
  
  function getRemainingCapacity (stakeAmount, delegateStakeAmount) {
    const ownStake = new BigNumber(stakeAmount)
    const delegateStake = new BigNumber(delegateStakeAmount)
  
    const capacity = maxStake(ownStake)
    const consumed = BigNumber.sum(ownStake, delegateStake)
  
    const remainingCapacity = capacity
      .minus(consumed)
  
    return remainingCapacity.toNumber()
  }
  
  function maxStake (ownStake) {
    // 5 times the validator's stake
    const relativeMaxStake = ownStake.multipliedBy(CAPACITY)
  
    // absolute max stake
    const multiply = new BigNumber(10).pow(new BigNumber(6 + 9))
    const absMaxStake = new BigNumber(3).multipliedBy(multiply)
  
    if (relativeMaxStake.lt(absMaxStake)) return relativeMaxStake
  
    return absMaxStake
  }

  function getPercent (v, s) {
    v = new BigNumber(v)
    const allStake = new BigNumber(s)
    const y = new BigNumber(100)
    const res = v.multipliedBy(y)
  
    const result = res.dividedBy(allStake)
  
    return result.toFixed(7)
  }

function compare (a, b) {
  const get = (a, b) => { return b - a }
  const compareStake = parseFloat(b.totalStakeAmount) - parseFloat(a.totalStakeAmount)
  const temp = {
    false: compareStake,
    true: get(b.startTime, b.endTime) - get(a.startTime, a.endTime)
  }

  return temp[compareStake === 0]
}

function cumulativeStake (currentValidators) {
  return currentValidators.reduce((result, item) => {
    result += parseFloat(item.percent)
    return Math.min(round(result, 10), 100)
  }, 0.0)
}

function round (num, prec) {
  const multiplier = Math.pow(prec, 1 || 0)
  return Math.round((num + Number.EPSILON) * multiplier) / multiplier
}
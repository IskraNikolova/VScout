const BigNumber = require('bignumber.js')

import { round, getAvatar } from './commons.js'
import { getRemainingCapacity } from './stake.js'
import { countDownCounter, diff } from './../modules/time.js'
import { _getValidatorById } from './../modules/networkCChain.js'

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
  isInit,
  peers) {
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
    isInit,
    peers
  )

  const {
    validatorsMap,
    validatedStake,
    delegatedStake
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

    let avatar = ''
    const name = info.name ? info.name : val.nodeID
    let link = ''
    let bio = ''
    let website = ''

    try {
      avatar = t[`${info.avatarUrl}`].avatar
      link = t[`${info.avatarUrl}`].link
      bio = t[`${info.avatarUrl}`].bio
      website = t[`${info.avatarUrl}`].website
    } catch (err) {
      avatar = info.avatarUrl ? info.avatarUrl : getAvatar(val.nodeID).monster
      link = info.link ? info.link : ''
      bio = info.bio ? info.bio : ''
      website = info.website ? info.website : ''
    }
    val.avatar = avatar
    val.name = name
    val.link = link
    val.bio = bio
    val.website = website

    return {
      ...val,
      rating: info.rating
      // continent: peerInfo.continent,
      // country: peerInfo.country,
      // countryCode: peerInfo.countryCode,
      // version: peerInfo.version,
      // lastReceived: peerInfo.lastReceived,
      // lastSent: peerInfo.lastSent
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
  isInit,
  peers = []) {
  let validatedStake = new BigNumber(0)
  let delegatedStake = new BigNumber(0)

  const validatorsMap = await Promise.all(validators.map(async (val) => {
    if (!defaultValidators) defaultValidators = []

    const currentValidator = defaultValidators
      .find(v => v.nodeID === val.nodeID)

    const peerInfo = {
      continent: '',
      country: '',
      countryCode: '',
      version: '',
      lastReceived: '',
      lastSent: ''
    }

    if (currentValidator && currentValidator.version) {
      peerInfo.continent = currentValidator.continent
      peerInfo.country = currentValidator.country
      peerInfo.countryCode = currentValidator.countryCode
      peerInfo.version = currentValidator.version
      peerInfo.lastReceived = currentValidator.lastReceived
      peerInfo.lastSent = currentValidator.lastSent
    }
    const peer = peers
      .find(p => p.nodeID === val.nodeID)

    if (peer) {
      peerInfo.continent = peer.continent
      peerInfo.country = peer.country
      peerInfo.countryCode = peer.countryCode
      peerInfo.version = peer.version
      peerInfo.lastReceived = peer.lastReceived
      peerInfo.lastSent = peer.lastSent
    }

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

    let avatar = ''
    const name = info.name ? info.name : val.nodeID
    let link = ''
    let bio = ''
    let website = ''

    try {
      avatar = t[`${info.avatarUrl}`].avatar
      link = t[`${info.avatarUrl}`].link
      bio = t[`${info.avatarUrl}`].bio
      website = t[`${info.avatarUrl}`].website
    } catch (err) {
      avatar = info.avatarUrl ? info.avatarUrl : getAvatar(val.nodeID).monster
      link = info.link ? info.link : ''
      bio = info.bio ? info.bio : ''
      website = info.website ? info.website : ''
    }
    val.avatar = avatar
    val.name = name
    val.link = link
    val.bio = bio
    val.website = website

    const duration = diff(val.endTime, val.startTime)

    return {
      ...val,
      rating: info.rating,
      duration,
      remainingTime,
      delegateStake: delegateStake.toString(),
      totalStakeAmount: totalStakeAmount.toString(),
      remainingCapacity,
      isMinimumAmountForStake,
      delegatePotentialReward,
      delegators: currentDelegators,
      continent: peerInfo.continent,
      country: peerInfo.country,
      countryCode: peerInfo.countryCode,
      version: peerInfo.version,
      lastReceived: peerInfo.lastReceived,
      lastSent: peerInfo.lastSent
    }
  }))

  return {
    validatorsMap,
    validatedStake,
    delegatedStake
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

export function mapPendingDelegations (
  delegations) {
  if (!delegations) return []

  return delegations.map((val) => {
    const countDownCounterRes = countDownCounter(val.endTime)
    const remainingTime = countDownCounterRes
      .countdown
    const duration = diff(val.endTime, val.startTime)

    return {
      ...val,
      duration,
      remainingTime
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

  const result = delegators.map((delegator, i) => {
    const { avatar } = getAvatar(
      delegator
        .rewardOwner
        .addresses[0]
    )
    const countDownCounterRes = countDownCounter(delegator.endTime)
    const remainingTime = countDownCounterRes
      .countdown
    const duration = diff(delegator.endTime, delegator.startTime)
    return {
      ...delegator,
      remainingTime,
      duration,
      avatar,
      index: i + 1
    }
  })

  return {
    delegators: result
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

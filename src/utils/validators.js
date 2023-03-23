const BigNumber = require('bignumber.js')

import { round, getAvatar } from './commons.js'
import { getRemainingCapacity } from './stake.js'
import { countDownCounter, diff } from './../modules/time.js'
import { _getValidatorById } from './../modules/networkCChain.js'

const allNodesInfo = {
  avatar: '/statics/circle_symbol.svg',
  bio: 'Masternodes, Full Nodes, Staking Services',
  link: 'https://www.allnodes.com/?utm_source=vscout&utm_medium=validator-list',
  website: 'Allnodes'
}
const t = {
  'https://bit.ly/3q5aMGC': allNodesInfo,
  '/statics/circle_symbol.svg': allNodesInfo
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

export function compareNotificationNode (oldN, newN) {
  const msgs = []
  if (oldN.connected !== newN.connected) {
    if (newN.connected) {
      msgs.push({
        date: Date.now(),
        type: true,
        icon: 'power',
        title: 'Connected',
        message: 'Node state changed to connected.'
      })
    } else {
      msgs.push({
        date: Date.now(),
        type: false,
        icon: 'power_off',
        title: 'Disconnected',
        message: 'Node state changed to disconnected.'
      })
    }
  }
  const oldUptime = round(oldN.uptime * 100, 1000)
  const newUptime = round(newN.uptime * 100, 1000)
  if (oldUptime - newUptime >= 0.1) {
    msgs.push({
      date: Date.now(),
      type: false,
      icon: 'arrow_circle_down',
      title: 'Uptime Down',
      message: `Node UPTIME decreased from ${oldUptime}% to ${newUptime}%.`
    })
  } else if (newUptime - oldUptime >= 0.1) {
    msgs.push({
      date: Date.now(),
      type: true,
      icon: 'arrow_circle_up',
      title: 'Uptime Up',
      message: `Node UPTIME increased from ${oldUptime}% to ${newUptime}%.`
    })
  }

  const oldLength = oldN.delegators ? oldN.delegators : 0
  const newLength = newN.delegators ? newN.delegators : 0
  if (oldLength !== newLength) {
    if (oldLength > newLength) {
      msgs.push({
        date: Date.now(),
        type: true,
        icon: 'person_remove',
        title: `${newLength} Delegations`,
        message: 'The staking time of one or more delegations is over.'
      })
    } else if (oldLength < newLength) {
      msgs.push({
        date: Date.now(),
        type: true,
        icon: 'person_add',
        title: `${newLength} Delegations`,
        message: 'А new delegation has been added.'
      })
    }
  }

  return msgs
}

export async function mapDefaultValidators (
  validators,
  defaultValidators,
  isInit) {
  const validatorsMap = await Promise.all(validators.map(async (val) => {
    if (!defaultValidators) defaultValidators = []
    const clearDefaultValidators = defaultValidators.filter(x => !!x)
    if (!defaultValidators[0]) defaultValidators = defaultValidators.shift()
    const currentValidator = clearDefaultValidators
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

    if (val.weight && currentValidator) {
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
    }
  }))

  return {
    validators: validatorsMap
  }
}

export async function mapValidators (
  validators,
  defaultValidators,
  isInit,
  peers = []) {
  let validatedStake = new BigNumber(0)
  let delegatedStake = new BigNumber(0)

  const validatorsMap = await Promise.all(validators.map(async (val) => {
    if (!defaultValidators) defaultValidators = []
    let uptime = val.uptime
    const currentValidator = defaultValidators
      .find(v => v.nodeID === val.nodeID)

    const peerInfo = {
      continent: '',
      country: '',
      countryCode: '',
      isp: '',
      version: '',
      lastReceived: '',
      lastSent: ''
    }

    if (currentValidator && currentValidator.version) {
      peerInfo.continent = currentValidator.continent
      peerInfo.country = currentValidator.country
      peerInfo.isp = currentValidator.isp
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
      peerInfo.isp = peer.isp
      peerInfo.countryCode = peer.countryCode
      peerInfo.version = peer.version
      peerInfo.lastReceived = peer.lastReceived
      peerInfo.lastSent = peer.lastSent
    }

    let info = {}
    if (currentValidator) {
      uptime = currentValidator.uptime
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

    if (val.weight && currentValidator) {
      val.stakeAmount = currentValidator.stakeAmount
      val.rewardOwner = currentValidator.rewardOwner
      val.delegationFee = currentValidator.delegationFee
      val.delegators = currentValidator.delegators
      val.potentialReward = currentValidator.potentialReward
    }

    validatedStake = BigNumber
      .sum(validatedStake, val.stakeAmount)

    const props = getDelegatorDetails(val.delegators)
    const delegateStake = props.delegateStake
    delegatedStake = BigNumber.sum(delegatedStake, delegateStake)

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
      avatar = t[`${info.avatarUrl}`](info).avatar
      link = t[`${info.avatarUrl}`](info).link
      bio = t[`${info.avatarUrl}`](info).bio
      website = t[`${info.avatarUrl}`](info).website
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
    val.delegators = val.delegators ? val.delegators.length : 0
    return {
      ...val,
      uptime,
      rating: info.rating,
      duration,
      remainingTime,
      delegateStake: delegateStake.toString(),
      totalStakeAmount: totalStakeAmount.toString(),
      remainingCapacity,
      isMinimumAmountForStake,
      continent: peerInfo.continent,
      country: peerInfo.country,
      isp: peerInfo.isp,
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
  const pendingValidators = validators.map((val) => {
    let currentValidator = {}
    if (val.weight) {
      currentValidator = defaultValidators
        .filter(v => !!v)
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
  return {
    pendingValidators
  }
}

export function mapPendingDelegations (
  delegations) {
  if (!delegations) return []

  const pendingDelegations = delegations.map((val) => {
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

  return {
    pendingDelegations
  }
}

export function getDelegatorDetails (delegators) {
  if (!delegators) {
    return {
      delegateStake: 0
    }
  }

  const delegateStake = delegators
    .reduce((a, b) => {
      return BigNumber.sum(a, b.stakeAmount)
    }, 0.0)

  return {
    delegateStake
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

  return result
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

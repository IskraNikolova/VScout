const BigNumber = require('bignumber.js')

import { fromNow } from './../modules/time'
import { groupBy, round, getAvatar } from './commons'
import { _getValidatorById } from './../modules/networkRpc'

/**
* @param {Array} Array of validators and delegators for split
* @returns {Object} Object of two arrays - current validators and delegators
*/
export function splitAccounts (validators) {
  const grouped = groupBy(validators, 'id')
  const keys = Object.keys(grouped)
  return keys.reduce((result, key) => {
    grouped[key]
      .sort((a, b) => a.startTime - b.startTime)
    result.v.push(grouped[key].shift())
    result.d.push(...grouped[key])
    return result
  }, { v: [], d: [] })
}

/**
* @param {Array} Array of validators and delegators for split
* @param {Array} Array of existing validators and delegators
* @returns {Object} Object of current validators and delegators
*/
export function splitPendingAccounts (validators, existValidators) {
  return validators.reduce((result, val) => {
    if (existValidators
      .find(v => v.validator === val.id)) {
      result.d.push(val)
    } else {
      result.v.push(val)
    }
    return result
  }, { v: [], d: [] })
}

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
    const info = await _getValidatorById(val.id)
    let address = ''
    let delegateStake = 0
    let delegatorsCount = 0
    let weight = 0
    let stakeAmount = 0
    if (val.weight) {
      weight = val.weight

      const currentValidator = defaultValidators
        .find(v => v.validator === val.id)
      stakeAmount = currentValidator.stakenAva
    } else {
      address = val.address
      stakeAmount = val.stakeAmount

      const props = getDelegatorsForNode(val, delegators)
      delegateStake = props.delegateStake
      delegatorsCount = props.delegatorsCount
    }

    const avatar = info.avatarUrl ? info.avatarUrl : getAvatar(val.id).monster
    const name = info.name ? info.name : val.id
    const total = parseFloat(stakeAmount) + parseFloat(delegateStake)

    return {
      name,
      avatar,
      weight,
      address,
      delegatorsCount,
      totalnAva: total,
      validator: val.id,
      endTime: val.endTime,
      startTime: val.startTime,
      total: getAvaFromnAva(total),
      fromNowST: fromNow(val.startTime),
      delegateStakenAva: delegateStake,
      stake: getAvaFromnAva(stakeAmount),
      stakenAva: parseFloat(stakeAmount),
      delegateStake: getAvaFromnAva(delegateStake),
      link: info.link
    }
  }))

  return res
}

export function getDelegatorsForNode (validator, delegators) {
  if (!delegators) {
    return {
      delegateStake: 0,
      delegatorsCount: 0
    }
  }

  const currentDelegators = delegators
    .filter(d => d.id === validator.id)

  const delegateStake = currentDelegators
    .reduce((a, b) => {
      return a + parseFloat(b.stakeAmount)
    }, 0.0)

  return {
    delegateStake,
    delegatorsCount: currentDelegators.length
  }
}

export function mapDelegators (delegators) {
  if (!delegators) return []
  return delegators.map((delegator, i) => {
    const { avatar } = getAvatar(delegator.id)
    const nodeId = delegator.id

    return {
      avatar,
      nodeId,
      index: i + 1,
      endTime: delegator.endTime,
      pAccount: delegator.address,
      startTime: delegator.startTime,
      fromNowST: fromNow(delegator.startTime),
      stake: getAvaFromnAva(delegator.stakeAmount),
      stakenAva: parseFloat(delegator.stakeAmount)
    }
  })
}

function cumulativeStake (currentValidators) {
  return currentValidators.reduce((result, item) => {
    result += parseFloat(item.percent)
    return round(result, 1000)
  }, 0.0)
}

function getPercent (v, s) {
  v = new BigNumber(v)
  const allStake = new BigNumber(s)
  const y = new BigNumber(100)
  const res = v.multipliedBy(y)

  const result = res.dividedBy(allStake)

  return result.toFixed(9)
}

function getAvaFromnAva (v) {
  return parseFloat(v) / 10 ** 9
}

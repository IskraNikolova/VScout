const BigNumber = require('bignumber.js')

import { fromNow } from './../modules/time'
import { groupBy, round, makeMD5 } from './commons'

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
export function validatorProcessing (validators, delegators, defaultValidators) {
  const val = mapValidators(validators, delegators, defaultValidators)
  let newVal = val.map((v) => {
    v.precent = getPrecent(v.total, stake(val))
    return v
  })
  newVal = newVal.sort(compare)
  return newVal.map((v, i) => {
    v.rank = i + 1
    const currentValidators = newVal.slice(0, i + 1)
    v.cumulativeStake = cumulativeStake(currentValidators)
    return v
  })
}

function cumulativeStake (currentValidators) {
  return currentValidators.reduce((result, item) => {
    result += parseFloat(item.precent)
    return round(result, 1000)
  }, 0)
}

export function compare (a, b) {
  const get = (a, b) => { return b - a }
  const compareStake = Number(b.total) - Number(a.total)
  const temp = {
    false: compareStake,
    true: get(b.startTime, b.endTime) - get(a.startTime, a.endTime)
  }

  return temp[compareStake === 0]
}

export function mapValidators (validators, delegators, defaultValidators) {
  try {
    const vals = validators.map((val) => {
      // const info = await _getValidatorById(val.id)
      const {
        stakeAmount,
        delegateStake,
        delegatorsCount,
        weight
      } = stakeAndWeight(val, delegators, defaultValidators)

      const MD5 = makeMD5()
      const hash = MD5.hex(val.id)
      const avatar = `http://www.gravatar.com/avatar/${hash}?d=monsterid&s=150` // info.avatarUrl ? info.avatarUrl : `http://www.gravatar.com/avatar/${hash}?d=monsterid&s=150`
      const name = val.id // info.name ? info.name : val.id
      const total = Number(stakeAmount) + Number(delegateStake)

      return {
        name,
        avatar,
        weight,
        delegatorsCount,
        validator: val.id,
        address: val.address ? val.address : '',
        endTime: val.endTime,
        startTime: val.startTime,
        stake: getAvaFromnAva(stakeAmount),
        stakenAva: parseFloat(stakeAmount),
        delegateStake: getAvaFromnAva(delegateStake),
        delegateStakenAva: delegateStake,
        totalnAva: total,
        total: getAvaFromnAva(total),
        fromNowST: fromNow(val.startTime)
        // link: info.link
      }
    })

    return vals
  } catch (err) {
    return {}
  }
}

export function stakeAndWeight (validator, delegators, defaultValidators) {
  if (validator.weight) {
    const currentValidator = defaultValidators
      .find(v => v.validator === validator.id)

    return {
      delegateStake: 0,
      delegatorsCount: 0,
      stakeAmount: currentValidator.stakenAva,
      weight: validator.weight
    }
  }

  const currentDelegators = delegators
    .filter(d => d.id === validator.id)
  let delegateStake = 0
  try {
    delegateStake = currentDelegators
      .reduce((a, b) => {
        return Number(a.stakeAmount) + Number(b.stakeAmount)
      })
    if (typeof delegateStake === 'object') {
      delegateStake = Number(delegateStake.stakeAmount)
    }
  } catch (err) {
  }

  return {
    delegateStake,
    delegatorsCount: currentDelegators ? currentDelegators.length : 0,
    stakeAmount: validator.stakeAmount,
    weight: 0
  }
}

export function getPrecent (v, s) {
  v = new BigNumber(getAvaFromnAva(v))
  const allStake = new BigNumber(s)
  const y = new BigNumber(100)
  const res = v.multipliedBy(y)

  const result = res.dividedBy(allStake)
  return result.toFixed(8)
}

export function stake (validators) {
  return validators.reduce((a, b) => {
    if (!b.total) return
    return a + (parseFloat(b.total) / 10 ** 9)
  }, 0.0)
}

function getAvaFromnAva (v) {
  return Number(v) / 10 ** 9
}

export function mapDelegators (delegators) {
  const result = delegators.map((delegator, i) => {
    const sa = delegator.stakeAmount
    const MD5 = makeMD5()
    const hash = MD5.hex(delegator.id)
    const avatar = 'http://www.gravatar.com/avatar/' + hash + '?d=identicon&s=150'
    const nodeId = delegator.id

    return {
      index: i + 1,
      pAccount: delegator.address,
      stake: getAvaFromnAva(sa),
      stakenAva: parseFloat(sa),
      startTime: delegator.startTime,
      endTime: delegator.endTime,
      fromNowST: fromNow(delegator.startTime),
      avatar,
      nodeId
    }
  })
  return result
}

export const temp = {
  minute: {
    sub: { value: 30, label: 'minute' },
    interval: { value: 60, label: 's' },
    label: '60 seconds'
  },
  hourTwo: {
    sub: { value: 2, label: 'hour' },
    interval: { value: 5, label: 'm' },
    label: '5 minutes'
  },
  day: {
    sub: { value: 1, label: 'day' },
    interval: { value: '', label: 'hour' },
    label: '1 hour'
  },
  week: {
    sub: { value: 7, label: 'days' },
    interval: { value: '', label: 'day' },
    label: '24 hours'
  },
  month: {
    sub: { value: 1, label: 'months' },
    interval: { value: '', label: 'day' },
    label: '1 day'
  },
  year: {
    sub: { value: 1, label: 'years' },
    interval: { value: '', label: 'month' },
    label: '1 month'
  }
}

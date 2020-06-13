import { groupBy, round, makeMD5 } from './commons'
const BigNumber = require('bignumber.js')
import { fromNow } from './../modules/time'

/**
* @param {Array} array of accounts for split
* @returns {object} two types of accounts
*/
export function splitAccounts (validators) {
  const grouped = groupBy(validators, 'id')
  const v = []
  const d = []
  const keys = Object.keys(grouped)
  for (let i = 0; i < keys.length; i++) {
    grouped[keys[i]]
      .sort((a, b) => a.startTime - b.startTime)
    v.push(grouped[keys[i]].shift())
    d.push(...grouped[keys[i]])
  }

  return { v, d }
}

export function getVal (validators, defaultValidators) {
  validators = validators
    .sort(compare)
  const val = mapValidators(validators, defaultValidators)
  return val.map((v, i) => {
    const currentValidators = val.slice(0, i + 1)
    v.cumulativeStake = cumulativeStake(currentValidators)
    return v
  })
}

export function cumulativeStake (currentValidators) {
  return currentValidators.reduce((result, item) => {
    result += parseFloat(item.precent)
    return round(result, 1000)
  }, 0)
}
export function compare (a, b) {
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

export function mapValidators (validators, defaultValidators) {
  try {
    const vals = validators.map((val, i) => {
      // const info = await _getValidatorById(val.id)
      const { stakeAmount, weight } = stakeAndWeight(val, defaultValidators)
      const MD5 = makeMD5()
      const hash = MD5.hex(val.id)
      const avatar = `http://www.gravatar.com/avatar/${hash}?d=monsterid&s=150` // info.avatarUrl ? info.avatarUrl : `http://www.gravatar.com/avatar/${hash}?d=monsterid&s=150`
      const name = val.id // info.name ? info.name : val.id

      return {
        name,
        avatar,
        weight,
        rank: i + 1,
        validator: val.id,
        address: val.address ? val.address : '',
        endTime: val.endTime,
        startTime: val.startTime,
        stake: getAvaFromnAva(stakeAmount),
        stakenAva: parseFloat(stakeAmount),
        fromNowST: fromNow(val.startTime),
        precent: getPrecent(stakeAmount, stake(validators))
        // link: info.link
      }
    })

    return vals
  } catch (err) {
    console.log(err)
    return {}
  }
}

function stakeAndWeight (validator, defaultValidators) {
  if (validator.weight) {
    const currentValidator = defaultValidators
      .find(v => v.validator === validator.id)
    if (!currentValidator) return

    return {
      stakeAmount: currentValidator.stakenAva,
      weight: validator.weight
    }
  }

  return {
    stakeAmount: validator.stakeAmount ? validator.stakeAmount : validator.weight,
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
    if (!b.stakeAmount) return
    return a + (parseFloat(b.stakeAmount) / 10 ** 9)
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

export function splitPendingAccounts (validators, existValidators) {
  const v = []
  const d = []
  for (let i = 0; i < validators.length; i++) {
    if (existValidators.find(v => v.validator === validators[i].id)) {
      d.push(validators[i])
    } else {
      v.push(validators[i])
    }
  }
  return { v, d }
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

const moment = require('moment')
const BigNumber = require('bignumber.js')
const { getAvatar } = require('./commons.js')
const axios = require('axios')
  .default
const controllers = require('./controllers')
// let id = 0
// const body = (method, params = {}) => {
//   return {
//     jsonrpc: '2.0',
//     method,
//     params,
//     id: id++
//   }
// }

const filterList = [
  'NodeID-GhyESkMqmZgpRqaYe2s4k2DJ7ZkpK34YJ',
  'NodeID-75NKV3fzWi9GdA45pMs35gkQHgSLXYXs1',
  'NodeID-3dQycjBfoGBrSV678nU6xnNpv5hu8GqTt',
  'NodeID-6tFZuxRu7t4SGkWuAiNvUJy9pMTsZt4sC',
  'NodeID-6yEnkZJBUW3snaeEeJHPBuhtmXroCvZFv',
  'NodeID-FDY8EGJB8MAoQT9UYfU9zAPcohzanA87m',
  'NodeID-4D2iXb4KkgDa36PivB8pQhDKBPhRSAckH',
  'NodeID-P4UEDR5osP5aq8khjjGwiyVthAHYt1ArP',
  'NodeID-Nwr26Q5CPcRfSHQKgQ5y3ayVPgjziWkkT',
  'NodeID-KJPAz45LozvjN23iXHih1jGikZ1u2ZrNj',
  'NodeID-6FSSZuuLEZ4sHJZGfpY4Wuz8M3qnK6ec5',
  'NodeID-9dhM1zG3atcKhiwhjRHZEEsvYBNM9wj6',
  'NodeID-NbJexKdcMyN1E1GYH1ra58jP61dZpt1wu',
  'NodeID-JSKsSxV74dyp94CvBKqEKUcEEKBXyNbge',
  'NodeID-9W5RaY7LA6so9hGCPGfLezBXMnWNRQb8V',
  'NodeID-CY9BmJwkVatHX86Pt3Fkxts1QoKTovyAs'
]

const fs = require('fs')

const CAPACITY = 5

module.exports = {
  mapValidators: (validators, peers) => {
    let validatedStake = new BigNumber(0)
    let delegatedStake = new BigNumber(0)
    let potentialReward = new BigNumber(0)
    const delegatorsMap = {}
    let uptimes, valJs = ''
    try {
      uptimes = fs.readFileSync('uptime.json')
        .toString()
      uptimes = JSON.parse(uptimes)
      valJs = fs.readFileSync('validators.json')
        .toString()
      valJs = JSON.parse(valJs).validators
    } catch (err) {
      console.log(err)
    }
    const validatorsMap = validators.map((val) => {
      const currentValidator = valJs.find(a => a.nodeID === val.nodeID)
      validatedStake = BigNumber
        .sum(validatedStake, val.weight)

      potentialReward = BigNumber
        .sum(potentialReward, val.potentialReward)

      const peer = peers
        .find(p => p.nodeID === val.nodeID)

      if (peer) {
        val.country = peer.country
        val.isp = peer.isp
        val.countryCode = peer.countryCode
        val.version = peer.version
        val.lastReceived = peer.lastReceived
        val.lastSent = peer.lastSent
      }

      const props = getDelegatorDetails(val.delegators)
      delegatorsMap[val.nodeID] = mapDelegators(val.delegators)
      val.delegators = val.delegators ? val.delegators.length : 0

      const nReward = props.potentialReward
      let delegatePotentialReward = nReward
      if (currentValidator && currentValidator.delegators > 0) {
        const cReward = currentValidator.delegatePotentialReward
        if (cReward >= nReward) delegatePotentialReward = cReward
      }

      const countDownCounterRes = countDownCounter(val.endTime)
      const remainingTime = countDownCounterRes.countdown

      const totalStakeAmount = BigNumber
        .sum(val.weight, val.delegatorWeight)
      console.log(totalStakeAmount)
      const remainingCapacity = getRemainingCapacity(
        val.weight,
        val.delegatorWeight
      )

      const isMinimumAmountForStake = countDownCounterRes
        .isMinimumAmountForStake

      const duration = diff(val.endTime, val.startTime)

      const up = uptimes[val.nodeID]

      if (up) {
        const all = up.reduce((a, b) => {
          let u = 0
          if (Number(b.uptime) < 1.1) u = Number(b.uptime) * 100
          else u = Number(b.uptime)
          return a + Number(u)
        }, 0.0)

        val.uptime = (all / up.length).toFixed(3)
      }

      return {
        ...val,
        duration,
        remainingTime,
        delegateStake: delegateStake.toString(),
        totalStakeAmount: totalStakeAmount.toString(),
        remainingCapacity,
        isMinimumAmountForStake,
        delegatePotentialReward
      }
    })

    const result = process({
      validatorsMap,
      validatedStake,
      delegatedStake
    })

    return {
      ...result,
      delegatorsMap,
      potentialReward
    }
  },
  mapValidatorsUpdate: (validators, peers) => {
    const delegatorsMap = {}
    delegatorsMap['length'] = 0
    let validatedStake = new BigNumber(0)
    let delegatedStake = new BigNumber(0)
    let potentialReward = new BigNumber(0)
    let uptimes = ''

    try {
      uptimes = fs.readFileSync('uptime.json')
        .toString()
      uptimes = JSON.parse(uptimes)
    } catch (err) {
      console.log(err)
    }

    const validatorsMap = validators.map((val) => {
      delegatedStake = BigNumber.sum(delegatedStake, val.delegatorWeight)

      validatedStake = BigNumber
        .sum(validatedStake, val.weight)

      potentialReward = BigNumber
        .sum(potentialReward, val.potentialReward)

      const peer = peers
        .find(p => p.nodeID === val.nodeID)

      if (peer) {
        val.country = peer.country
        val.isp = peer.isp
        val.countryCode = peer.countryCode
        val.version = peer.version
        val.lastReceived = peer.lastReceived
        val.lastSent = peer.lastSent
      }

      delegatorsMap[val.nodeID] = mapDelegatorsUpdate(
        val.delegatorCount,
        val.delegatorWeight)
      delegatorsMap.length += parseFloat(val.delegatorCount)

      const countDownCounterRes = countDownCounter(val.endTime)
      const remainingTime = countDownCounterRes.countdown

      const totalStakeAmount = BigNumber
        .sum(val.weight, val.delegatorWeight)

      const remainingCapacity = getRemainingCapacity(
        val.weight,
        val.delegatorWeight
      )

      const isMinimumAmountForStake = countDownCounterRes
        .isMinimumAmountForStake

      const duration = diff(val.endTime, val.startTime)

      const up = uptimes[val.nodeID]

      if (up) {
        const all = up.reduce((a, b) => {
          let u = 0
          if (Number(b.uptime) < 1.1) u = Number(b.uptime) * 100
          else u = Number(b.uptime)
          return a + Number(u)
        }, 0.0)

        val.uptime = (all / up.length).toFixed(3)
      }

      return {
        ...val,
        duration,
        remainingTime,
        totalStakeAmount: totalStakeAmount.toString(),
        remainingCapacity,
        isMinimumAmountForStake
      }
    })

    const result = process({
      validatorsMap,
      validatedStake,
      delegatedStake
    })

    return {
      ...result,
      delegatorsMap,
      potentialReward
    }
  },
  getStakingStats: (validators) => {
    const hours24Ago = substract24Hours()
    const next24Hours = add24Hours()
    const days7Ago = substract7Days()
    const next7Days = add7Days()
    const monthAgo = substractMonth()
    const nextMonth = addMonth()

    const incomingVal = {
      hours: { validators: 0, stake: new BigNumber(0) },
      days: { validators: 0, stake: new BigNumber(0) },
      month: { validators: 0, stake: new BigNumber(0) }
    }

    const outcomingVal = {
      hours: { validators: 0, stake: new BigNumber(0) },
      days: { validators: 0, stake: new BigNumber(0) },
      month: { validators: 0, stake: new BigNumber(0) }
    }

    // const incomingDel = {
    //   hours: { delegations: 0, stake: new BigNumber(0) },
    //   days: { delegations: 0, stake: new BigNumber(0) },
    //   month: { delegations: 0, stake: new BigNumber(0) }
    // }

    // const outcomingDel = {
    //   hours: { delegations: 0, stake: new BigNumber(0) },
    //   days: { delegations: 0, stake: new BigNumber(0) },
    //   month: { delegations: 0, stake: new BigNumber(0) }
    // }

    const temp = {
      hours: {
        incomeVal: {
          true: (val) => {
            incomingVal.hours.validators++
            incomingVal.hours.stake = BigNumber
              .sum(val.weight, incomingVal.hours.stake)
          },
          false: () => {}
        },
        outcomeVal: {
          true: (val) => {
            outcomingVal.hours.validators++
            outcomingVal.hours.stake = BigNumber
              .sum(val.weight, outcomingVal.hours.stake)
          },
          false: () => {}
        }
        // incomeDel: {
        //   true: (del) => {
        //     incomingDel.hours.delegations++
        //     incomingDel.hours.stake = BigNumber
        //       .sum(del.delegatorStake, incomingDel.hours.stake)
        //   },
        //   false: () => {}
        // },
        // outcomeDel: {
        //   true: (del) => {
        //     outcomingDel.hours.delegations++
        //     outcomingDel.hours.stake = BigNumber
        //       .sum(del.delegatorStake, outcomingDel.hours.stake)
        //   },
        //   false: () => {}
        // }
      },
      days: {
        incomeVal: {
          true: (val) => {
            incomingVal.days.validators++
            incomingVal.days.stake = BigNumber
              .sum(val.weight, incomingVal.days.stake)
          },
          false: () => {}
        },
        outcomeVal: {
          true: (val) => {
            outcomingVal.days.validators++
            outcomingVal.days.stake = BigNumber
              .sum(val.weight, outcomingVal.days.stake)
          },
          false: () => {}
        // },
        // incomeDel: {
        //   true: (del) => {
        //     incomingDel.days.delegations++
        //     incomingDel.days.stake = BigNumber
        //       .sum(del.delegatorStake, incomingDel.days.stake)
        //   },
        //   false: () => {}
        // },
        // outcomeDel: {
        //   true: (del) => {
        //     outcomingDel.days.delegations++
        //     outcomingDel.days.stake = BigNumber
        //       .sum(del.delegatorStake, outcomingDel.days.stake)
        //   },
        //  false: () => {}
        }
      },
      month: {
        incomeVal: {
          true: (val) => {
            incomingVal.month.validators++
            incomingVal.month.stake = BigNumber
              .sum(val.weight, incomingVal.month.stake)
          },
          false: () => {}
        },
        outcomeVal: {
          true: (val) => {
            outcomingVal.month.validators++
            outcomingVal.month.stake = BigNumber
              .sum(val.weight, outcomingVal.month.stake)
          },
          false: () => {}
        // },
        // incomeDel: {
        //   true: (del) => {
        //     incomingDel.month.delegations++
        //     incomingDel.month.stake = BigNumber
        //       .sum(del.delegatorStake, incomingDel.month.stake)
        //   },
        //   false: () => {}
        // },
        // outcomeDel: {
        //   true: (del) => {
        //     outcomingDel.month.delegations++
        //     outcomingDel.month.stake = BigNumber
        //       .sum(del.delegatorStake, outcomingDel.month.stake)
        //   },
        //   false: () => {}
        }
      }
    }

    for (let i = 0; i < validators.length; i++) {
      const val = validators[i]
      temp.hours.incomeVal[Number(val.startTime) >= Number(hours24Ago)](val)
      temp.hours.outcomeVal[Number(val.endTime) <= Number(next24Hours)](val)

      temp.days.incomeVal[Number(val.startTime) >= Number(days7Ago)](val)
      temp.days.outcomeVal[Number(val.endTime) <= Number(next7Days)](val)

      temp.month.incomeVal[Number(val.startTime) >= Number(monthAgo)](val)
      temp.month.outcomeVal[Number(val.endTime) <= Number(nextMonth)](val)
      // const dels = delegators[val.nodeID]
      // if (dels) {
      //   for (let j = 0; j < dels.length; j++) {
      //     const del = dels[j]
      //     temp.hours.incomeDel[Number(del.startTime) >= Number(hours24Ago)](del)
      //     temp.hours.outcomeDel[Number(del.endTime) <= Number(next24Hours)](del)

      //     temp.days.incomeDel[Number(del.startTime) >= Number(days7Ago)](del)
      //     temp.days.outcomeDel[Number(del.endTime) <= Number(next7Days)](del)

      //     temp.month.incomeDel[Number(del.startTime) >= Number(monthAgo)](del)
      //     temp.month.outcomeDel[Number(del.endTime) <= Number(nextMonth)](del)
      //   }
      // }
    }

    return {
      incomingVal,
      outcomingVal
      // incomingDel,
      // outcomingDel
    }
  },
  setObserervers: async (i, obsArray) => {
    try {
      let peersInJson = fs.readFileSync('peers.json')
        .toString()
      if (!peersInJson) peersInJson = {}
      const resultPeers = JSON.parse(peersInJson)

      const ob = obsArray.map(o => o.nodeID)
      const peers = resultPeers
        .peers
        .filter(val => !ob.includes(val.nodeID))

      if (peers[i]) {
        const endpoint = 'http://' + peers[i].ip.split(':')[0] + ':9650'
        try {
          await axios.head(endpoint + '/ext/bc/P', {
            timeout: 2000
          })
        } catch (err) {
          if (err.response) {
            const cValidators = fs
              .readFileSync('validators.json')
              .toString()

            const currentValidator = JSON.parse(cValidators)
              .validators
              .find(v => v.nodeID === peers[i].nodeID)

            if (currentValidator && currentValidator.connected) {
              obsArray.push({
                endpoint,
                nodeID: currentValidator.nodeID
              })

              const obs = JSON.stringify({ observers: obsArray })

              fs.writeFileSync('observers.json', obs)
              await controllers.validators.getUptimes(obsArray)
              return
            }
          }
        }
      }
    } catch (err) {
      console.log('err')
    }
  },
  getObserversArray: () => {
    try {
      const obs = fs
        .readFileSync('observers.json')
        .toString()

      if (!obs) return []

      const observers = JSON.parse(obs)
        .observers

      // for (let i = 0; i < observers.length; i++) {
      //   const endpoint = observers[i].endpoint
      //   const response = await axios
      //     .post(endpoint + '/ext/health', body('health.health'))

      //   if (!response.data.error) {
      //     let { checks } = response.data.result
      //     let numPeers = checks
      //       .network
      //       .message
      //       .connectedPeers
      //     observers[i].numPeers = numPeers
      //   }
      // }

      // let peersInJson = fs.readFileSync('peers.json')
      //   .toString()
      // if (!peersInJson) peersInJson = {}
      // const peers = JSON.parse(peersInJson)
      // const numOfPeers = peers.numPeers

      // observers = observers
      //   .filter(i => i.numPeers >= numOfPeers - 100)
      // fs.writeFileSync(
      //   'observers.json',
      //   JSON.stringify({ observers })
      // )

      const validators = fs
        .readFileSync('validators.json')
        .toString()

      const m = observers.map(a => a.nodeID)
      const currentValidators = JSON.parse(validators)
        .validators
        .filter(v => v)
        .filter(function (a) {
          return m.includes(a.nodeID)
        })
      // .filter(v => v.connected)

      const v = currentValidators.map(a => a.nodeID)
      const o = observers
        .filter((v, i, a) => a.findIndex(t => (t.nodeID === v.nodeID)) === i)
        .filter(o => o)
        .filter(function (a) {
          return v.includes(a.nodeID)
        })
        .filter(function (a) {
          return !filterList.includes(a.nodeID)
        })

      if (observers.length > o.length) {
        fs.writeFileSync(
          'observers.json',
          JSON.stringify({ observers: o })
        )
      }
      return observers
    } catch (err) {
      console.log(err)
      return []
    }
  },
  getEndpoints: () => {
    try {
      const observers = fs.readFileSync('observers.json')
        .toString()

      const obs = JSON.parse(observers)

      const endpoints = obs
        .observers
        .map(o => o.endpoint)

      return endpoints
    } catch {
      return [
        'http://44.229.180.165:9650',
        'http://18.116.253.54:9650',
        'http://198.199.65.198:9650'
      ]
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

function mapDelegatorsUpdate (delegatorCount, delegatorWeight) {
  return {
    delegatorCount: delegatorCount,
    delegatorStake: delegatorWeight
  }
}

function mapDelegators (delegators) {
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

function substract24Hours () {
  return moment().subtract(24, 'h').format('X')
}

function add24Hours () {
  return moment().add(24, 'h').format('X')
}

function substract7Days () {
  return moment().subtract(7, 'days').format('X')
}

function add7Days () {
  return moment().add(7, 'days').format('X')
}

function substractMonth () {
  return moment().subtract(1, 'months').format('X')
}

function addMonth () {
  return moment().add(1, 'months').format('X')
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
      return BigNumber.sum(a, b.weight)
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

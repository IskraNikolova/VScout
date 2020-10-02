import {
  compare,
  mapValidators,
  mapDelegators,
  validatorProcessing,
  getDelegatorsForNode
} from './../../../src/utils/validators'

import { fromNow } from './../../../src/modules/time'

const validatorsForProcess = [
    {"startTime":"1600745654","endTime":"1601955254","stakeAmount":"5601800000000","nodeID":"NodeID-2JdttE7aUb19pgp9rJifgrkbHpv79cCGx","rewardOwner":{"locktime":"0","threshold":"1","addresses":["P-avax1a45dgarmwutzng4r25l25lnfltzetsrcjyp0m2"]},"potentialReward":"21173514157","delegationFee":"10.0000","uptime":"0.9989","connected":true,"delegators":null},
    {"startTime":"1600748205","endTime":"1601957805","stakeAmount":"18200000000000","nodeID":"NodeID-Eef8RycdBGmSe9tCZ1biGTLLYrkCHZPUS","rewardOwner":{"locktime":"0","threshold":"1","addresses":["P-avax1efz8chevs4pcr3qd29dzgyuwajkva78f892066"]},"potentialReward":"68774794738","delegationFee":"20.0000","uptime":"0.9918","connected":true,"delegators":null}
]

const expectResult = [
    {"startTime":"1600748205","endTime":"1601957805","stakeAmount":"18200000000000","nodeID":"NodeID-Eef8RycdBGmSe9tCZ1biGTLLYrkCHZPUS","rewardOwner":{"locktime":"0","threshold":"1","addresses":["P-avax1efz8chevs4pcr3qd29dzgyuwajkva78f892066"]},"potentialReward":"68774794738","delegationFee":"20.0000","delegators": null,"uptime":"0.9918","connected":true,"name":"NodeID-Eef8RycdBGmSe9tCZ1biGTLLYrkCHZPUS","avatar":"https://www.gravatar.com/avatar/70e0e2e84fee1eb27d74fdde316b5773?d=monsterid&s=150","link":"","delegateStake":0,"totalStakeAmount":"18200000000000","remainingCapacity":72800000000000,"isMinimumAmountForStake":false,"delegatePotentialReward":0,"percent":"76.4648052","rank":1,"cumulativeStake":76.5},
    {"startTime":"1600745654","endTime":"1601955254","stakeAmount":"5601800000000","nodeID":"NodeID-2JdttE7aUb19pgp9rJifgrkbHpv79cCGx","rewardOwner":{"locktime":"0","threshold":"1","addresses":["P-avax1a45dgarmwutzng4r25l25lnfltzetsrcjyp0m2"]},"potentialReward":"21173514157","delegationFee":"10.0000","delegators": null,"uptime":"0.9989","connected":true,"name":"NodeID-2JdttE7aUb19pgp9rJifgrkbHpv79cCGx","avatar":"https://www.gravatar.com/avatar/67525c58d4631b7976269863f8dadb48?d=monsterid&s=150","link":"","delegateStake":0,"totalStakeAmount":"5601800000000","remainingCapacity":22407200000000,"isMinimumAmountForStake":false,"delegatePotentialReward":0,"percent":"23.5351948","rank":2,"cumulativeStake":100}
]

const expectResult2 = [
    {"startTime":"1600748205","endTime":"1601957805","stakeAmount":"18200000000000","nodeID":"NodeID-Eef8RycdBGmSe9tCZ1biGTLLYrkCHZPUS","rewardOwner":{"locktime":"0","threshold":"1","addresses":["P-avax1efz8chevs4pcr3qd29dzgyuwajkva78f892066"]},"potentialReward":"68774794738","delegationFee":"20.0000","delegators": [],"uptime":"0.9918","connected":true,"name":"NodeID-Eef8RycdBGmSe9tCZ1biGTLLYrkCHZPUS","avatar":"https://www.gravatar.com/avatar/70e0e2e84fee1eb27d74fdde316b5773?d=monsterid&s=150","link":"","delegateStake":0,"totalStakeAmount":"18200000000000","remainingCapacity":72800000000000,"isMinimumAmountForStake":false,"delegatePotentialReward":0,"percent":"76.4648052","rank":1,"cumulativeStake":76.5},
    {"startTime":"1600745654","endTime":"1601955254","stakeAmount":"5601800000000","nodeID":"NodeID-2JdttE7aUb19pgp9rJifgrkbHpv79cCGx","rewardOwner":{"locktime":"0","threshold":"1","addresses":["P-avax1a45dgarmwutzng4r25l25lnfltzetsrcjyp0m2"]},"potentialReward":"21173514157","delegationFee":"10.0000","delegators": [],"uptime":"0.9989","connected":true,"name":"NodeID-2JdttE7aUb19pgp9rJifgrkbHpv79cCGx","avatar":"https://www.gravatar.com/avatar/67525c58d4631b7976269863f8dadb48?d=monsterid&s=150","link":"","delegateStake":0,"totalStakeAmount":"5601800000000","remainingCapacity":22407200000000,"isMinimumAmountForStake":false,"delegatePotentialReward":0,"percent":"23.5351948","rank":2,"cumulativeStake":100}
]

// const pendingValidatorsForProcess = [
//     {"startTime":"1590999695","endTime":"1592295095", "stakeAmount":"10000000","address":"AtR9rdf3UsX88CfHxaAjjkkjrpVCqV7mbaE","id":"llUD998mP1YrLTgSjaXwU3cSK1FFne9rj"},
//     {"startTime":"1591865787","endTime":"1592375999", "stakeAmount":"220000","address":"GzHPgDc1Lu78jhjgAoFA4huVP76QPR37U","id":"4mt0k90A86kbrbxm7CmJAc5hC9HiuW762"}]

// const delegators = [
//     {"startTime":"1590999695","endTime":"1592295095", "stakeAmount":"1000","stakenAva":"10000000","address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE","id":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"},
//     {"startTime":"1591865787","endTime":"1592375999", "stakeAmount":"1000","stakenAva":"220000","address":"GzHPgDc1LursjhjgAoFA4huVP76QPR37U","id":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762","validator":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762"},
//     {"startTime":"1591292875","endTime":"1592329075", "stakeAmount":"1000","stakenAva":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m","validator":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m"}]

// const sortedValidators = [
//     {"startTime":"1590999695","endTime":"1592295095","total": "10000009","stakeAmount":"10000000","stakenAva":"10000000","address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE","id":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"},
//     {"startTime":"1591865787","endTime":"1592375999","total":"220000","stakeAmount":"220000","stakenAva":"220000","address":"GzHPgDc1LursjhjgAoFA4huVP76QPR37U","id":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762","validator":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762"},
//     {"startTime":"1591292874","endTime":"1592329075","total":"10000","stakeAmount":"10000","stakenAva":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m","validator":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m"},
//     {"startTime":"1591292875","endTime":"1592329075","total":"10000","stakeAmount":"10000","stakenAva":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m","validator":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m"},
//     {"startTime":"1591999695","endTime":"1592299095","total":"6000","stakeAmount":"6000","stakenAva":"6000","address":"OKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj"},
//     {"startTime":"1591999695","endTime":"1592297095","total":"6000","stakeAmount":"6000","stakenAva":"6000","address":"OKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj"}]

test('processing validators with null delegators and default validators', () => {
    let result = validatorProcessing(validatorsForProcess, null, null)
    const res = result.validators.map(i => {
        return {
            startTime: i.startTime,
            endTime: i.endTime,
            stakeAmount: i.stakeAmount,
            nodeID: i.nodeID,
            rewardOwner: i.rewardOwner,
            potentialReward: i.potentialReward,
            delegationFee: i.delegationFee,
            delegators: i.delegators,
            uptime: i.uptime,
            connected: i.connected,
            name: i.name,
            avatar: i.avatar,
            link: i.link,
            delegateStake: i.delegateStake,
            totalStakeAmount: i.totalStakeAmount.toString(),
            remainingCapacity: i.remainingCapacity,
            isMinimumAmountForStake: i.isMinimumAmountForStake,
            delegatePotentialReward: i.delegatePotentialReward,
            percent: i.percent,
            rank: i.rank,
            cumulativeStake: i.cumulativeStake
          }
    })

    expect(res).toEqual(expectResult)
})

test('processing validators with empty array delegators and default validators', () => {
    let result2 = validatorProcessing(validatorsForProcess, [], [])
    const res2 = result2.validators.map(i => {
        return {
            startTime: i.startTime,
            endTime: i.endTime,
            stakeAmount: i.stakeAmount,
            nodeID: i.nodeID,
            rewardOwner: i.rewardOwner,
            potentialReward: i.potentialReward,
            delegationFee: i.delegationFee,
            delegators: i.delegators,
            uptime: i.uptime,
            connected: i.connected,
            name: i.name,
            avatar: i.avatar,
            link: i.link,
            delegateStake: i.delegateStake,
            totalStakeAmount: i.totalStakeAmount.toString(),
            remainingCapacity: i.remainingCapacity,
            isMinimumAmountForStake: i.isMinimumAmountForStake,
            delegatePotentialReward: i.delegatePotentialReward,
            percent: i.percent,
            rank: i.rank,
            cumulativeStake: i.cumulativeStake
          }
      })

    expect(res2).toEqual(expectResult2)
})

test('processing validators with undefined delegators and default validators', () => {
    let result3 = validatorProcessing(validatorsForProcess, undefined, undefined)
    const res3 = result3.validators.map(i => {
        return {
            startTime: i.startTime,
            endTime: i.endTime,
            stakeAmount: i.stakeAmount,
            nodeID: i.nodeID,
            rewardOwner: i.rewardOwner,
            potentialReward: i.potentialReward,
            delegationFee: i.delegationFee,
            delegators: i.delegators,
            uptime: i.uptime,
            connected: i.connected,
            name: i.name,
            avatar: i.avatar,
            link: i.link,
            delegateStake: i.delegateStake,
            totalStakeAmount: i.totalStakeAmount.toString(),
            remainingCapacity: i.remainingCapacity,
            isMinimumAmountForStake: i.isMinimumAmountForStake,
            delegatePotentialReward: i.delegatePotentialReward,
            percent: i.percent,
            rank: i.rank,
            cumulativeStake: i.cumulativeStake
          }
      })

    expect(res3).toEqual(expectResult)
})

test('processing validators with undefined validators, delegators and default validators', () => {
    const result4 = validatorProcessing(undefined, undefined, undefined)

    expect(result4.validators).toEqual([])
})



// test('processing pending validators', () => {
//     const result = mapValidators(pendingValidatorsForProcess)

//     const expectResult =  [
//         {
//             "avatar": "http://www.gravatar.com/avatar/71e83f8f686acc82332d7a33e97a0e91?d=monsterid&s=150",
//             "delegateStake": 0,
//             "delegateStakenAva": 0,
//             "delegatorsCount": 0,
//             "name": "llUD998mP1YrLTgSjaXwU3cSK1FFne9rj",
//             "stake": 0.01,
//             "fromNowST": fromNow("1590999695"),
//             "startTime":"1590999695",
//             "endTime":"1592295095",
//             "total": 0.01,
//             "totalnAva": 10000000,
//             "stakenAva":10000000,
//             "weight": 0,
//             "address":"AtR9rdf3UsX88CfHxaAjjkkjrpVCqV7mbaE",
//             "validator":"llUD998mP1YrLTgSjaXwU3cSK1FFne9rj"
//         },
//         {
//           "startTime":"1591865787",
//           "endTime":"1592375999",
//           "total": 0.00022,
//           "totalnAva": 220000,
//           "delegateStake": 0,
//           "delegateStakenAva": 0,
//           "delegatorsCount": 0,
//           "address":"GzHPgDc1Lu78jhjgAoFA4huVP76QPR37U",
//           "avatar": "http://www.gravatar.com/avatar/13cbec372f73b2c1a76540c6776a682d?d=monsterid&s=150",
//           "fromNowST": fromNow("1591865787"),
//           "stake": 0.00022,
//           "stakenAva": 220000,
//           "weight": 0,
//           "name": "4mt0k90A86kbrbxm7CmJAc5hC9HiuW762",
//           "validator":"4mt0k90A86kbrbxm7CmJAc5hC9HiuW762"
//         }
//     ]

//     expect(result).toEqual(expectResult)
// })

// test('map delegators with undefined/null/empty array for delegators', () => {
//     const result = mapDelegators(undefined)
//     const result2 = mapDelegators(null)
//     const result3 = mapDelegators([])

//     expect(result).toEqual([])
//     expect(result2).toEqual([])
//     expect(result3).toEqual([])
// })

// test('take stake amount', () => {
//     const validator =  {
//         "startTime":"1590999695",
//         "endTime":"1592295095",
//         "stakeAmount":"10000000",
//         "address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE",
//         "id":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"
//     }

//     const expectResult = {
//       "delegateStake": 1000,
//       "delegatorsCount": 1
//     }

//     const result = getDelegatorsForNode(validator, delegators)

//     expect(result).toEqual(expectResult)
// })

// test('take stake amount with empty array of delegators', () => {
//     const validator =  {
//         "startTime":"1590999695",
//         "endTime":"1592295095",
//         "stakeAmount":"10000000",
//         "address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE",
//         "id":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"
//     }

//     const expectResult = {
//       "delegateStake": 0,
//       "delegatorsCount": 0
//     }

//     const result = getDelegatorsForNode(validator, [], validators)
//     const result2 = getDelegatorsForNode(validator, null, validators)
//     const result3 = getDelegatorsForNode(validator, undefined, validators)

//     expect(result).toEqual(expectResult)
//     expect(result2).toEqual(expectResult)
//     expect(result3).toEqual(expectResult)
// })

// test('sort validators by total amount and then by staked period', () => {
//     const result = validators
//       .sort(compare)

//     expect(result).toEqual(sortedValidators)
// })
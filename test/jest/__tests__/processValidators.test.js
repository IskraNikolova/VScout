import {
  compare,
  mapValidators,
  mapDelegators,
  validatorProcessing,
  getDelegatorsForNode
} from './../../../src/utils/validators'

import { fromNow } from './../../../src/modules/time'

const validators = [
    {"startTime":"1590999695","endTime":"1592295095", "total": "10000009", "stakeAmount":"10000000","stakenAva":"10000000","address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE","id":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"},
    {"startTime":"1591865787","endTime":"1592375999", "total":"220000", "stakeAmount":"220000","stakenAva":"220000","address":"GzHPgDc1LursjhjgAoFA4huVP76QPR37U","id":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762","validator":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762"},
    {"startTime":"1591292875","endTime":"1592329075", "total":"10000", "stakeAmount":"10000","stakenAva":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m","validator":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m"},
    {"startTime":"1591292874","endTime":"1592329075", "total":"10000", "stakeAmount":"10000","stakenAva":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m","validator":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m"},
    {"startTime":"1591999695","endTime":"1592297095", "total":"6000", "stakeAmount":"6000","stakenAva":"6000","address":"OKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj"},
    {"startTime":"1591999695","endTime":"1592299095", "total":"6000", "stakeAmount":"6000","stakenAva":"6000","address":"OKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj"}]

const validatorsForProcess = [
    {"startTime":"1590999695","endTime":"1592295095", "stakeAmount":"10000000","address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE","id":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"},
    {"startTime":"1591865787","endTime":"1592375999", "stakeAmount":"220000","address":"GzHPgDc1LursjhjgAoFA4huVP76QPR37U","id":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762"}]

const pendingValidatorsForProcess = [
    {"startTime":"1590999695","endTime":"1592295095", "stakeAmount":"10000000","address":"AtR9rdf3UsX88CfHxaAjjkkjrpVCqV7mbaE","id":"llUD998mP1YrLTgSjaXwU3cSK1FFne9rj"},
    {"startTime":"1591865787","endTime":"1592375999", "stakeAmount":"220000","address":"GzHPgDc1Lu78jhjgAoFA4huVP76QPR37U","id":"4mt0k90A86kbrbxm7CmJAc5hC9HiuW762"}]

const delegators = [
    {"startTime":"1590999695","endTime":"1592295095", "stakeAmount":"1000","stakenAva":"10000000","address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE","id":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"},
    {"startTime":"1591865787","endTime":"1592375999", "stakeAmount":"1000","stakenAva":"220000","address":"GzHPgDc1LursjhjgAoFA4huVP76QPR37U","id":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762","validator":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762"},
    {"startTime":"1591292875","endTime":"1592329075", "stakeAmount":"1000","stakenAva":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m","validator":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m"}]

const sortedValidators = [
    {"startTime":"1590999695","endTime":"1592295095","total": "10000009","stakeAmount":"10000000","stakenAva":"10000000","address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE","id":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"},
    {"startTime":"1591865787","endTime":"1592375999","total":"220000","stakeAmount":"220000","stakenAva":"220000","address":"GzHPgDc1LursjhjgAoFA4huVP76QPR37U","id":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762","validator":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762"},
    {"startTime":"1591292874","endTime":"1592329075","total":"10000","stakeAmount":"10000","stakenAva":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m","validator":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m"},
    {"startTime":"1591292875","endTime":"1592329075","total":"10000","stakeAmount":"10000","stakenAva":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m","validator":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m"},
    {"startTime":"1591999695","endTime":"1592299095","total":"6000","stakeAmount":"6000","stakenAva":"6000","address":"OKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj"},
    {"startTime":"1591999695","endTime":"1592297095","total":"6000","stakeAmount":"6000","stakenAva":"6000","address":"OKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj"}]

test('processing validators with null/undefined/empty array validators, delegators and default validators', () => {
    const result = validatorProcessing(validatorsForProcess, null, null)
    const result2 = validatorProcessing(validatorsForProcess, [], [])
    const result3 = validatorProcessing(validatorsForProcess, undefined, undefined)
    const result4 = validatorProcessing(undefined, undefined, undefined)


    const expectResult =  [
        {
            "avatar": "http://www.gravatar.com/avatar/5286927200b208d11fb73043f8d9a6d3?d=monsterid&s=150",
            "cumulativeStake": 97.847,
            "delegateStake": 0,
            "delegateStakenAva": 0,
            "delegatorsCount": 0,
            "name": "CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj",
            "percent": "97.84735812",
            "rank": 1,
            "stake": 0.01,
            "fromNowST": fromNow("1590999695"),
            "startTime":"1590999695",
            "endTime":"1592295095",
            "total": 0.01,
            "totalnAva": 10000000,
            "stakenAva":10000000,
            "weight": 0,
            "address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE",
            "validator":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"
        },
        {
          "startTime":"1591865787",
          "endTime":"1592375999",
          "total": 0.00022,
          "totalnAva": 220000,
          "delegateStake": 0,
          "delegateStakenAva": 0,
          "delegatorsCount": 0,
          "address":"GzHPgDc1LursjhjgAoFA4huVP76QPR37U",
          "avatar": "http://www.gravatar.com/avatar/ae392857f83fd357a33563383631c57c?d=monsterid&s=150",
          "cumulativeStake": 100,
          "fromNowST": fromNow("1591865787"),
          "rank": 2,
          "stake": 0.00022,
          "stakenAva": 220000,
          "weight": 0,
          "name": "4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762",
          "percent": "2.15264188",
          "validator":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762"
        }
    ]

    expect(result.validators).toEqual(expectResult)
    expect(result2.validators).toEqual(expectResult)
    expect(result3.validators).toEqual(expectResult)
    expect(result4.validators).toEqual([])
})

test('processing pending validators', () => {
    const result = mapValidators(pendingValidatorsForProcess)

    const expectResult =  [
        {
            "avatar": "http://www.gravatar.com/avatar/71e83f8f686acc82332d7a33e97a0e91?d=monsterid&s=150",
            "delegateStake": 0,
            "delegateStakenAva": 0,
            "delegatorsCount": 0,
            "name": "llUD998mP1YrLTgSjaXwU3cSK1FFne9rj",
            "stake": 0.01,
            "fromNowST": fromNow("1590999695"),
            "startTime":"1590999695",
            "endTime":"1592295095",
            "total": 0.01,
            "totalnAva": 10000000,
            "stakenAva":10000000,
            "weight": 0,
            "address":"AtR9rdf3UsX88CfHxaAjjkkjrpVCqV7mbaE",
            "validator":"llUD998mP1YrLTgSjaXwU3cSK1FFne9rj"
        },
        {
          "startTime":"1591865787",
          "endTime":"1592375999",
          "total": 0.00022,
          "totalnAva": 220000,
          "delegateStake": 0,
          "delegateStakenAva": 0,
          "delegatorsCount": 0,
          "address":"GzHPgDc1Lu78jhjgAoFA4huVP76QPR37U",
          "avatar": "http://www.gravatar.com/avatar/13cbec372f73b2c1a76540c6776a682d?d=monsterid&s=150",
          "fromNowST": fromNow("1591865787"),
          "stake": 0.00022,
          "stakenAva": 220000,
          "weight": 0,
          "name": "4mt0k90A86kbrbxm7CmJAc5hC9HiuW762",
          "validator":"4mt0k90A86kbrbxm7CmJAc5hC9HiuW762"
        }
    ]

    expect(result).toEqual(expectResult)
})

test('map delegators with undefined/null/empty array for delegators', () => {
    const result = mapDelegators(undefined)
    const result2 = mapDelegators(null)
    const result3 = mapDelegators([])

    expect(result).toEqual([])
    expect(result2).toEqual([])
    expect(result3).toEqual([])
})

test('take stake amount', () => {
    const validator =  {
        "startTime":"1590999695",
        "endTime":"1592295095",
        "stakeAmount":"10000000",
        "address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE",
        "id":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"
    }

    const expectResult = {
      "delegateStake": 1000,
      "delegatorsCount": 1
    }

    const result = getDelegatorsForNode(validator, delegators)

    expect(result).toEqual(expectResult)
})

test('take stake amount with empty array of delegators', () => {
    const validator =  {
        "startTime":"1590999695",
        "endTime":"1592295095",
        "stakeAmount":"10000000",
        "address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE",
        "id":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"
    }

    const expectResult = {
      "delegateStake": 0,
      "delegatorsCount": 0
    }

    const result = getDelegatorsForNode(validator, [], validators)
    const result2 = getDelegatorsForNode(validator, null, validators)
    const result3 = getDelegatorsForNode(validator, undefined, validators)

    expect(result).toEqual(expectResult)
    expect(result2).toEqual(expectResult)
    expect(result3).toEqual(expectResult)
})

test('sort validators by total amount and then by staked period', () => {
    const result = validators
      .sort(compare)

    expect(result).toEqual(sortedValidators)
})
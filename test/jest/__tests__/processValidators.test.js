import { stakeAndWeight } from './../../../src/utils/validators'

const validators = [
    {"startTime":"1590999695","endTime":"1592295095","stakenAva":"10000000","address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE","id":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"},
    {"startTime":"1591865787","endTime":"1592375999","stakenAva":"220000","address":"GzHPgDc1LursjhjgAoFA4huVP76QPR37U","id":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762","validator":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762"},
    {"startTime":"1591292875","endTime":"1592329075","stakenAva":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m","validator":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m"},
    {"startTime":"1591999695","endTime":"1592297095","stakenAva":"10000","address":"OKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj"}]

test('take stake amount', () => {
    const validator =  {
        "startTime":"1590999695",
        "endTime":"1592295095",
        "stakeAmount":"10000000",
        "address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE",
        "id":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"
    }

    const expectResult = {
      "stakeAmount":"10000000",
      "weight": 0
    }

    const result = stakeAndWeight(validator, validators)

    expect(result).toEqual(expectResult)
})

test('take weight', () => {
    const validator =  {
        "startTime":"1590999695",
        "endTime":"1592295095",
        "weight": 1,
        "address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE",
        "id":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"
    }

    const expectResult = {
      "stakeAmount": "10000000",
      "weight": 1
    }

    const result = stakeAndWeight(validator, validators)

    expect(result).toEqual(expectResult)
})
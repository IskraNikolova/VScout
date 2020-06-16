import { splitAccounts } from './../../../src/utils/validators'

const validators = [
    {"startTime":"1590999695","endTime":"1592295095","stakeAmount":"10000","address":"AtR9rdf3UsXMiCfHxaAjLwrpVCqV7mbaE","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
    {"startTime":"1591865787","endTime":"1592375999","stakeAmount":"20000","address":"GzHPgDc1LursH5kgAoFA4huVP76QPR37U","id":"4jtuk4iA86kbrbxm7CmJAc5hC9HiuW762"},
    {"startTime":"1591292875","endTime":"1592329075","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4NmG6hyZDUdbFuSFKn5sf7ZQ1zgYRm14m"},
    {"startTime":"1591999695","endTime":"1592297095","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
    {"startTime":"1590999795","endTime":"1592395095","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
    {"startTime":"1591041694","endTime":"1592337094","stakeAmount":"10000","address":"HNcejNmfopWRAc582zgSyqyKKRFob5jSf","id":"AzdCJ9NdtnrQEfXEPZNWx3fQQBx9dGrV"},
    {"startTime":"1591020299","endTime":"1592402095","stakeAmount":"10000","address":"4GkwmbQTBMke9S9ayWDVxNY4E5aotRWpj","id":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY"},
    {"startTime":"1592020295","endTime":"1592402095","stakeAmount":"10000","address":"KXZi2HvJU9nezuyn9uKY2iJ1sNAutzoNj","id":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY"},
    {"startTime":"1591621316","endTime":"1592484275","stakeAmount":"10000","address":"8LyVJXGFTFwJ4wH6jMGyf842JHxYvFKCL","id":"NAcdWvKaqtEn7QUHpF2M8gVWhUrmsgdLg"},
    {"startTime":"1591055072","endTime":"1592436872","stakeAmount":"10000","address":"KXZi2HvJU9nezuyn9uKY2iJ1sNAutzoNj","id":"7hJBrERKfDLTmoXRxCqURvEuRrRUxDP8w"}]

    const val = [
        {"startTime":"1590999695","endTime":"1592295095","stakeAmount":"10000","address":"AtR9rdf3UsXMiCfHxaAjLwrpVCqV7mbaE","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
        {"startTime":"1591865787","endTime":"1592375999","stakeAmount":"20000","address":"GzHPgDc1LursH5kgAoFA4huVP76QPR37U","id":"4jtuk4iA86kbrbxm7CmJAc5hC9HiuW762"},
        {"startTime":"1591292875","endTime":"1592329075","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4NmG6hyZDUdbFuSFKn5sf7ZQ1zgYRm14m"},
        {"startTime":"1591041694","endTime":"1592337094","stakeAmount":"10000","address":"HNcejNmfopWRAc582zgSyqyKKRFob5jSf","id":"AzdCJ9NdtnrQEfXEPZNWx3fQQBx9dGrV"},
        {"startTime":"1591020299","endTime":"1592402095","stakeAmount":"10000","address":"4GkwmbQTBMke9S9ayWDVxNY4E5aotRWpj","id":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY"},
        {"startTime":"1591621316","endTime":"1592484275","stakeAmount":"10000","address":"8LyVJXGFTFwJ4wH6jMGyf842JHxYvFKCL","id":"NAcdWvKaqtEn7QUHpF2M8gVWhUrmsgdLg"},
        {"startTime":"1591055072","endTime":"1592436872","stakeAmount":"10000","address":"KXZi2HvJU9nezuyn9uKY2iJ1sNAutzoNj","id":"7hJBrERKfDLTmoXRxCqURvEuRrRUxDP8w"}
    ]

    const del = [
        {"startTime":"1590999795","endTime":"1592395095","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
        {"startTime":"1591999695","endTime":"1592297095","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
        {"startTime":"1592020295","endTime":"1592402095","stakeAmount":"10000","address":"KXZi2HvJU9nezuyn9uKY2iJ1sNAutzoNj","id":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY"}
    ]

    const onlyValidators = [
        {"startTime":"1591999695","endTime":"1592297095","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
        {"startTime":"1592020295","endTime":"1592402095","stakeAmount":"10000","address":"KXZi2HvJU9nezuyn9uKY2iJ1sNAutzoNj","id":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY"},
        {"startTime":"1590986737","endTime":"1592368537","stakeAmount":"10000","address":"F2p3iYvLNpDLwfhKuiCZXTXGcpmSX7SAa","id":"E6vMBbzmzfgtZRd4EUE9VgJieYxCpoc4Q"},
        {"startTime":"1592168989","endTime":"1592341189","stakeAmount":"10000","address":"34n42tSwEqVRCRUjWadL7aP5ZVPXKxwZv","id":"EM3vCQ76haBmdBUwfv29btt9hUj7vfYyk"}
    ]

test('split nodes to validators and delegators', () => {
    const { v, d } = splitAccounts(validators)

    expect(v).toEqual(val)
    expect(d).toEqual(del)
})

test('split nodes to validators and delegators, when haven\'t delegators', () => {
    const { v, d } = splitAccounts(onlyValidators)

    expect(v).toEqual(onlyValidators)
    expect(d).toEqual([])
})
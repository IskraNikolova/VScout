import { splitAccounts, splitPendingAccounts } from './../../../src/utils/validators'

  const validators = [
    {"startTime":"1590999695","endTime":"1592295095","stakeAmount":"10000","address":"AtR9rdf3UsXMiCfHxaAjLwrpVCqV7mbaE","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
    {"startTime":"1592020295","endTime":"1592402095","stakeAmount":"10000","address":"KXZi2HvJU9nezuyn9uKY2iJ1sNAutzoNj","id":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY","validator":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY"},
    {"startTime":"1591865787","endTime":"1592375999","stakeAmount":"20000","address":"GzHPgDc1LursH5kgAoFA4huVP76QPR37U","id":"4jtuk4iA86kbrbxm7CmJAc5hC9HiuW762","validator":"4jtuk4iA86kbrbxm7CmJAc5hC9HiuW762"},
    {"startTime":"1591292875","endTime":"1592329075","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4NmG6hyZDUdbFuSFKn5sf7ZQ1zgYRm14m","validator":"4NmG6hyZDUdbFuSFKn5sf7ZQ1zgYRm14m"},
    {"startTime":"1591999695","endTime":"1592297095","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
    {"startTime":"1590999795","endTime":"1592395095","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
    {"startTime":"1591041694","endTime":"1592337094","stakeAmount":"10000","address":"HNcejNmfopWRAc582zgSyqyKKRFob5jSf","id":"AzdCJ9NdtnrQEfXEPZNWx3fQQBx9dGrV","validator":"AzdCJ9NdtnrQEfXEPZNWx3fQQBx9dGrV"},
    {"startTime":"1591020299","endTime":"1592402095","stakeAmount":"10000","address":"4GkwmbQTBMke9S9ayWDVxNY4E5aotRWpj","id":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY","validator":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY"},
    {"startTime":"1591621316","endTime":"1592484275","stakeAmount":"10000","address":"8LyVJXGFTFwJ4wH6jMGyf842JHxYvFKCL","id":"NAcdWvKaqtEn7QUHpF2M8gVWhUrmsgdLg","validator":"NAcdWvKaqtEn7QUHpF2M8gVWhUrmsgdLg"},
    {"startTime":"1591055072","endTime":"1592436872","stakeAmount":"10000","address":"KXZi2HvJU9nezuyn9uKY2iJ1sNAutzoNj","id":"7hJBrERKfDLTmoXRxCqURvEuRrRUxDP8w","validator":"7hJBrERKfDLTmoXRxCqURvEuRrRUxDP8w"}]

    let val = [
        {"startTime":"1590999695","endTime":"1592295095","stakeAmount":"10000","address":"AtR9rdf3UsXMiCfHxaAjLwrpVCqV7mbaE","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
        {"startTime":"1591865787","endTime":"1592375999","stakeAmount":"20000","address":"GzHPgDc1LursH5kgAoFA4huVP76QPR37U","id":"4jtuk4iA86kbrbxm7CmJAc5hC9HiuW762","validator":"4jtuk4iA86kbrbxm7CmJAc5hC9HiuW762"},
        {"startTime":"1591292875","endTime":"1592329075","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4NmG6hyZDUdbFuSFKn5sf7ZQ1zgYRm14m","validator":"4NmG6hyZDUdbFuSFKn5sf7ZQ1zgYRm14m"},
        {"startTime":"1591041694","endTime":"1592337094","stakeAmount":"10000","address":"HNcejNmfopWRAc582zgSyqyKKRFob5jSf","id":"AzdCJ9NdtnrQEfXEPZNWx3fQQBx9dGrV","validator":"AzdCJ9NdtnrQEfXEPZNWx3fQQBx9dGrV"},
        {"startTime":"1591020299","endTime":"1592402095","stakeAmount":"10000","address":"4GkwmbQTBMke9S9ayWDVxNY4E5aotRWpj","id":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY","validator":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY"},
        {"startTime":"1591621316","endTime":"1592484275","stakeAmount":"10000","address":"8LyVJXGFTFwJ4wH6jMGyf842JHxYvFKCL","id":"NAcdWvKaqtEn7QUHpF2M8gVWhUrmsgdLg","validator":"NAcdWvKaqtEn7QUHpF2M8gVWhUrmsgdLg"},
        {"startTime":"1591055072","endTime":"1592436872","stakeAmount":"10000","address":"KXZi2HvJU9nezuyn9uKY2iJ1sNAutzoNj","id":"7hJBrERKfDLTmoXRxCqURvEuRrRUxDP8w","validator":"7hJBrERKfDLTmoXRxCqURvEuRrRUxDP8w"}
    ]

    let del = [
        {"startTime":"1590999795","endTime":"1592395095","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
        {"startTime":"1591999695","endTime":"1592297095","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
        {"startTime":"1592020295","endTime":"1592402095","stakeAmount":"10000","address":"KXZi2HvJU9nezuyn9uKY2iJ1sNAutzoNj","id":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY","validator":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY"}
    ]

    const onlyValidators = [
        {"startTime":"1591999695","endTime":"1592297095","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
        {"startTime":"1592020295","endTime":"1592402095","stakeAmount":"10000","address":"KXZi2HvJU9nezuyn9uKY2iJ1sNAutzoNj","id":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY","validator":"KY7tvtwSRgFgQtrKAzpdiNtdprqKKGsMY"},
        {"startTime":"1590986737","endTime":"1592368537","stakeAmount":"10000","address":"F2p3iYvLNpDLwfhKuiCZXTXGcpmSX7SAa","id":"E6vMBbzmzfgtZRd4EUE9VgJieYxCpoc4Q","validator":"E6vMBbzmzfgtZRd4EUE9VgJieYxCpoc4Q"},
        {"startTime":"1592168989","endTime":"1592341189","stakeAmount":"10000","address":"34n42tSwEqVRCRUjWadL7aP5ZVPXKxwZv","id":"EM3vCQ76haBmdBUwfv29btt9hUj7vfYyk","validator":"EM3vCQ76haBmdBUwfv29btt9hUj7vfYyk"}
    ]

    const pendingValidators = [
        {"startTime":"1590999695","endTime":"1592295095","stakeAmount":"10000000","address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
        {"startTime":"1591865787","endTime":"1592375999","stakeAmount":"220000","address":"GzHPgDc1LursjhjgAoFA4huVP76QPR37U","id":"4jtuk4iA86kbrbxm7CmJAc5hC9HiuW762","validator":"4jtuk4iA86kbrbxm7CmJAc5hC9HiuW762"},
        {"startTime":"1591292875","endTime":"1592329075","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4NmG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m","validator":"4NmG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m"},
        {"startTime":"1591999695","endTime":"1592297095","stakeAmount":"10000","address":"OKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz8mP1YooTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YooTgSjaXwU3cSK1FFne9rj"}]

    const pendingOnlyValidators = [
        {"startTime":"1590999695","endTime":"1592295095","stakeAmount":"10000000","address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE","id":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUD998mP1YrLTgSjaXwU3cSK1FFne9rj"},
        {"startTime":"1591865787","endTime":"1592375999","stakeAmount":"220000","address":"GzHPgDc1LursjhjgAoFA4huVP76QPR37U","id":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762","validator":"4mt0k4iA86kbrbxm7CmJAc5hC9HiuW762"},
        {"startTime":"1591292875","endTime":"1592329075","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m","validator":"4iiG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m"},
        {"startTime":"1591999695","endTime":"1592297095","stakeAmount":"10000","address":"OKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz0000YooTgSjaXwU3cSK1FFne9rj"}]

    const pendingOnlyDelegators = [
        {"startTime":"1590999695","endTime":"1592295095","stakeAmount":"10000000","address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
        {"startTime":"1591865787","endTime":"1592375999","stakeAmount":"220000","address":"GzHPgDc1LursjhjgAoFA4huVP76QPR37U","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
        {"startTime":"1591292875","endTime":"1592329075","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
        {"startTime":"1591999695","endTime":"1592297095","stakeAmount":"10000","address":"OKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"}]

    const pendingVal = [
        {"startTime":"1591292875","endTime":"1592329075","stakeAmount":"10000","address":"PKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"4NmG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m","validator":"4NmG6ppZDUdbFuSFKn5sf7ZQ1zgYRm14m"},
        {"startTime":"1591999695","endTime":"1592297095","stakeAmount":"10000","address":"OKk3UYUYcuEXZw6Py5z66chBJKa817BVi","id":"CbUDnz8mP1YooTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YooTgSjaXwU3cSK1FFne9rj"}]

    const pendingDel = [
        {"startTime":"1590999695","endTime":"1592295095","stakeAmount":"10000000","address":"AtR9rdf3UsXMiCfHxaAjjkkjrpVCqV7mbaE","id":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj","validator":"CbUDnz8mP1YrLTgSjaXwU3cSK1FFne9rj"},
        {"startTime":"1591865787","endTime":"1592375999","stakeAmount":"220000","address":"GzHPgDc1LursjhjgAoFA4huVP76QPR37U","id":"4jtuk4iA86kbrbxm7CmJAc5hC9HiuW762","validator":"4jtuk4iA86kbrbxm7CmJAc5hC9HiuW762"}]

test('split response to validators and delegators', () => {
    let { v, d } = splitAccounts(validators)

    v = v.sort((a, b) => a.startTime - b.startTime)
    val = val.sort((a, b) => a.startTime - b.startTime)
    del = del.sort((a, b) => a.startTime - b.startTime)
    d = d.sort((a, b) => a.startTime - b.startTime)

    expect(v).toEqual(val)
    expect(d).toEqual(del)
})

test('split response to validators and delegators, when haven\'t delegators', () => {
    const { v, d } = splitAccounts(onlyValidators)

    expect(v).toEqual(onlyValidators)
    expect(d).toEqual([])
})

test('split response of pending validators and pending delegators', () => {
    const { v, d } = splitPendingAccounts(pendingValidators, val)

    expect(v).toEqual(pendingVal)
    expect(d).toEqual(pendingDel)
})

test('split response of pending validators and pending delegators, with only validators', () => {
    const { v, d } = splitPendingAccounts(pendingOnlyValidators, val)

    expect(v).toEqual(pendingOnlyValidators)
    expect(d).toEqual([])
})

test('split response of pending validators and pending delegators, with only delegators', () => {
    const { v, d } = splitPendingAccounts(pendingOnlyDelegators, val)

    expect(v).toEqual([])
    expect(d).toEqual(pendingOnlyDelegators)
})
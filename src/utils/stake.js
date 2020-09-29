const BigNumber = require('bignumber.js')

const CAPACITY = 5

export const getRemainingCapacity = (stakeAmount, delegateStakeAmount) => {
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

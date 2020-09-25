const BigNumber = require('bignumber.js')

const CAPACITY = 5

// todo (3 * Math.pow(6, 10))
export const getRemainingCapacity = (stakeAmount, delegateStakeAmount) => {
  const ownStake = new BigNumber(stakeAmount)
  const delegateStake = new BigNumber(delegateStakeAmount)

  const capacity = ownStake.multipliedBy(CAPACITY)
  const consumed = BigNumber.sum(ownStake, delegateStake)

  const remainingCapacity = capacity
    .minus(consumed)

  return remainingCapacity.toNumber()
}

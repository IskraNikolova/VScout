const units = require('./../utils/constants.js')
const BigNumber = require('bignumber.js')

export const reward = (duration, stakedAmount, currentSupply, maxStakePeriod) => {
  const maxSubMinConsumptionRate = new BigNumber(units.maxSubMinConsumptionRate)
  const minConsumptionRate = new BigNumber(units.minConsumptionRate)
  const consumptionInterval = new BigNumber(maxStakePeriod)
  const supplyCap = new BigNumber(units.SupplyCap)

  let adjustedConsumptionRateNumerator = maxSubMinConsumptionRate
    .multipliedBy(duration)

  const adjustedMinConsumptionRateNumerator = minConsumptionRate
    .multipliedBy(consumptionInterval)

  adjustedConsumptionRateNumerator = BigNumber
    .sum(
      adjustedConsumptionRateNumerator,
      adjustedMinConsumptionRateNumerator
    )

  const adjustedConsumptionRateDenominator = consumptionInterval
    .multipliedBy(units.PercentDenominator)

  const remainingSupply = supplyCap
    .minus(currentSupply)

  let rewardRes = new BigNumber(remainingSupply)

  rewardRes = rewardRes.multipliedBy(adjustedConsumptionRateNumerator)
  rewardRes = rewardRes.multipliedBy(stakedAmount)
  rewardRes = rewardRes.multipliedBy(duration)

  rewardRes = rewardRes.dividedBy(adjustedConsumptionRateDenominator)
  rewardRes = rewardRes.dividedBy(currentSupply)
  rewardRes = rewardRes.dividedBy(consumptionInterval)

  return rewardRes.toNumber()
}

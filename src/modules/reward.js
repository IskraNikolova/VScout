const units = require('./../utils/constants.js')
const BigNumber = require('bignumber.js')

export const reward = (duration, stakedAmount, currentSupply) => {
  const maxStakePeriod = new BigNumber(units.maximumStakingDuration)
  const currentSupplyBig = new BigNumber(currentSupply)

  let durationMs = units.stakeDurationMs(duration)
  durationMs = new BigNumber(durationMs)

  let stakedAmountNAvax = new BigNumber(stakedAmount)
  stakedAmountNAvax = stakedAmountNAvax.multipliedBy(new BigNumber(units.Avax))

  const maxSubMinConsumptionRate = new BigNumber(units.maxSubMinConsumptionRate)
  const minConsumptionRate = new BigNumber(units.minConsumptionRate)
  const consumptionInterval = new BigNumber(maxStakePeriod)
  const supplyCap = new BigNumber(units.SupplyCap)

  let adjustedConsumptionRateNumerator = maxSubMinConsumptionRate
    .multipliedBy(durationMs)

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
    .minus(currentSupplyBig)

  let rewardRes = new BigNumber(remainingSupply)

  rewardRes = rewardRes.multipliedBy(adjustedConsumptionRateNumerator)
  rewardRes = rewardRes.multipliedBy(stakedAmountNAvax)
  rewardRes = rewardRes.multipliedBy(durationMs)

  rewardRes = rewardRes.dividedBy(adjustedConsumptionRateDenominator)
  rewardRes = rewardRes.dividedBy(currentSupplyBig)
  rewardRes = rewardRes.dividedBy(consumptionInterval)

  return rewardRes.toNumber()
}

export const substractDelegationFee = (reward, delegationFee) => {
  const rewardNavax = new BigNumber(reward)
  const fee = new BigNumber(delegationFee)
  const divide = new BigNumber(100)

  let percent = rewardNavax.multipliedBy(fee)
  percent = percent.dividedBy(divide)

  const rewardRes = rewardNavax.minus(percent)

  return { result: rewardRes.toNumber(), fee: percent }
}

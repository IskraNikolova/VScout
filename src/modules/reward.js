const units = require('./../utils/constants.js')
const BigNumber = require('bignumber.js')

export const reward = (stakeTime, stakedAmount, currentSupplyBig) => {
  if (!currentSupplyBig || currentSupplyBig === 1) return
  // 365 * 24 * 60
  const maxStakePeriod = new BigNumber(units.maximumStakingDuration)

  // stakeTime * 24 * 60
  let duration = units.stakeDuration(stakeTime)
  duration = new BigNumber(duration)

  // to nAVAX
  let stakedAmountNAvax = new BigNumber(stakedAmount)
  stakedAmountNAvax = stakedAmountNAvax.multipliedBy(new BigNumber(units.Avax))

  // MaxSubMinConsumptionRate is the % consumption that incentivizes staking
  const maxSubMinConsumptionRate = new BigNumber(units.maxSubMinConsumptionRate)

  // MinConsumptionRate is the minimum % consumption of the remaining tokens
  // to be minted
  const minConsumptionRate = new BigNumber(units.minConsumptionRate)
  const consumptionInterval = new BigNumber(maxStakePeriod)

  // SupplyCap is the maximum amount of AVAX that should ever exist 720M
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
    .minus(currentSupplyBig)

  let rewardRes = new BigNumber(remainingSupply)

  rewardRes = rewardRes.multipliedBy(adjustedConsumptionRateNumerator)
  rewardRes = rewardRes.multipliedBy(stakedAmountNAvax)
  rewardRes = rewardRes.multipliedBy(duration)

  rewardRes = rewardRes.dividedBy(adjustedConsumptionRateDenominator)
  rewardRes = rewardRes.dividedBy(currentSupplyBig)
  rewardRes = rewardRes.dividedBy(consumptionInterval)

  return rewardRes.toNumber()
}

export const getYearlyRewardPercent = (reward, stakeTime, stakedAmount) => {
  const rewardRes = new BigNumber(reward)

  // to nAVAX
  let stakedAmountNAvax = new BigNumber(stakedAmount)
  stakedAmountNAvax = stakedAmountNAvax.multipliedBy(new BigNumber(units.Avax))

  let yearly = rewardRes.dividedBy(stakeTime)
  yearly = yearly.multipliedBy(365)

  let percent = yearly.multipliedBy(100)
  percent = percent.dividedBy(stakedAmountNAvax)

  return { percent: percent.toNumber(), yearly: yearly.toNumber() }
}

export const substractDelegationFee = (reward, delegationFee) => {
  const rewardNavax = new BigNumber(reward)
  const percent = getPercentAmount(reward, delegationFee)

  const rewardRes = rewardNavax.minus(percent)

  return { result: rewardRes.toNumber(), fee: percent }
}

export const getDelegationReward = (delegationStake, delegationFee) => {
  const result = getPercentAmount(delegationStake, delegationFee)
  return result.toNumber()
}

function getPercentAmount (amount, per) {
  const stakeNavax = new BigNumber(amount)
  const fee = new BigNumber(per)
  const divide = new BigNumber(100)

  let percent = stakeNavax.multipliedBy(fee)
  percent = percent.dividedBy(divide)

  return percent
}

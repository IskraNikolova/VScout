const units = require('./../utils/constants.js')

export const reward = (duration, stakedAmount, maxExistingAmount, consumptionInterval) => {
  let adjustedConsumptionRateNumerator = units.maxSubMinConsumptionRate * duration
  const adjustedMinConsumptionRateNumerator = units.minConsumptionRate * consumptionInterval
  adjustedConsumptionRateNumerator += adjustedMinConsumptionRateNumerator
  const adjustedConsumptionRateDenominator = consumptionInterval * units.PercentDenominator

  let result = units.SupplyCap - maxExistingAmount
  result *= adjustedConsumptionRateNumerator
  result *= stakedAmount
  result *= duration
  result /= adjustedConsumptionRateDenominator
  result /= maxExistingAmount
  result /= consumptionInterval

  return result
}

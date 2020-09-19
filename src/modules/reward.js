const units = require('./../utils/constants.js')

export const reward = async (duration, stakedAmount, currentSupply, consumptionInterval) => {
  const durationMs = duration * 24 * 60 * 60 * 1000
  const consumptionIntervalMs = consumptionInterval * 24 * 60 * 60 * 1000
  let adjustedConsumptionRateNumerator = units.maxSubMinConsumptionRate * durationMs
  const adjustedMinConsumptionRateNumerator = units.minConsumptionRate * consumptionIntervalMs
  adjustedConsumptionRateNumerator += adjustedMinConsumptionRateNumerator
  const adjustedConsumptionRateDenominator = consumptionIntervalMs * units.PercentDenominator

  let result = units.SupplyCap - currentSupply
  result *= adjustedConsumptionRateNumerator
  result *= stakedAmount
  result *= durationMs
  result /= adjustedConsumptionRateDenominator
  result /= currentSupply
  result /= consumptionIntervalMs

  return result
}

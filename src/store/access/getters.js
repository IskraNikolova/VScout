export function code (state) {
  return state.code
}

export function txHash (state) {
  return state.txHash
}

export function txAVM (state) {
  return state.txAVM
}

export function currentSupply (state) {
  return state.currentSupply
}

export function totalSupply (state) {
  return state.totalSupply
}

export function nonDefvalidatorById (state) {
  return (id) => state
    .validators
    .find(val => val.nodeID.includes(id))
}

export function nodeHealth (state) {
  return (id) => state.nodeHealth[id]
}

export function hasNetworkConnection (state) {
  return state.hasNetworkConnection
}

export function height (state) {
  return state.height
}

export function assetsCount (state) {
  return state.assetsCount
}

export function pendingValidators (state) {
  return state.pendingValidators
}

export function pendingDelegators (state) {
  return state.pendingDelegators
}

export function validators (state) {
  return state.validators
}

export function validator (state) {
  return state.validator
}

export function delegators (state) {
  return state.delegators
}

export function currenciesPriceList (state) {
  return state.currenciesPriceList
}

export function high24h (state) {
  return state.high_24h
}

export function low24h (state) {
  return state.low_24h
}

export function change24h (state) {
  return state.price_change_24h
}

export function changePercentage24h (state) {
  return state.price_change_24h_percentage
}

export function delegationsCount (state) {
  if (!state.delegators) return 0
  return state.delegators.length
}

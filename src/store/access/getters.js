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

export function delegationsCount (state) {
  return state.delegators.length
}

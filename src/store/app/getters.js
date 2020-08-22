export function validators (state) {
  return state.validators
}

export function defaultValidators (state) {
  return state.defaultValidators
}

export function delegators (state) {
  return state.delegators
}

export function validatorById (state) {
  return (id) => state
    .validators
    .find(val => val.nodeID === id)
}

export function pendingValidators (state) {
  return state.pendingValidators
}

export function pendingDelegators (state) {
  return state.pendingDelegators
}

export function blockchains (state) {
  return state.blockchains
}

export function blockchainByID (state) {
  return (id) => state
    .blockchains
    .find(b => b.id === id)
}

export function blockchainByName (state) {
  return (name) => state
    .blockchains
    .find(b => b.name.toLowerCase() === name.toLowerCase())
}

export function subnetByID (state) {
  return (id) => state
    .subnets
    .find(b => b.id === id)
}

export function subnets (state) {
  return state.subnets
}

export function currentSubnet (state) {
  return state.currentSubnet
}

export function currentBlockchain (state) {
  return state.currentBlockchain
}

export function subnetID (state) {
  return state.subnetID
}

export function stakedAVA (state) {
  return state.stakedAVA.toLocaleString()
}

export function validatedStake (state) {
  return state.validatedStake.toLocaleString()
}

export function delegatedStake (state) {
  return state.delegatedStake.toLocaleString()
}

export function isDefaultSubnetID (state) {
  return state.subnetID === '11111111111111111111111111111111LpoYY'
}

export function isBlockchainView (state) {
  return state.isBlockchainView
}

export function networkEndpoint (state) {
  return state.networkEndpoint
}

export function lastBlock (state) {
  return state.lastBlock
}

export function blockTime (state) {
  return state.blockTime
}

export function avarageBlockTime (state) {
  const sum = state.lastBlockTime.reduce((a, b) => a + b, 0)
  return (sum / state.lastBlockTime.length) || 0
}

export function txsFor24H (state) {
  return state.txsFor24H
}

export function prevTxsFor24H (state) {
  return state.prevTxsFor24H
}

export function totalTxsCount (state) {
  return state.totalTxsCount
}

export function prevTotalTxs (state) {
  return state.prevTotalTxs
}

export function txsHistory (state) {
  return key => state.txsHistoryState[key]
}

export function endpointsMemory (state) {
  return state.endpointsMemory
}

export function txHKey (state) {
  return state.txHKey
}

export function assets (state) {
  return (key) => state.assetsByChain[key]
}

export function nodeID (state) {
  return state.nodeID
}

export function nodeInfo (state) {
  return state.nodeInfo
}

export function nodeHealth (state) {
  return (id) => state.nodeHealth[id]
}

export function hasNetworkConnection (state) {
  return state.hasNetworkConnection
}

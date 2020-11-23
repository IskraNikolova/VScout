const {
  network
} = require('./../../modules/config').default

export function validators (state) {
  return state.validators
}

export function defaultValidators (state) {
  return state.defaultValidators
}

export function delegators (state) {
  return state.delegators
}

export function height (state) {
  return state.height
}

export function validatorById (state) {
  return (id) => state
    .defaultValidators
    .find(val => val.nodeID.includes(id))
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

export function delegationsCount (state) {
  return state.delegators.length
}

export function blockchainByID (state) {
  return (id) => state
    .blockchains
    .find(b => b.id === id)
}

export function blockchainByName (state) {
  return (name) => state
    .blockchains
    .find(b => b.name === name)
}

export function subnetByID (state) {
  return (id) => state
    .subnets
    .find(b => b.id === id)
}

export function subnets (state) {
  return state.subnets
}

export function subnetID (state) {
  return state.subnetID
}

export function stakedAVA (state) {
  return state.stakedAVA
}

export function appTheme (state) {
  return state.theme
}

export function validatedStake (state) {
  return state.validatedStake
}

export function delegatedStake (state) {
  return state.delegatedStake
}

export function isDefaultSubnetID () {
  return (id) => id === network.defaultSubnetID
}

export function assetsCount (state) {
  return state.assetsCount
}

export function nodeID (state) {
  return state.nodeID
}

export function addressBalance (state) {
  return state.addressBalance
}

export function currentSupply (state) {
  return state.currentSupply
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

export function currentCurrency (state) {
  return state.currentCurrency
}

export function nodeInfo (state) {
  return state.nodeInfo
}

export function peers (state) {
  return state.peers
}

export function peersMap (state) {
  return state.peersMap
}

export function inData (state) {
  return state.inData
}

export function nodeHealth (state) {
  return (id) => state.nodeHealth[id]
}

export function hasNetworkConnection (state) {
  return state.hasNetworkConnection
}

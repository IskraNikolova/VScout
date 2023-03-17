const {
  network
} = require('./../../modules/config').default

export function notificationNode (state) {
  return state.notificationNode
}

export function notifications (state) {
  return state.notifications
}

export function assets (state) {
  return state.assets
}

export function blockchains (state) {
  return state.blockchains
}

export function currentCurrency (state) {
  return state.currentCurrency
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

export function stakedAVAX (state) {
  return state.stakedAVAX
}

export function nodesVersions (state) {
  return state.nodesVersions
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

export function nodeID (state) {
  return state.nodeID
}

export function addressBalance (state) {
  return state.addressBalance
}

export function nodeInfo (state) {
  return state.nodeInfo
}

export function inData (state) {
  return state.inData
}

export function validatorById (state) {
  if (!state.defaultValidators) return {}
  return (id) => state
    .defaultValidators
    .find(val => val.nodeID.includes(id))
}

export function defaultValidators (state) {
  return state.defaultValidators
}

export function delegationsCount (state) {
  if (!state.defaultValidators) return 0
  const dC = state.defaultValidators
    .reduce((a, b) => {
      const count = Array.isArray(b.delegators) ? b.delegators.length : b.delegators
      return a + count
    }, 0)
  return dC
}

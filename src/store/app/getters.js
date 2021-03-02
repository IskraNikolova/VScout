const {
  network
} = require('./../../modules/config').default

export function defaultValidators (state) {
  return state.defaultValidators
}

export function notificationNode (state) {
  return state.notificationNode
}

export function notifications (state) {
  return state.notifications
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
  return (id) => state
    .defaultValidators
    .find(val => val.nodeID.includes(id))
}

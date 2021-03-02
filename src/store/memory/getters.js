export function currentSubnet (state) {
  return state.currentSubnet
}

export function currentBlockchain (state) {
  return state.currentBlockchain
}

export function isBlockchainView (state) {
  return state.isBlockchainView
}

export function networkEndpoint (state) {
  return state.networkEndpoint
}

export function endpointsMemory (state) {
  return state.endpointsMemory
}

export function peers (state) {
  return state.peers
}

export function peerById (state) {
  return (id) => state
    .peers
    .peers
    .find(val => val.nodeID.includes(id))
}

export function peersMap (state) {
  return state.peersMap
}

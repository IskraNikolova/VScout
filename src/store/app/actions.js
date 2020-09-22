import { pChain } from './../../modules/avalanche.js'

import {
  INIT_APP,
  GET_SUBNETS,
  SET_SUBNETS,
  GET_HEIGHT,
  SET_HEIGHT,
  GET_NODE_ID,
  SET_NODE_ID,
  GET_NODE_INFO,
  SET_NODE_INFO,
  INIT_ENDPOINT,
  GET_VALIDATORS,
  SET_DELEGATORS,
  SET_STAKED_AVA,
  SET_VALIDATORS,
  GET_NODE_HEALTH,
  SET_NODE_HEALTH,
  GET_BLOCKCHAINS,
  SET_BLOCKCHAINS,
  SET_ASSETS_COUNT,
  GET_CURRENT_SUPPLY,
  SET_CURRENT_SUPPLY,
  SET_DEFAULT_VALIDATORS,
  GET_PENDING_VALIDATORS,
  SET_PENDING_VALIDATORS,
  SET_PENDING_DELEGATORS,
  GET_ASSETS_BY_BLOCKCHAINS
} from './types'

import {
  SET_ENDPOINT,
  SET_CURRENT_BLOCKCHAIN
} from './../memory/types'

import {
  UPDATE_UI
} from './../ui/types'

import {
  _health,
  _getPeers,
  _getNodeId,
  _getHeight,
  _validates,
  _getSubnets,
  _getNetworkID,
  _getValidators,
  _getNetworkName,
  _getNodeVersion,
  _getBlockchains,
  _getAssetsCount,
  _getBlockchainStatus,
  _getPendingValidators
} from './../../modules/network'

import {
// _initializeNetwork
} from './../../modules/networkRpc'

import {
  mapDelegators,
  mapValidators,
  validatorProcessing
} from './../../utils/validators'

const { network } = require('./../../modules/config').default

async function initApp ({ dispatch, getters }) {
  try {
    await Promise.all([
      dispatch(INIT_ENDPOINT),
      dispatch(GET_BLOCKCHAINS, {}),
      dispatch(GET_SUBNETS, {}),
      dispatch(GET_NODE_INFO),
      dispatch(GET_NODE_HEALTH),
      dispatch(GET_ASSETS_BY_BLOCKCHAINS),
      dispatch(GET_VALIDATORS, {
        subnetID: getters.subnetID,
        init: false
      }),
      dispatch(GET_HEIGHT, {}),
      dispatch(GET_CURRENT_SUPPLY)
      // _initializeNetwork()
    ])
  } catch (err) {
  }

  setInterval(async () => {
    try {
      await Promise.all([
        dispatch(GET_NODE_ID),
        dispatch(GET_NODE_HEALTH),
        dispatch(GET_HEIGHT, {}),
        dispatch(GET_CURRENT_SUPPLY),
        dispatch(GET_NODE_INFO),
        dispatch(GET_VALIDATORS, {
          subnetID: getters.subnetID
        }),
        dispatch(GET_PENDING_VALIDATORS, {
          subnetID: getters.subnetID,
          endpoint: getters.networkEndpoint.url
        })
      ])
    } catch (err) {
    }
  }, 6000)
}

async function initEndpoint ({ commit }) {
  const endpoint = network.endpointUrls[0]
  commit(SET_ENDPOINT, { endpoint })

  const response = await _getNodeId({ endpoint: endpoint.url })
  if (response.data.error) return

  const nodeID = response.data.result.nodeID
  commit(SET_NODE_ID, { nodeID })
}

async function getBlockchains (
  { commit, getters },
  { endpoint = getters.networkEndpoint.url }) {
  const response = await _getBlockchains({ endpoint })
  if (response.data.error) return null

  let { blockchains } = response.data.result
  if (typeof blockchains === 'undefined' ||
    blockchains === null) return

  blockchains.push({
    id: network.defaultSubnetID,
    subnetID: network.defaultSubnetID,
    vmID: '',
    name: 'P-Chain'
  })

  blockchains = await Promise.all(blockchains
    .map(async b => {
      const res = await _getBlockchainStatus({
        endpoint: getters.networkEndpoint.url,
        params: {
          blockchainID: b.id
        }
      })
      if (res.data.error) return b
      return {
        ...b,
        status: res.data.result.status
      }
    })
  )

  commit(SET_BLOCKCHAINS, { blockchains })
  if (!getters.currentBlockchain.id) {
    commit(SET_CURRENT_BLOCKCHAIN, { blockchain: blockchains[0] })
  }
}

async function getSubnets (
  { commit, getters },
  { endpoint = getters.networkEndpoint.url }) {
  const response = await _getSubnets({
    endpoint
  })
  if (response.data.error) return null

  const { subnets } = response.data.result
  if (typeof subnets === 'undefined' ||
    subnets === null) return

  const result = Promise.all(subnets.map(async subnet => {
    const response = await _validates({
      endpoint,
      params: {
        subnetID: subnet.id
      }
    })

    if (response.data.error) return
    const blockchainsId = response
      .data.result.blockchainIDs

    return {
      ...subnet,
      blockchainsId
    }
  }))

  commit(SET_SUBNETS, { subnets: await result })
}

async function getAssetsCount ({ commit }) {
  const assetsCount = await _getAssetsCount()
  commit(SET_ASSETS_COUNT, { assetsCount })
}

async function getValidators (
  { dispatch, commit, getters },
  { subnetID = network.defaultSubnetID, endpoint = getters.networkEndpoint.url, init = true }) {
  const response = await _getValidators({ subnetID, endpoint })

  if (response.data.error) {
    commit(UPDATE_UI, { doesItConnect: true })
    return null
  }

  commit(UPDATE_UI, { doesItConnect: false })
  let { validators, delegators } = response.data.result

  if (typeof validators === 'undefined' ||
    validators === null) {
    validators = []
    delegators = []
  }

  const del = mapDelegators(delegators)
  commit(SET_DELEGATORS, { delegators: del })

  const res = await validatorProcessing(validators, delegators, getters.defaultValidators)

  commit(SET_VALIDATORS, {
    validators: res.validators
  })

  commit(SET_STAKED_AVA, {
    all: res.allStake,
    validatedStake: res.validatedStake,
    delegatedStake: res.delegatedStake
  })

  if (getters.isDefaultSubnetID(subnetID)) {
    commit(SET_DEFAULT_VALIDATORS, {
      defaultValidators: res.validators
    })
  }
  dispatch(GET_CURRENT_SUPPLY)
}

async function getPendingValidators (
  { commit, getters },
  { subnetID = getters.subnetID, endpoint }) {
  const response = await _getPendingValidators({
    subnetID,
    endpoint
  })

  if (response.data.error) return null

  let { validators, delegators } = response.data.result

  if (typeof validators === 'undefined' ||
      validators === null) validators = []

  if (validators.length < 1) {
    commit(SET_PENDING_DELEGATORS, { delegators: [] })
    commit(SET_PENDING_VALIDATORS, { validators: [] })
    return
  }

  commit(SET_PENDING_DELEGATORS, {
    delegators: mapDelegators(delegators)
  })

  const val = await mapValidators(validators)
  commit(SET_PENDING_VALIDATORS, {
    validators: val
  })
}

async function getNodeId ({ getters, commit }) {
  const response = await _getNodeId({
    endpoint: getters.networkEndpoint.url
  })

  if (response.data.error) {
    commit(UPDATE_UI, { doesItConnect: true })
    return
  }
  if (typeof response === 'undefined' ||
    response === null) return

  commit(UPDATE_UI, { doesItConnect: false })
  const nodeID = response.data.result.nodeID
  commit(SET_NODE_ID, { nodeID })
}

async function getNodeInfo ({ getters, commit }) {
  const resNetworkID = await _getNetworkID({
    endpoint: getters.networkEndpoint.url
  })
  if (resNetworkID.data.error) {
    commit(UPDATE_UI, { doesItConnect: true })
    return
  }

  const resNetworkName = await _getNetworkName({
    endpoint: getters.networkEndpoint.url
  })
  if (resNetworkName.data.error) {
    commit(UPDATE_UI, { doesItConnect: true })
    return
  }

  const resNodeVersion = await _getNodeVersion({
    endpoint: getters.networkEndpoint.url
  })
  if (resNodeVersion.data.error) {
    commit(UPDATE_UI, { doesItConnect: true })
    return
  }

  const resNodePeers = await _getPeers({
    endpoint: getters.networkEndpoint.url
  })
  if (resNodePeers.data.error) return

  commit(UPDATE_UI, { doesItConnect: false })
  const nodeInfo = {
    networkID: resNetworkID.data.result.networkID,
    networkName: resNetworkName.data.result.networkName,
    nodeVersion: resNodeVersion.data.result.version,
    peers: resNodePeers.data.result.peers
  }

  commit(SET_NODE_INFO, { nodeInfo })
}

async function getNodeHealth ({ commit, getters }) {
  const response = await _health({
    endpoint: getters.networkEndpoint.url
  })
  if (typeof response === 'undefined' ||
    response === null) return

  let doesItConnect = true
  let nodeHealth = { healthy: false }
  if (!response.data.error) {
    doesItConnect = false
    nodeHealth = response.data.result
  }

  commit(SET_NODE_HEALTH, {
    nodeID: getters.nodeID,
    nodeHealth
  })
  commit(UPDATE_UI, { doesItConnect })
}

async function getHeight ({ commit, getters }, { endpoint = getters.networkEndpoint.url }) {
  const response = await _getHeight({
    endpoint
  })

  if (typeof response === 'undefined' ||
    response === null) return

  if (response.data.error) return

  const height = response.data.result.height

  commit(SET_HEIGHT, { height })
}

async function getCurrentSupply ({ commit, getters }) {
  try {
    const currentSupply = await pChain(getters.networkEndpoint, getters.nodeInfo.networkID)
      .getCurrentSupply()
    commit(SET_CURRENT_SUPPLY, { currentSupply })
  } catch (err) {
  }
}

export default {
  [INIT_APP]: initApp,
  [GET_HEIGHT]: getHeight,
  [GET_NODE_ID]: getNodeId,
  [GET_SUBNETS]: getSubnets,
  [GET_NODE_INFO]: getNodeInfo,
  [INIT_ENDPOINT]: initEndpoint,
  [GET_VALIDATORS]: getValidators,
  [GET_NODE_HEALTH]: getNodeHealth,
  [GET_BLOCKCHAINS]: getBlockchains,
  [GET_CURRENT_SUPPLY]: getCurrentSupply,
  [GET_ASSETS_BY_BLOCKCHAINS]: getAssetsCount,
  [GET_PENDING_VALIDATORS]: getPendingValidators
}

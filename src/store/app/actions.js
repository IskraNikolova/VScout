import {
  INIT_APP,
  GET_SUBNETS,
  SET_SUBNETS,
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
  INIT_VALIDATORS,
  GET_BLOCKCHAINS,
  SET_BLOCKCHAINS,
  SET_ASSETS_COUNT,
  INIT_BLOCKCHAIN_VIEW,
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
// _subscribeToContractEvents
} from './../../modules/networkRpc'

import {
  splitAccounts,
  mapDelegators,
  mapValidators,
  validatorProcessing,
  splitPendingAccounts
} from './../../utils/validators'

const { network } = require('./../../modules/config').default

async function initApp ({ dispatch, getters }) {
  try {
    await Promise.all([
      dispatch(INIT_ENDPOINT),
      dispatch(INIT_BLOCKCHAIN_VIEW, {}),
      dispatch(GET_NODE_INFO),
      dispatch(GET_NODE_HEALTH),
      // dispatch(GET_SUBNETS, {}),
      dispatch(GET_ASSETS_BY_BLOCKCHAINS),
      dispatch(INIT_VALIDATORS, {
        subnetID: getters.subnetID
      })
      // _initializeNetwork()
    ])
  } catch (err) {
    console.log(err)
  }

  // dispatch(SUBSCRIBE_TO_EVENT)
  setInterval(async () => {
    try {
      await Promise.all([
        dispatch(GET_NODE_HEALTH),
        dispatch(GET_NODE_INFO),
        dispatch(GET_VALIDATORS, {
          endpoint: getters.networkEndpoint.url
        }),
        dispatch(GET_PENDING_VALIDATORS, {
          endpoint: getters.networkEndpoint.url
        })
      ])
    } catch (err) {
      console.log(err)
    }
  }, 6000)
}

async function initEndpoint ({ commit, getters }) {
  let endpoint = network.endpointUrls[1]
  let response = await _getNodeId({ endpoint: endpoint.url })
  if (response.data.error) {
    endpoint = getters.networkEndpoint
    response = await _getNodeId({ endpoint: endpoint.url })
    if (response.data.error) {
      endpoint = network.endpointUrls[0]
      response = await _getNodeId({ endpoint: endpoint.url })
    }
  }

  const nodeID = response.data.result.nodeID
  commit(SET_ENDPOINT, { endpoint })
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
}

async function initBlockchainView (
  { commit, getters },
  { endpoint = getters.networkEndpoint.url }) {
  if (getters.currentBlockchain.id) return

  const response = await _getBlockchains({ endpoint })
  if (response.data.error) return null

  const { blockchains } = response.data.result
  if (typeof blockchains === 'undefined' ||
    blockchains === null) return

  commit(SET_BLOCKCHAINS, { blockchains })

  let blockchain = blockchains[0]
  const res = await _getBlockchainStatus({
    endpoint: getters.networkEndpoint.url,
    params: {
      blockchainID: blockchain.id
    }
  })

  if (!res.data.error) {
    blockchain = {
      ...blockchain,
      status: res.data.result.status
    }
  }

  commit(SET_CURRENT_BLOCKCHAIN, { blockchain })
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
  if (typeof assetsCount === 'undefined' ||
  assetsCount === null) return

  commit(SET_ASSETS_COUNT, { assetsCount })
}

async function initValidators (
  { commit, getters },
  { subnetID = network.defaultSubnetID }) {
  const response = await _getValidators({
    subnetID,
    endpoint: getters.networkEndpoint.url
  })

  if (response.data.error) {
    commit(UPDATE_UI, { doesItConnect: true })
    return null
  }

  commit(UPDATE_UI, { doesItConnect: false })
  const { validators } = response.data.result

  if (typeof validators === 'undefined' ||
    validators === null) return

  const { v, d } = splitAccounts(validators)

  const delegators = mapDelegators(d)
  commit(SET_DELEGATORS, { delegators })

  const res = await validatorProcessing(v, d, getters.defaultValidators)

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
}

async function getValidators (
  { commit, getters },
  { subnetID = getters.subnetID, endpoint }) {
  const response = await _getValidators({
    subnetID,
    endpoint
  })

  if (response.data.error) return null

  let { validators } = response.data.result
  if (typeof validators === 'undefined' ||
    validators === null) validators = []

  if (validators.length === getters.validators.length) return

  const { v, d } = splitAccounts(validators)
  const delegators = mapDelegators(d)
  commit(SET_DELEGATORS, { delegators })

  const res = await validatorProcessing(v, d, getters.defaultValidators)

  commit(SET_VALIDATORS, {
    validators: res.validators
  })

  commit(SET_STAKED_AVA, {
    all: res.allStake,
    validatedStake: res.validatedStake,
    delegatedStake: res.delegatedStake
  })

  if (subnetID === network.defaultSubnetID) {
    commit(SET_DEFAULT_VALIDATORS, {
      defaultValidators: res.validators
    })
  }

  return true
}

async function getPendingValidators (
  { commit, getters },
  { subnetID = getters.subnetID, endpoint }) {
  const response = await _getPendingValidators({
    subnetID,
    endpoint
  })

  if (response.data.error) return null

  let { validators } = response.data.result
  if (typeof validators === 'undefined' ||
      validators === null) validators = []

  if (validators.length < 1) {
    commit(SET_PENDING_DELEGATORS, { delegators: [] })
    commit(SET_PENDING_VALIDATORS, { validators: [] })
    return
  }

  const { v, d } = splitPendingAccounts(validators, getters.validators)

  commit(SET_PENDING_DELEGATORS, {
    delegators: mapDelegators(d)
  })

  const val = await mapValidators(v)
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

  if (response.data.error) {
    commit(SET_NODE_HEALTH, {
      nodeID: getters.nodeID,
      nodeHealth: { healthy: false }
    })
    commit(UPDATE_UI, { doesItConnect: true })
  }

  commit(UPDATE_UI, { doesItConnect: false })
  commit(SET_NODE_HEALTH, {
    nodeID: getters.nodeID,
    nodeHealth: response.data.result
  })
}

// function subscribeToEvents ({ commit, dispatch }) {
//   const sentMessageHandler = async (error, result) => {
//     if (error) console.error(error)
//     console.log(result)
//     // TODO UPDATE VALIDATOR INFO
//   }

//   _subscribeToContractEvents({
//     eventName: 'SetValidatorInfoEvent',
//     filters: {},
//     handler: sentMessageHandler
//   })
// }

export default {
  [INIT_APP]: initApp,
  [GET_NODE_ID]: getNodeId,
  [GET_SUBNETS]: getSubnets,
  [GET_NODE_INFO]: getNodeInfo,
  [INIT_ENDPOINT]: initEndpoint,
  [GET_VALIDATORS]: getValidators,
  [GET_NODE_HEALTH]: getNodeHealth,
  [GET_BLOCKCHAINS]: getBlockchains,
  [INIT_VALIDATORS]: initValidators,
  [INIT_BLOCKCHAIN_VIEW]: initBlockchainView,
  [GET_ASSETS_BY_BLOCKCHAINS]: getAssetsCount,
  [GET_PENDING_VALIDATORS]: getPendingValidators
}

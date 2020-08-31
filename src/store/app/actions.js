import { Notify } from 'quasar'
import {
  INIT_APP,
  GET_SUBNETS,
  SET_SUBNETS,
  GET_NODE_ID,
  SET_NODE_ID,
  SET_ENDPOINT,
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
  SET_DEFAULT_VALIDATORS,
  GET_PENDING_VALIDATORS,
  SET_PENDING_VALIDATORS,
  SET_PENDING_DELEGATORS,
  SET_CURRENT_BLOCKCHAIN,
  GET_ASSETS_BY_BLOCKCHAINS,
  SET_ASSETS_BY_BLOCKCHAINS
} from './types'

import {
  UPDATE_UI
} from './../ui/types'

import {
  _health,
  _validates,
  _getSubnets,
  _getNodeId,
  _getNetworkID,
  _getNetworkName,
  _getNodeVersion,
  _getPeers,
  _getBlockchains,
  _getValidators,
  _getAssetsForChain,
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
    Promise.all([
      dispatch(INIT_ENDPOINT),
      dispatch(INIT_VALIDATORS),
      dispatch(GET_NODE_HEALTH),
      dispatch(GET_NODE_INFO),
      dispatch(GET_BLOCKCHAINS),
      dispatch(GET_SUBNETS),
      dispatch(GET_ASSETS_BY_BLOCKCHAINS)
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
          subnetID: getters.subnetID,
          endpoint: getters.networkEndpoint
        }),
        dispatch(GET_PENDING_VALIDATORS, {
          subnetID: getters.subnetID
        })
      ])
    } catch (err) {
      console.log(err)
    }
  }, 6000)
}

async function initEndpoint ({ commit }) {
  const local = network.endpointUrls[1]
  const response = await _getNodeId({ endpoint: local })
  if (response.data.error) {
    const response = await _getNodeId({ endpoint: local })
    if (response.data.error) return
    const nodeID = response.data.result.nodeID
    commit(SET_ENDPOINT, { endpoint: network.endpointUrls[0] })
    commit(SET_NODE_ID, { nodeID })
    return
  }

  const nodeID = response.data.result.nodeID
  commit(SET_ENDPOINT, { endpoint: local })
  commit(SET_NODE_ID, { nodeID })
}

async function getBlockchains ({ commit, getters }) {
  const response = await _getBlockchains({
    endpoint: getters.networkEndpoint
  })

  if (response.data.error) {
    return null
  }

  let { blockchains } = response.data.result
  if (typeof blockchains === 'undefined' ||
    blockchains === null) return

  blockchains.push({
    id: '11111111111111111111111111111111LpoYY',
    subnetID: '11111111111111111111111111111111LpoYY',
    vmID: '',
    name: 'P-Chain'
  })
  console.log(blockchains)
  blockchains = await Promise.all(blockchains
    .map(async b => {
      const res = await _getBlockchainStatus({
        endpoint: getters.networkEndpoint,
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
  commit(SET_CURRENT_BLOCKCHAIN, {
    blockchain: blockchains[0]
  })
}

async function getSubnets ({ commit, getters }) {
  const response = await _getSubnets({
    endpoint: getters.networkEndpoint
  })

  if (response.data.error) {
    return null
  }

  const { subnets } = response.data.result
  if (typeof subnets === 'undefined' ||
    subnets === null) return

  const result = Promise.all(subnets.map(async subnet => {
    const response = await _validates({
      endpoint: getters.networkEndpoint,
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

async function getAssetsByBlockchain ({ commit }) {
  const assetsByChain = await _getAssetsForChain()
  if (typeof assetsByChain === 'undefined' ||
    assetsByChain === null) return

  commit(SET_ASSETS_BY_BLOCKCHAINS, { assetsByChain })
}

async function initValidators ({ commit, getters }) {
  const subnetID = getters.subnetID ? getters.subnetID : '11111111111111111111111111111111LpoYY'
  const response = await _getValidators({
    subnetID,
    endpoint: getters.networkEndpoint
  })

  if (response.data.error) {
    commit(UPDATE_UI, { doesItConnect: true })
    Notify.create({ position: 'top', message: 'Could not connect to the endpoint', icon: 'warning', color: 'white', textColor: 'orange' })
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

  commit(SET_VALIDATORS, { validators: res.validators })
  commit(SET_STAKED_AVA, { all: res.allStake, validatedStake: res.validatedStake, delegatedStake: res.delegatedStake })
  if (getters.isDefaultSubnetID) {
    commit(SET_DEFAULT_VALIDATORS, { defaultValidators: res.validators })
  }
}

async function getValidators (
  { commit, getters },
  { subnetID, endpoint }) {
  const response = await _getValidators({
    subnetID,
    endpoint
  })

  if (response.data.error) {
    return null
  }

  const { validators } = response.data.result

  if (typeof validators === 'undefined' ||
    validators === null) return

  if (validators.length === getters.validators.length) return

  const { v, d } = splitAccounts(validators)
  const delegators = mapDelegators(d)
  commit(SET_DELEGATORS, { delegators })

  const res = await validatorProcessing(v, d, getters.defaultValidators)
  commit(SET_VALIDATORS, { validators: res.validators })
  commit(SET_STAKED_AVA, { all: res.allStake, validatedStake: res.validatedStake, delegatedStake: res.delegatedStake })
  if (subnetID === '11111111111111111111111111111111LpoYY') {
    commit(SET_DEFAULT_VALIDATORS, { defaultValidators: res.validators })
  }
  return true
}

async function getPendingValidators ({ commit, getters }, { subnetID }) {
  const response = await _getPendingValidators({
    subnetID,
    endpoint: getters.networkEndpoint
  })

  if (response.data.error) {
    return null
  }

  const { validators } = response.data.result

  if (typeof validators === 'undefined' ||
      validators === null) return

  if (validators.length < 1) {
    commit(SET_PENDING_DELEGATORS, { delegators: [] })
    commit(SET_PENDING_VALIDATORS, { validators: [] })
    return
  }

  const { v, d } = splitPendingAccounts(validators, getters.validators)

  commit(SET_PENDING_DELEGATORS, { delegators: mapDelegators(d) })

  const val = await mapValidators(v)
  commit(SET_PENDING_VALIDATORS, { validators: val })
}

async function getNodeId ({ getters, commit }) {
  const response = await _getNodeId({ endpoint: getters.networkEndpoint })
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
  const resNetworkID = await _getNetworkID({ endpoint: getters.networkEndpoint })
  if (resNetworkID.data.error) {
    commit(UPDATE_UI, { doesItConnect: true })
    return
  }

  const resNetworkName = await _getNetworkName({ endpoint: getters.networkEndpoint })
  if (resNetworkName.data.error) {
    commit(UPDATE_UI, { doesItConnect: true })
    return
  }

  const resNodeVersion = await _getNodeVersion({ endpoint: getters.networkEndpoint })
  if (resNodeVersion.data.error) {
    commit(UPDATE_UI, { doesItConnect: true })
    return
  }

  const resNodePeers = await _getPeers({ endpoint: getters.networkEndpoint })
  if (resNodePeers.data.error) {
    return
  }

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
  const response = await _health({ endpoint: getters.networkEndpoint })
  if (typeof response === 'undefined' ||
    response === null) return

  if (response.data.error) {
    commit(SET_NODE_HEALTH, { nodeID: getters.nodeID, nodeHealth: { healthy: false } })
    commit(UPDATE_UI, { doesItConnect: true })
  }

  commit(UPDATE_UI, { doesItConnect: false })
  commit(SET_NODE_HEALTH, { nodeID: getters.nodeID, nodeHealth: response.data.result })
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
  [GET_PENDING_VALIDATORS]: getPendingValidators,
  [GET_ASSETS_BY_BLOCKCHAINS]: getAssetsByBlockchain
}

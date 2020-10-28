import {
  INIT_APP,
  GET_HEIGHT,
  GET_NODE_ID,
  GET_SUBNETS,
  GET_NODE_INFO,
  GET_STAKING,
  GET_AVAX_PRICE,
  INIT_ENDPOINT,
  SET_VALIDATORS,
  SET_DELEGATORS,
  SET_STAKED_AVA,
  GET_NODE_HEALTH,
  GET_BLOCKCHAINS,
  UPDATE_VALIDATOR,
  SET_ASSETS_COUNT,
  GET_CURRENT_SUPPLY,
  SUBSCRIBE_TO_EVENT,
  GET_PENDING_STAKING,
  SET_DEFAULT_VALIDATORS,
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
  _getAssetPrice,
  _getNetworkID,
  // _getStake,
  // _getTotalStake,
  _getValidators,
  _getNetworkName,
  _getNodeVersion,
  _getBlockchains,
  _getAssetsCount,
  _getBlockchainStatus,
  _getPendingValidators
} from './../../modules/network.js'

import {
  mapDelegators,
  mapPendingValidators,
  validatorProcessing
} from './../../utils/validators.js'

const {
  network
} = require('./../../modules/config.js')
  .default

import {
  _initializeNetwork,
  _getValidatorByEvent,
  _subscribeToContractEvents
} from './../../modules/networkCChain.js'

import {
  pChain
} from './../../modules/avalanche.js'

async function initApp (
  { dispatch, getters }) {
  try {
    Promise.all([
      dispatch(GET_BLOCKCHAINS, {}),
      dispatch(GET_SUBNETS, {})
    ])
    await Promise.all([
      dispatch(GET_AVAX_PRICE),
      dispatch(INIT_ENDPOINT),
      dispatch(GET_NODE_INFO),
      dispatch(GET_NODE_HEALTH),
      dispatch(GET_ASSETS_BY_BLOCKCHAINS),
      dispatch(GET_HEIGHT, {}),
      dispatch(GET_CURRENT_SUPPLY),
      _initializeNetwork(),
      dispatch(GET_STAKING, {
        subnetID: getters.subnetID,
        isInit: true
      }),
      dispatch(GET_PENDING_STAKING, {})
    ]).then(() => dispatch(SUBSCRIBE_TO_EVENT))
  } catch (err) {
  }

  setInterval(async () => {
    try {
      await Promise.all([
        dispatch(GET_STAKING, {
          subnetID: getters.subnetID,
          isInit: false
        }),
        dispatch(GET_PENDING_STAKING, {}),
        dispatch(GET_AVAX_PRICE),
        dispatch(GET_NODE_HEALTH),
        dispatch(GET_HEIGHT, {})
      ])
    } catch (err) {
    }
  }, 20000)
}

async function initEndpoint (
  { commit, getters }) {
  const endpoint = getters.networkEndpoint
  commit(SET_ENDPOINT, { endpoint })

  const response = await _getNodeId({
    endpoint: endpoint.url
  })

  if (response.data.error) {
    const endpoint = network.endpointUrls[0]
    commit(SET_ENDPOINT, { endpoint })

    const response = await _getNodeId({
      endpoint: endpoint.url
    })

    if (response.data.error) return

    const nodeID = response.data.result.nodeID
    commit(GET_NODE_ID, { nodeID })
  }

  const nodeID = response.data.result.nodeID
  commit(GET_NODE_ID, { nodeID })
}

async function getValidators (
  { commit, getters },
  {
    subnetID = network.defaultSubnetID,
    endpoint = getters.networkEndpoint.url,
    isInit = true
  }) {
  const response = await _getValidators({
    subnetID,
    endpoint
  })

  // const stakeResponse = await _getTotalStake({
  //   endpoint: 'https://api.avax.network:443/'
  // })

  // let totalStake = 0
  // if (!stakeResponse.data.error) {
  //   totalStake = stakeResponse.data.result.stake
  // }

  if (response.data.error) {
    commit(UPDATE_UI, { doesItConnect: true })
    return null
  }
  commit(UPDATE_UI, { doesItConnect: false })

  let { validators, delegators } = response.data.result

  if (typeof validators === 'undefined' ||
    validators === null) {
    validators = []
  }

  const res = await validatorProcessing(
    validators,
    delegators,
    getters.defaultValidators,
    isInit
  )
  // const addresses = res.validators.map(v => v.rewardOwner.addresses.join(','))

  // const stakeRes = await _getStake({
  //   endpoint: 'https://api.avax.network:443/',
  //   params: { addresses: addresses.slice(0, 223) }
  // })
  // console.log(stakeRes)

  commit(SET_STAKED_AVA, {
    all: res.allStake,
    validatedStake: res.validatedStake,
    delegatedStake: res.delegatedStake
  })

  commit(SET_VALIDATORS, {
    validators: res.validators
  })

  if (delegators.length < 1) {
    delegators = res
      .validators
      .reduce((a, c) => {
        a.push.apply(a, c.delegators)
        return a
      }, [])
  }
  commit(SET_DELEGATORS, {
    delegators: mapDelegators(delegators)
  })

  if (getters.isDefaultSubnetID(subnetID)) {
    commit(SET_DEFAULT_VALIDATORS, {
      defaultValidators: res.validators
    })
  }
}

async function getPValidators (
  { commit, getters },
  {
    subnetID = getters.subnetID,
    endpoint = getters.networkEndpoint.url
  }) {
  const response = await _getPendingValidators({
    subnetID,
    endpoint: 'https://api.avax.network:443/'
  })

  if (response.data.error) return null

  let { validators, delegators } = response.data.result

  if (typeof validators === 'undefined' ||
      validators === null) validators = []

  commit(SET_PENDING_DELEGATORS, { delegators })

  const val = mapPendingValidators(
    validators,
    getters.defaultValidators
  )

  commit(SET_PENDING_VALIDATORS, {
    validators: val
  })
}

async function getHeight (
  { commit, getters },
  { endpoint = getters.networkEndpoint.url }) {
  const response = await _getHeight({
    endpoint
  })

  if (typeof response === 'undefined' ||
    response === null) return

  if (response.data.error) return

  const height = response.data.result.height

  commit(GET_HEIGHT, { height })
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

  if (subnets.length <= getters.subnets.length) return

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

  commit(GET_SUBNETS, { subnets: await result })
}

async function getNodeId (
  { getters, commit }) {
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
  commit(GET_NODE_ID, { nodeID })
}

async function getNodeInfo (
  { getters, commit }) {
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
    peers: { peers: resNodePeers.data.result.peers, numPeers: resNodePeers.data.result.numPeers }
  }

  commit(GET_NODE_INFO, { nodeInfo })
}

function getAvaxPrice (
  { commit }) {
  _getAssetPrice('AVAX')
    .then((avaxUsdPrice) => {
      if (!avaxUsdPrice) return
      commit(GET_AVAX_PRICE, { avaxUsdPrice })
    })
    .catch((err) => console.log(err))
}

async function getNodeHealth (
  { commit, getters }) {
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

  commit(GET_NODE_HEALTH, {
    nodeID: getters.nodeID,
    nodeHealth
  })
  commit(UPDATE_UI, { doesItConnect })
}

async function getBlockchains (
  { commit, getters },
  { endpoint = getters.networkEndpoint.url }) {
  const response = await _getBlockchains({ endpoint })
  if (response.data.error) return null

  let { blockchains } = response.data.result

  if (typeof blockchains === 'undefined' ||
    blockchains === null) return

  if (blockchains.length <= getters.blockchains.length) return

  blockchains.push({
    id: network.defaultSubnetID,
    subnetID: network.defaultSubnetID,
    vmID: '',
    name: 'P-Chain'
  })

  blockchains = await Promise.all(blockchains
    .map(async b => {
      const res = await _getBlockchainStatus({
        endpoint,
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

  commit(GET_BLOCKCHAINS, { blockchains })
  if (!getters.currentBlockchain.id) {
    commit(SET_CURRENT_BLOCKCHAIN, { blockchain: blockchains[0] })
  }
}

async function getAssetsCount (
  { commit }) {
  const assetsCount = await _getAssetsCount()
  commit(SET_ASSETS_COUNT, { assetsCount })
}

async function getCurrentSupply (
  { commit, getters }) {
  try {
    const currentSupply = await pChain(
      getters.networkEndpoint,
      getters.nodeInfo.networkID
    )
      .getCurrentSupply()

    commit(GET_CURRENT_SUPPLY, { currentSupply })
  } catch (err) {
    console.error(err)
  }
}

function subscribeToEvents ({ commit, dispatch, getters }) {
  const sentMessageHandler = async (error, result) => {
    if (error) console.error(error)
    try {
      const validator = _getValidatorByEvent(result)
      commit(UPDATE_VALIDATOR, { validator })
    } catch (err) {
      console.error(err)
      await dispatch(GET_STAKING, {
        subnetID: getters.subnetID,
        isInit: true
      })
    }
  }

  _subscribeToContractEvents({
    eventName: 'SetValidatorInfoEvent',
    filters: {},
    handler: sentMessageHandler
  })
}

export default {
  [INIT_APP]: initApp,
  [GET_HEIGHT]: getHeight,
  [GET_NODE_ID]: getNodeId,
  [GET_SUBNETS]: getSubnets,
  [GET_NODE_INFO]: getNodeInfo,
  [INIT_ENDPOINT]: initEndpoint,
  [GET_STAKING]: getValidators,
  [GET_AVAX_PRICE]: getAvaxPrice,
  [GET_NODE_HEALTH]: getNodeHealth,
  [GET_BLOCKCHAINS]: getBlockchains,
  [GET_CURRENT_SUPPLY]: getCurrentSupply,
  [GET_PENDING_STAKING]: getPValidators,
  [SUBSCRIBE_TO_EVENT]: subscribeToEvents,
  [GET_ASSETS_BY_BLOCKCHAINS]: getAssetsCount
}

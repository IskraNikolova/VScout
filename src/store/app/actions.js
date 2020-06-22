import moment from 'moment'

import { Notify } from 'quasar'

import {
  SIGN_TX,
  INIT_APP,
  GET_SUBNETS,
  SET_SUBNETS,
  GET_NODE_ID,
  SET_NODE_ID,
  GET_ACCOUNT,
  CREATE_USER,
  FUND_ACCOUNT,
  LIST_ACCOUNTS,
  GET_TOTAL_TXS,
  SET_TOTAL_TXS,
  GET_VALIDATORS,
  SET_DELEGATORS,
  SET_STAKED_AVA,
  SET_VALIDATORS,
  CREATE_ACCOUNT,
  GET_NODE_HEALTH,
  SET_NODE_HEALTH,
  INIT_VALIDATORS,
  GET_BLOCKCHAINS,
  SET_BLOCKCHAINS,
  GET_TXS_HISTORY,
  SET_TXS_HISTORY,
  SUBSCRIBE_TO_EVENT,
  GET_TX_FOR_24_HOURS,
  SET_TX_FOR_24_HOURS,
  SET_PREVIOUS_24_TXS,
  SET_PREVIOUS_TOTAL_TXS,
  DELEGATE_VALIDATOR,
  GET_PENDING_VALIDATORS,
  SET_PENDING_VALIDATORS,
  SET_PENDING_DELEGATORS,
  SET_CURRENT_BLOCKCHAIN,
  GET_ASSETS_BY_BLOCKCHAINS,
  SET_ASSETS_BY_BLOCKCHAINS,
  ADD_VALIDATOR_TO_DEFAULT_SUBNET
} from './types'

import {
  UPDATE_UI
} from './../ui/types'

import {
  _sign,
  _health,
  _issueTx,
  _validates,
  _exportAVA,
  _importAVA,
  _getSubnets,
  _getLastTx,
  _getTxStatus,
  _getNodeId,
  _getAccount,
  _createAccount,
  _createUser,
  _createAddress,
  _listAccounts,
  _getBlockchains,
  _getValidators,
  _getAggregates,
  _getAssetsForChain,
  _getAggregatesWithI,
  _getPendingValidators,
  _addDefaultSubnetDelegator,
  _addDefaultSubnetValidator
} from './../../modules/network'

import {
  // _initializeNetwork,
  subscribeToContractEvents
} from './../../modules/networkRpc'

import {
  temp,
  compare,
  splitAccounts,
  mapDelegators,
  mapValidators,
  validatorProcessing,
  splitPendingAccounts
} from './../../utils/validators'

async function initApp ({ dispatch, getters }) {
  await dispatch(GET_BLOCKCHAINS)
  await dispatch(GET_NODE_ID)
  try {
    Promise.all([
      dispatch(GET_TX_FOR_24_HOURS),
      dispatch(GET_TXS_HISTORY, {
        txHKey: getters.txHKey
      }),
      dispatch(GET_SUBNETS),
      dispatch(GET_NODE_HEALTH),
      dispatch(GET_ASSETS_BY_BLOCKCHAINS),
      dispatch(INIT_VALIDATORS),
      dispatch(GET_TOTAL_TXS)
    ])
  } catch (err) {
    console.log(err)
  }

  // await _initializeNetwork()
  // dispatch(SUBSCRIBE_TO_EVENT)

  setInterval(() => {
    dispatch(GET_TX_FOR_24_HOURS)
    dispatch(GET_TXS_HISTORY, {
      txHKey: getters.txHKey
    })
  }, 30000)
  setInterval(async () => {
    await Promise.all([
      dispatch(GET_TOTAL_TXS),
      dispatch(GET_NODE_HEALTH),
      dispatch(GET_PENDING_VALIDATORS, {
        subnetID: getters.subnetID
      }),
      dispatch(GET_VALIDATORS, {
        subnetID: getters.subnetID,
        endpoint: getters.networkEndpoint
      })
    ])
    if (getters.prevTotalTxs < getters.totalTxsCount) {
      await Promise.all([
        dispatch(GET_TX_FOR_24_HOURS),
        dispatch(GET_TXS_HISTORY, {
          txHKey: getters.txHKey
        })
      ])
    }
  }, 6000)
}

async function getBlockchains ({ commit, getters }) {
  const response = await _getBlockchains({
    endpoint: getters.networkEndpoint
  })

  if (response.data.error) {
    return null
  }

  const { blockchains } = response.data.result
  if (typeof blockchains === 'undefined' ||
    blockchains === null) return

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

async function getTxsFor24H ({ commit, getters }) {
  const minAgo = moment().subtract(24, 'hours')
  const response = await _getAggregates(
    minAgo.toISOString(),
    moment().toISOString()
  )

  if (typeof response === 'undefined' ||
    response === null) return

  const { transactionCount, transactionVolume } = response
  commit(SET_PREVIOUS_24_TXS, { prevTxsFor24H: getters.txsFor24H })
  commit(SET_TX_FOR_24_HOURS, {
    txsFor24H: {
      transactionCount,
      transactionVolume: Math.round(transactionVolume / 10 ** 9)
    }
  })
}

async function getTotalTXs ({ commit, getters }) {
  const response = await _getLastTx()
  if (typeof response === 'undefined' ||
    response === null) return

  const totalTxsCount = response.count
  commit(SET_PREVIOUS_TOTAL_TXS, {
    prevTotalTxs: getters.totalTxsCount
  })
  commit(SET_TOTAL_TXS, { totalTxsCount })
}

async function getTxsHistory ({ commit }, { txHKey }) {
  const t = temp[txHKey]
  if (!t) return

  const { sub, interval, label } = t
  const minAgo = moment(new Date())
    .subtract(sub.value, sub.label)

  const aggregates = await _getAggregatesWithI(
    minAgo.toISOString(),
    moment(new Date()).toISOString(),
    `${interval.value}${interval.label}`
  )

  if (aggregates === null) return null

  try {
    aggregates.intervals.map(a => {
      if (moment(a.endTime) > moment() &&
        aggregates.intervalSize) {
        aggregates.intervals.pop()
      }
    })
  } catch (err) {
    return null
  }

  aggregates.label = label
  aggregates.key = txHKey

  commit(SET_TXS_HISTORY, {
    key: txHKey,
    txsHistory: aggregates
  })
  return true
}

async function getAssetsByBlockchain ({ commit }) {
  const assetsByChain = await _getAssetsForChain()
  if (typeof assetsByChain === 'undefined' ||
    assetsByChain === null) return

  commit(SET_ASSETS_BY_BLOCKCHAINS, { assetsByChain })
}

async function initValidators ({ commit, getters }) {
  const response = await _getValidators({
    subnetID: getters.subnetID,
    endpoint: getters.networkEndpoint
  })

  if (response.data.error) {
    return null
  }

  const { validators } = response.data.result
  if (typeof validators === 'undefined' ||
    validators === null) return

  const { v, d } = splitAccounts(validators)

  const delegators = mapDelegators(d)
  const resultValidators = validatorProcessing(v, getters.validators)

  commit(SET_DELEGATORS, { delegators })
  commit(SET_VALIDATORS, { validators: resultValidators })
  commit(SET_STAKED_AVA, { validators: resultValidators })
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

  if (getters.validators.length < 1) return
  const resultValidators = validatorProcessing(v, getters.validators)
  commit(SET_VALIDATORS, { validators: resultValidators })
  commit(SET_STAKED_AVA, { validators: resultValidators })
  return true
}

async function getPendingValidators ({ commit, getters }, { subnetID }) {
  const response = await _getPendingValidators({
    subnetID,
    endpoint: getters.networkEndpoint
  })

  if (response.data.error) {
    Notify.create(response.data.error.message)
    return null
  }

  const { validators } = response.data.result
  if (typeof validators === 'undefined' ||
      validators === null) return

  let { v, d } = splitPendingAccounts(validators, getters.validators)
  commit(SET_PENDING_DELEGATORS, { delegators: mapDelegators(d) })

  v = v.filter(i => i.endTime >= Date.now() / 1000)
  v.sort(compare)
  const val = mapValidators(v)
  commit(SET_PENDING_VALIDATORS, { validators: val })
}

async function getNodeId ({ getters, commit }) {
  const response = await _getNodeId({ endpoint: getters.networkEndpoint })
  if (response.data.error) {
    return
  }
  if (typeof response === 'undefined' ||
    response === null) return

  commit(SET_NODE_ID, { nodeID: response.data.result.nodeID })
}

async function getAccount (
  { commit, getters },
  { address, type }) {
  try {
    const res = await _getAccount({
      endpoint: getters.networkEndpoint,
      params: { address }
    })
    if (res.data.error) {
      throw new Error(res.data.error.message)
    }
    const account = res.data.result
    if (typeof account === 'undefined' ||
      account === null) return
    if (type === 'destination') {
      commit(UPDATE_UI, {
        addValidatorDialog: {
          isOpen: true,
          destinationAccount: account,
          payingAccount: getters.ui.addValidatorDialog.payingAccount
        }
      })
    } else {
      commit(UPDATE_UI, {
        addValidatorDialog: {
          isOpen: true,
          destinationAccount: getters.ui.addValidatorDialog.destinationAccount,
          payingAccount: account
        }
      })
    }
  } catch (err) {
    commit(UPDATE_UI, {
      addValidatorDialog: {
        isOpen: true,
        destinationAccount: {
          address: null
        }
      }
    })
  }
}

async function createAccount (
  { dispatch, getters },
  { username, password, type }) {
  try {
    const params = { username, password }
    const response = await _createAccount({
      endpoint: getters.networkEndpoint,
      params
    })

    if (response.data.error) {
      throw new Error(response.data.error.message)
    }

    const account = response.data.result

    await dispatch(GET_ACCOUNT, { address: account.address, type })
  } catch (err) {
    throw new Error(err.message)
  }
}

async function createUser ({ getters }, { username, password, withAddress }) {
  try {
    const params = { username, password }
    const response = await _createUser({
      endpoint: getters.networkEndpoint,
      params
    })
    if (response.data.error) {
      throw new Error(response.data.error.message)
    }

    if (withAddress) {
      const res = await _createAddress({
        endpoint: getters.networkEndpoint,
        params
      })

      if (res.data.error) {
        throw new Error(res.data.error.message)
      }
      return res.data.result
    }
    return response.data.result
  } catch (err) {
    throw new Error(err.message)
  }
}

async function listAccounts ({ getters }, { username, password }) {
  try {
    const params = { username, password }
    const response = await _listAccounts({
      endpoint: getters.networkEndpoint,
      params
    })
    if (response.data.error) {
      throw new Error(response.data.error.message)
    }
    return response.data.result
  } catch (err) {
    throw new Error(err.message)
  }
}

async function addValidatorToDefaultS ({ getters }, { params, signer }) {
  try {
    const endpoint = getters.networkEndpoint
    const res = await _getAccount({
      endpoint,
      params: { address: signer }
    })

    if (res.data.error) {
      throw new Error(res.data.error.message)
    }
    const account = res.data.result

    const nonce = Number(account.nonce) + 1
    params.payerNonce = nonce
    if (account.balance < params.stakeAmount) {
      throw new Error('Insufficient funds!')
    }

    const response = await _addDefaultSubnetValidator({
      endpoint: getters.networkEndpoint,
      params
    })
    if (response.data.error) {
      throw new Error(response.data.error.message)
    }

    return response.data.result.unsignedTx
  } catch (err) {
    throw new Error(err.message)
  }
}

async function addDefaultSubnetDelegator ({ getters }, { params, signer }) {
  try {
    const endpoint = getters.networkEndpoint
    const res = await _getAccount({
      endpoint,
      params: { address: signer }
    })

    if (res.data.error) {
      throw new Error(res.data.error.message)
    }
    const account = res.data.result
    const nonce = Number(account.nonce) + 1
    params.payerNonce = nonce
    if (account.balance < params.stakeAmount) {
      throw new Error('Insufficient funds!')
    }

    const response = await _addDefaultSubnetDelegator({
      endpoint: getters.networkEndpoint,
      params
    })
    if (response.data.error) {
      throw new Error(response.data.error.message)
    }

    return response.data.result.unsignedTx
  } catch (err) {
    throw new Error(err.message)
  }
}

async function signTransaction (
  { getters },
  { transaction, signer, username, password }) {
  try {
    const endpoint = getters.networkEndpoint
    const response = await _sign({
      endpoint,
      params: {
        tx: transaction,
        signer,
        username,
        password
      }
    })
    if (response.data.error) {
      throw new Error(response.data.error.message)
    }

    const res = await _issueTx({
      endpoint,
      params: response.data.result
    })
    if (res.data.error) {
      throw new Error(res.data.error.message)
    }

    return res.data.result.txID
  } catch (err) {
    throw new Error(err.message)
  }
}

async function fundAccount (
  { getters },
  { amount, username, password, to, nonce }) {
  try {
    const payerNonce = nonce + 1
    const endpoint = getters.networkEndpoint

    // export AVA
    const params = { to, amount, username, password }
    const response = await _exportAVA({ endpoint, params })

    if (response.data.error) {
      throw new Error(response.data.error.message)
    }
    const txID = response.data.result

    // getTxStatus
    let txStat = await _getTxStatus({ endpoint, params: txID })
    if (txStat.data.error) {
      throw new Error(txStat.data.error.message)
    }

    const interval = setInterval(async () => {
      if (txStat.data.result.status === 'Accepted') {
        clearInterval(interval)
        // import
        const r = await _importAVA({
          endpoint,
          params: {
            username,
            password,
            to,
            payerNonce
          }
        })
        if (r.data.error) {
          throw new Error(r.data.error.message)
        }
        // issueTx
        const res = await _issueTx({
          endpoint,
          params: r.data.result
        })

        if (res.data.error) {
          console.log(res.data.error.message)
        }
      }
      txStat = await _getTxStatus({ endpoint, params: txID })
    }, 1000)
  } catch (err) {
    throw new Error(err.message)
  }
}

async function getNodeHealth ({ commit, getters }) {
  const response = await _health({ endpoint: getters.networkEndpoint })
  if (typeof response === 'undefined' ||
    response === null) return

  if (response.data.error) {
    return null
  }

  commit(SET_NODE_HEALTH, { nodeID: getters.nodeID, nodeHealth: response.data.result })
}

function subscribeToEvents ({ commit, dispatch }) {
  const sentMessageHandler = async (error, result) => {
    if (error) console.error(error)
    console.log(result)
    // TODO UPDATE VALIDATOR INFO
  }

  subscribeToContractEvents({
    eventName: 'SetValidatorInfoEvent',
    filters: {},
    handler: sentMessageHandler
  })
}

export default {
  [INIT_APP]: initApp,
  [GET_NODE_ID]: getNodeId,
  [GET_ACCOUNT]: getAccount,
  [CREATE_USER]: createUser,
  [GET_SUBNETS]: getSubnets,
  [SIGN_TX]: signTransaction,
  [FUND_ACCOUNT]: fundAccount,
  [GET_TOTAL_TXS]: getTotalTXs,
  [LIST_ACCOUNTS]: listAccounts,
  [GET_VALIDATORS]: getValidators,
  [CREATE_ACCOUNT]: createAccount,
  [GET_TXS_HISTORY]: getTxsHistory,
  [GET_NODE_HEALTH]: getNodeHealth,
  [GET_BLOCKCHAINS]: getBlockchains,
  [INIT_VALIDATORS]: initValidators,
  [GET_TX_FOR_24_HOURS]: getTxsFor24H,
  [SUBSCRIBE_TO_EVENT]: subscribeToEvents,
  [GET_PENDING_VALIDATORS]: getPendingValidators,
  [GET_ASSETS_BY_BLOCKCHAINS]: getAssetsByBlockchain,
  [DELEGATE_VALIDATOR]: addDefaultSubnetDelegator,
  [ADD_VALIDATOR_TO_DEFAULT_SUBNET]: addValidatorToDefaultS
}

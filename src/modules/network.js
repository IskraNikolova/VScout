import axios from 'axios'

import { c } from './../utils/constants'
import { groupBy } from './../utils/commons'
const { network } = require('./config').default

let id = 1
axios.defaults.headers[c.contentTypeHeader] = c.contentTypeValue

const body = (method, params = {}) => {
  return {
    jsonrpc: c.jsonrpc,
    method,
    params,
    id: id++
  }
}

export const _getLastTx = async () => {
  try {
    const req = await axios
      .get(network.explorerApiBaseUrl + c.tx + c.getLast)
    return req.data
  } catch (err) {
    return null
  }
}

export const _getAssetsForChain = async () => {
  try {
    const req = await axios
      .get(network.explorerApiBaseUrl + c.listAssests)
    if (!req.data.assets) return

    return groupBy(req.data.assets, 'chainID')
  } catch (err) {
    return null
  }
}

export const _getAggregates = async (s, e) => {
  try {
    const req = await axios
      .get(network.explorerApiBaseUrl + c.tx + c.aggregates(s, e))
    return req.data.aggregates
  } catch (err) {
    return null
  }
}

export const _getAggregatesWithI = async (s, e, intervalSize) => {
  try {
    const endpoint = network.explorerApiBaseUrl +
      c.tx +
      c.aggregatesWInt(s, e, intervalSize)

    const req = await axios.get(endpoint)
    return req.data
  } catch (err) {
    return null
  }
}

export const request = async (endpoint, body) => {
  try {
    const response = await axios.post(endpoint, body)
    return response
  } catch (err) {
    return {
      data: {
        error: err
      }
    }
  }
}

export const _getBlockchains = async ({ endpoint }) => {
  const response = await request(endpoint + c.platform, body(c.getBlockchains))
  return response
}

export const _getSubnets = async ({ endpoint }) => {
  const response = await request(endpoint + c.platform, body(c.getSubnets))
  return response
}

export const _validates = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platform, body(c.validates, params))
  return response
}

export const _getValidators = async ({ subnetID, endpoint }) => {
  const response = await request(endpoint + c.platform, body(c.getCurrentValidators, { subnetID }))
  return response
}

export const _getPendingValidators = async ({ subnetID, endpoint }) => {
  const response = await request(endpoint + c.platform, body(c.getPendingValidators, { subnetID }))
  return response
}

export const _createUser = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.keystore, body(c.createUser, params))
  return response
}

export const _createAddress = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.avm, body(c.createAddress, params))
  return response
}

export const _createAccount = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platform, body(c.createAccount, params))
  return response
}

export const _listAccounts = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platform, body(c.listAccounts, params))
  return response
}

export const _getAccount = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platformBc, body(c.getAccount, params))
  return response
}

export const _issueTx = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platform, body(c.issueTx, params))
  return response
}

export const _exportAVA = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.avm, body(c.exportAVA, params))
  return response
}

export const _importAVA = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platform, body(c.importAVA, params))
  return response
}

export const _sign = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platform, body(c.sign, params))
  return response
}

export const _getTxStatus = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.avm, body(c.getTxStatus, params))
  return response
}

export const _getNodeId = async ({ endpoint }) => {
  const response = await request(endpoint + c.info, body(c.getNodeID))
  return response
}

export const _getNetworkID = async ({ endpoint }) => {
  const response = await request(endpoint + c.info, body(c.getNetworkID))
  return response
}

export const _getNetworkName = async ({ endpoint }) => {
  const response = await request(endpoint + c.info, body(c.getNetworkName))
  return response
}

export const _getNodeVersion = async ({ endpoint }) => {
  const response = await request(endpoint + c.info, body(c.getNodeVersion))
  return response
}

export const _getPeers = async ({ endpoint }) => {
  const response = await request(endpoint + c.info, body(c.peers))
  return response
}

export const _addDefaultSubnetValidator = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platform, body(c.addDefaultSubnetValidator, params))
  return response
}

export const _addDefaultSubnetDelegator = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platform, body(c.addDefaultSubnetDelegator, params))
  return response
}

export const _health = async ({ endpoint }) => {
  const response = await request(endpoint + c.health, body(c.getLiveness))
  return response
}

import axios from 'axios'
import { groupBy } from './../utils/commons'
import { c } from './../utils/constants'
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

export const testConnection = async ({ endpoint, params = {} }) => {
  try {
    const response = await axios.post(endpoint + c.timestamp, body(c.getBlock, params))
    return response.status
  } catch (err) {
    return err.message
  }
}

export const _getLastTx = async () => {
  const req = await axios.get(network.explorerApiBaseUrl + c.tx + c.getLast)
  return req.data
}

export const _getAssetsForChain = async () => {
  const req = await axios.get(network.explorerApiBaseUrl + c.listAssests)
  if (!req.data.assets) return

  return groupBy(req.data.assets, 'chainID')
}

export const _getAggregates = async (s, e) => {
  const req = await axios.get(network.explorerApiBaseUrl + c.tx + c.aggregates(s, e))
  return req.data.aggregates
}

export const _getAggregatesWithI = async (s, e, intervalSize) => {
  const req = await axios.get(network.explorerApiBaseUrl + c.tx + c.aggregatesWInt(s, e, intervalSize))
  return req.data
}

export const request = async (endpoint, body) => {
  const response = await axios.post(endpoint, body)
  return response.data.result
}

export const _getBlock = async ({ params = {}, endpoint }) => {
  return request(endpoint + c.timestamp, body(c.getBlock, params))
}

export const _getBlockchains = async ({ endpoint }) => {
  return request(endpoint + c.platform, body(c.getBlockchains))
}

export const _getValidators = async ({ subnetID, endpoint }) => {
  return request(endpoint + c.platform, body(c.getCurrentValidators, { subnetID }))
}

export const _getPendingValidators = async ({ subnetID, endpoint }) => {
  return request(endpoint + c.platform, body(c.getPendingValidators, { subnetID }))
}

import axios from 'axios'

import { c } from './../utils/constants'
const { network } = require('./config').default
const server = 'http://localhost:5000/' // 'https://vscout.io/dev/'

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

export const _getAssetsCount = async () => {
  try {
    const req = await axios
      .get(network.explorerApiBaseUrl + c.listAssests)

    if (!req.data.count) return 0

    return req.data.count
  } catch (err) {
    return 0
  }
}

export const _getNodeVersions = async () => {
  try {
    const req = await axios
      .get(server + 'api/validators/versions')

    if (!req.data) return 0

    return req.data
  } catch (err) {
    return 0
  }
}

export const _getTxApi = async (id) => {
  try {
    const req = await axios
      .get(network.explorerApiBaseUrl + c.getTxApi(id))

    if (!req.data) return ''

    return req.data
  } catch (err) {
    throw new Error(err.message)
  }
}

export const _getAssetPrice = async () => {
  try {
    const req = await axios
      .get(server + 'api/market_data')
    return req.data
  } catch (err) {
    return null
  }
}

export const _getPeerInfo = async ({ ip }) => {
  try {
    const ipRes = ip.split(':')[0]
    const req = await axios
      .post(server + 'api/node/peer', { ip: ipRes })

    if (!req.data) {
      throw new Error()
    }
    return req
  } catch (err) {
    return null
  }
}

export const _getValidator = async ({ id }) => {
  try {
    const req = await axios
      .post(server + 'api/validators', { id })

    if (!req.data) {
      throw new Error()
    }
    return req
  } catch (err) {
    return null
  }
}

export const _getAssetById = async (id) => {
  try {
    const req = await axios
      .get(network.explorerApiBaseUrl + c.assestById(id))

    if (!req.data) return

    return req.data
  } catch (err) {
    return null
  }
}

export const _getAssetsWithOffset = async (offset) => {
  try {
    const req = await axios
      .get(network.explorerApiBaseUrl + c.assetsWithOffset(offset))

    if (!req.data.assets) return

    return req.data.assets
  } catch (err) {
    return null
  }
}

export const request = async (endpoint, body) => {
  try {
    const response = await axios.post(endpoint, body)
    return response
  } catch (err) {
    console.log(err)
    return {
      data: {
        error: err
      }
    }
  }
}

export const _getCHeight = async ({ endpoint, bcID, params = [] }) => {
  axios.defaults.headers[c.cacheControlHeader] = c.cacheControlValue
  const response = await request(endpoint + c.evm(bcID), body(c.ethBlockNumber, params))
  return response
}

export const _getCNetworkVersion = async ({ endpoint, bcID, params = [] }) => {
  axios.defaults.headers[c.cacheControlHeader] = c.cacheControlValue
  const response = await request(endpoint + c.evm(bcID), body(c.ethNetVersion, params))
  return response
}

export const _getCChainID = async ({ endpoint, bcID, params = [] }) => {
  axios.defaults.headers[c.cacheControlHeader] = c.cacheControlValue
  const response = await request(endpoint + c.evm(bcID), body(c.ethChainID, params))
  return response
}

export const _getBlockchains = async ({ endpoint }) => {
  const response = await request(endpoint + c.platformBc, body(c.getBlockchains))
  return response
}

export const _getHeight = async ({ endpoint }) => {
  const response = await request(endpoint + c.platformBc, body(c.getHeight))
  return response
}

export const _getDefHeight = async () => {
  try {
    const req = await axios
      .get(server + 'api/height')
    return {
      data: {
        result: req.data
      }
    }
  } catch (err) {
    return {
      data: {
        error: err.message
      }
    }
  }
}

export const _getDefValidators = async () => {
  try {
    const req = await axios
      .get(server + 'api/validators')
    return req.data
  } catch (err) {
    return {
      error: err.message
    }
  }
}

export const _getStats = async () => {
  try {
    const req = await axios
      .get(server + 'api/validators/stats')
    return req.data
  } catch (err) {
    return {
      error: err.message
    }
  }
}

export const _getDefHealth = async () => {
  try {
    const req = await axios
      .get(server + 'api/node/health')
    return {
      data: {
        result: req.data
      }
    }
  } catch (err) {
    return {
      data: {
        error: err.message
      }
    }
  }
}

export const _getDefInfo = async () => {
  try {
    const req = await axios
      .get(server + 'api/node/info')
    return {
      data: {
        result: req.data
      }
    }
  } catch (err) {
    return {
      error: err.message
    }
  }
}

export const _getDefPeers = async () => {
  try {
    const req = await axios
      .get(server + 'api/node/peers')
    return {
      data: {
        result: req.data
      }
    }
  } catch (err) {
    return {
      error: err.message
    }
  }
}

export const _getBlockchainStatus = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platformBc, body(c.getBlockchainStatus, params))
  return response
}

export const _getSubnets = async ({ endpoint }) => {
  const response = await request(endpoint + c.platformBc, body(c.getSubnets))
  return response
}

export const _validates = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platformBc, body(c.validates, params))
  return response
}

export const _getValidators = async ({ subnetID, endpoint }) => {
  const response = await request(endpoint + c.platformBc, body(c.getCurrentValidators, { subnetID }))
  return response
}

export const _getPendingValidators = async ({ subnetID, endpoint }) => {
  const response = await request(endpoint + c.platformBc, body(c.getPendingValidators, { subnetID }))
  return response
}

export const _getUTXOs = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platformBc, body(c.getUtxos, params))
  return response
}

export const _getTxStatus = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platformBc, body(c.getTxStatus, params))
  return response
}

export const _getTX = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platformBc, body(c.getTx, params))
  return response
}

export const _getBalance = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platformBc, body(c.getBalance, params))
  return response
}

export const _getNodeId = async ({ endpoint }) => {
  const response = await request(endpoint + c.info, body(c.getNodeID))
  return response
}

export const _getTotalStake = async ({ endpoint }) => {
  const response = await request(endpoint + c.platform, body(c.getTotalStake))
  return response
}

export const _getStake = async ({ endpoint, params }) => {
  const response = await request(endpoint + c.platform, body(c.getStake, params))
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

export const _health = async ({ endpoint }) => {
  const response = await request(endpoint + c.health, body(c.getLiveness))
  return response
}

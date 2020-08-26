import Web3 from 'web3'
const abiDecoder = require('abi-decoder')

import config from './config'
import { Notify } from 'quasar'
import contractAbi from './../../builds/contract.json'

import {
  hexStringToAsciiString
} from './string-conversion'

let web3
let contract
abiDecoder.addABI(contractAbi)
const addr = config.network.address

export const _initializeNetwork = async () => {
  if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
    window.ethereum.enable()
    window.ethereum.autoRefreshOnNetworkChange = false
  }

  // web3 = new Web3(getProvider({ endpoint: `wss://${config.network.endpointCChain}` }))
  web3 = new Web3(`https://${config.network.endpointCChain}`)
  contract = await new web3.eth.Contract(contractAbi, config.network.contract)
}

// const getProvider = ({ endpoint }) => {
//   const provider = new Web3.providers.WebsocketProvider(endpoint)
//   provider.on('connect', async () => {
//     console.log('WS Connected')
//   })
//   provider.on('error', e => {
//     console.error('WS Error' + e)
//     web3.setProvider(getProvider({ endpoint }))
//   })
//   provider.on('end', e => {
//     console.error('WS End' + e)
//   })
//   return provider
// }

const getEstimatedGas = async ({ data, from }) => {
  try {
    const gas = await window
      .web3.eth
      .estimateGas({
        to: config.network.contract,
        from,
        data
      })
    return gas
  } catch (err) {
    return 500000
  }
}

const prepareTransaction = async (method, from) => {
  try {
    const data = method.encodeABI()
    const estimatedGas = await getEstimatedGas({ data, from })
    const gasPrice = await window.web3.eth.getGasPrice()

    const transactionCount =
      await window.web3.eth.getTransactionCount(from, 'pending')

    const rawTx = {
      from,
      nonce: parseInt(transactionCount),
      gasPrice: parseInt(gasPrice),
      gasLimit: parseInt(estimatedGas),
      to: config.network.contract,
      value: 0,
      data: data
    }
    return rawTx
  } catch (err) {
    console.log(err)
  }
}

/**
 * Send a method (transaction) to the network
 * @param {Object} method contract method
 * @returns {Promise<string>} transaction hash
 */
const executeMethod = async (method) => {
  const rawTx = await prepareTransaction(method, window.web3.givenProvider.selectedAddress)

  return new Promise((resolve, reject) => {
    window.web3.eth.sendTransaction(rawTx)
      .on('transactionHash', (hash) => {
        resolve(hash)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        if (confirmationNumber === 3) Notify.create('Transaction is confirmed!')
      })
      .on('error', (err) => {
        if (err.message && err.message.includes('insufficient funds')) Notify.create('Insufficient funds')
        reject(err)
      })
  })
}

export const _getValidatorById = async (id) => {
  if (!id) return

  try {
    const validator = await contract
      .methods
      .members(id)
      .call()

    return {
      name: hexStringToAsciiString(validator.name),
      avatarUrl: hexStringToAsciiString(validator.avatarUrl),
      link: hexStringToAsciiString(validator.link)
    }
  } catch (err) {
    return false
  }
}

export const getPermission = async () => {
  const result = await contract
    .methods
    .getPermissionCode()
    .call({ from: addr })

  return result
}

/**
 * Send a validator info to the contract
 * @param {Object} params parameters
 * @param {string} params.id
 * @param {string} params.name
 * @param {string} params.avatar
 * @param {string} params.link
 */
export const _setValidatorInfo = async ({ id, name, avatar, bio, link }) => {
  try {
    const account = await contract
      .methods
      .members(id)
      .call()

    const byteName = name ? stringToHex(name) : account.name
    const byteAvatar = avatar ? stringToHex(avatar) : account.avatarUrl
    const byteBio = bio ? stringToHex(bio) : account.bio
    const byteLink = link ? stringToHex(link) : account.link
    const code = await getPermission()

    const method = contract
      .methods
      .setValidatorInfo(
        id,
        byteName,
        byteAvatar,
        byteBio,
        byteLink,
        code
      )

    return executeMethod(method)
  } catch (err) {
    throw new Error(err.message)
  }
}

export const stringToHex = input => web3.utils.asciiToHex(input)

export const utf8StringToHex = input => web3.utils.utf8ToHex(input).padEnd(66, '0')

export const _subscribeToContractEvents = ({ eventName, filters, handler }) => {
  if (!contract) return
  const events = contract._jsonInterface.filter(a => a.type === 'event')
  const ev = events.find(e => e.name === eventName)
  const eventInterface = {
    ...ev
  }
  web3.eth.subscribe('logs', {
    address: config.network.contract,
    topics: [eventInterface.signature]
  }, (error, result) => {
    if (error) return handler(error)

    const event = web3.eth.abi.decodeLog(
      eventInterface.inputs,
      result.data,
      result.topics.slice(1)
    )

    // Don't call handler if data doesn't match filters
    let isMatch = false
    const filtersKeys = Object.keys(filters)
    filtersKeys.forEach(key => {
      const value = filters[`${key}`]
      if (event[`${key}`].toLowerCase() === value.toLowerCase()) isMatch = true
    })
    if (!isMatch) return

    handler(null, {
      ...event
    })
  })
}

export const _getPastEvents = async (eventName, filters = {}) => {
  try {
    const events = await contract.getPastEvents(eventName, filters)
    return events
  } catch (err) {
    console.log(err)
    return []
  }
}

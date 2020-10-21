import Web3 from 'web3'
import Tx from 'ethereumjs-tx'
const abiDecoder = require('abi-decoder')

import config from './config'
import contractAbi from './../../builds/contract.json'

import { _generateHashedCode } from './crypto.js'

import { getPrivateKeyBuffer, initializeKeys } from './keys.js'

import {
  hexStringToAsciiString
} from './string-conversion.js'

let web3
let contract
abiDecoder.addABI(contractAbi)
const admin = config.network.address

export const _initializeNetwork = async () => {
  try {
    web3 = new Web3(`https://${config.network.endpointCChain}`)
    // web3 = new Web3(getProvider({ endpoint: `wss://${config.network.endpointCChain}` }))
    contract = await new web3.eth.Contract(contractAbi, config.network.contract)
  } catch (err) {
  }
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
    const gas = await web3
      .eth
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
    const gasPrice = await web3.eth.getGasPrice()

    const transactionCount = await web3.eth.getTransactionCount(from, 'pending')

    const rawTx = {
      from,
      chainId: config.network.cChainId,
      nonce: parseInt(transactionCount),
      gasPrice: parseInt(gasPrice),
      gasLimit: parseInt(estimatedGas),
      to: config.network.contract,
      value: 0,
      data
    }

    initializeKeys()
    const tx = new Tx(rawTx)
    tx.sign(getPrivateKeyBuffer())

    return {
      serializedTransaction: '0x' + tx.serialize().toString('hex'),
      transactionHash: '0x' + tx.hash().toString('hex')
    }
  } catch (err) {
    console.log(err)
  }
}

/**
 * Send a method (transaction) to the network
 * @param {Object} method contract method
 * @returns {Promise<string>} transaction hash
 */
const executeMethod = async (method, from) => {
  const response = await prepareTransaction(method, from)
  if (!response) return
  const { serializedTransaction, transactionHash } = response
  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(serializedTransaction)
      .on('transactionHash', (hash) => {
        console.log('Transaction hash' + hash)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        if (confirmationNumber === 1) {
          resolve(transactionHash)
          console.log('Transaction is confirmed! ' + transactionHash)
        }
      })
      .on('error', (err) => {
        if (err.message && err.message.includes('insufficient funds')) {
          console.log('Insufficient funds')
        } else if (err.message.includes('Transaction has been reverted by the EVM:')) {
          console.log(err)
          reject(new Error('Transaction Error! Possible reasons: the name is taken. if you don\'t change the name, remove it from the field or enter a new name.'))
        }
        console.log(err)
        reject(err)
      })
  })
}

export const _getValidatorById = async (id) => {
  if (!id) return
  try {
    const hexID = hexNodeID(id)
    const validator = await contract
      .methods
      .members(hexID)
      .call()

    return {
      name: hexStringToAsciiString(validator.name ? validator.name : ''),
      website: hexStringToAsciiString(validator.website ? validator.website : ''),
      avatarUrl: hexStringToAsciiString(validator.avatar ? validator.avatar : ''),
      bio: hexStringToAsciiString(validator.bio ? validator.bio : ''),
      link: hexStringToAsciiString(validator.link ? validator.link : '')
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

export const _isValidCode = async (code, nodeID) => {
  const data = _encode(code, nodeID)
  try {
    const isValidCode = await contract
      .methods
      .isValidCode(data)
      .call()

    return isValidCode
  } catch (err) {
    return false
  }
}

/**
 * Send a validator info to the contract
 * @param {Object} params parameters
 * @param {string} params.nodeID
 * @param {string} params.website
 * @param {string} params.name
 * @param {string} params.avatar
 * @param {string} params.bio
 * @param {string} params.link
 */

export const _setValidatorInfo = async ({ nodeID, name, website, avatar, bio, link }) => {
  try {
    const hexID = hexNodeID(nodeID)

    const account = await contract
      .methods
      .members(hexID)
      .call()

    const accountN = account.name ? account.name : stringToHex('')
    const accountW = account.website ? account.website : stringToHex('')
    const accountA = account.avatar ? account.avatar : stringToHex('')
    const accountB = account.bio ? account.bio : stringToHex('')
    const accountL = account.link ? account.link : stringToHex('')

    const byteName = name ? stringToHex(name) : accountN
    const byteWebsite = website ? stringToHex(website) : accountW
    const byteAvatar = avatar ? stringToHex(avatar) : accountA
    const byteBio = bio ? stringToHex(bio) : accountB
    const byteLink = link ? stringToHex(link) : accountL

    const method = contract
      .methods
      .setValidatorInfo(
        hexID,
        byteName,
        byteWebsite,
        byteAvatar,
        byteBio,
        byteLink
      )

    return executeMethod(method, admin)
  } catch (err) {
    throw new Error(err.message)
  }
}

/**
 * Send a verify code
 * @param {Object} params parameters
 * @param {string} params.code
 * @param {string} params.nodeID
 */

export const _setVerifyCode = async ({ code, nodeID }) => {
  try {
    const data = _encode(code, nodeID)
    if (!data) return
    const method = contract
      .methods
      .setPermissionCode(data)

    return executeMethod(method, admin)
  } catch (err) {
    throw new Error(err.message)
  }
}

export const hexNodeID = (id) => web3.eth.abi.encodeParameter('bytes32', stringToHex(id.substr(15)))
export const stringToHex = input => web3.utils.asciiToHex(input)

export const getBlockNumber = () => web3.eth.getBlockNumber()

export const _encode = (a, b) => {
  if (!a || !b) return
  const hash = _generateHashedCode(a, b)
  return web3.eth.abi.encodeParameter('bytes32', '0x' + hash)
}

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

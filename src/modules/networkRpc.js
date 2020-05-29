import Web3 from 'web3'
import Tx from 'ethereumjs-tx'
const abiDecoder = require('abi-decoder')
import contractAbi from './../../builds/contract.json'

import {
  hexStringToAsciiString,
  hexStringToUtf8String
} from './string-conversion'
  

let web3
let contract
abiDecoder.addABI(contractAbi)

export const initializeNetwork = async () => {
  web3 = new Web3(getProvider({ endpoint: `wss://${store.getters.endpoint.address}` }))
  contract = await new web3.eth.Contract(contractAbi, config.network.contract)
}
  
const getProvider = ({ endpoint }) => {
  const provider = new Web3.providers.WebsocketProvider(endpoint)
  provider.on('connect', async () => {
    console.log('WS Connected')
  })
  provider.on('error', e => {
    console.error('WS Error' + e)
    web3.setProvider(getProvider({ endpoint }))
  })
  provider.on('end', e => {
    console.error('WS End' + e)
    web3.setProvider(getProvider({ endpoint }))
  })
  return provider
}

const getEstimatedGas = async ({ data, from }) => {
  try {
    let gas = await web3.eth.estimateGas({ to: contract, from, data })
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
      chainId: config.network.chainId,
      nonce: parseInt(transactionCount),
      gasPrice: parseInt(gasPrice),
      gasLimit: parseInt(estimatedGas),
      to: contract,
      value: 0,
      data: data
    }

    const tx = new Tx(rawTx)
    tx.sign(getPrivateKeyBuffer())

    return {
      serializedTransaction: '0x' + tx.serialize().toString('hex'),
      transactionHash: '0x' + tx.hash().toString('hex')
    }
  } catch (err) {
    const provider = new Web3.providers.WebsocketProvider(`wss://${store.getters.endpoint.address}`)
    web3.setProvider(provider)
    prepareTransaction(method, from)
  }
}

/**
 * Send a method (transaction) to the network
 * @param {Object} method contract method
 * @returns {Promise<string>} transaction hash
 */
const executeMethod = async (method) => {
  const { serializedTransaction, transactionHash } = await prepareTransaction(method)
  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(serializedTransaction)
      .on('transactionHash', (hash) => {
        debug('Transaction hash %s', hash)
        resolve(hash)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log(transactionHash)
      })
      .on('error', (err) => {
        if (err.message && err.message.includes('insufficient funds')) Notify.create('Insufficient funds')
        console.error('Send transaction error', err)
        reject(err)
      })
  })
}

export const getChatPastEvents = async (eventName, filters = {}) => {
  try {
    let events = await contract.getPastEvents(eventName, filters)
    return events
  } catch (err) {
    return []
  }
}

export const getValidatorById = async (id) => {
  if (!id) return
  
  let hexId = utf8StringToHex(id)
  const validator = await contract
    .methods
    .getValidatorById(hexId)
    .call()

  const name = hexStringToUtf8String(validator.name)
  let avatarUrl = ''
  let link = ''

  if (validator.avatarUrl) {
    avatarUrl = hexStringToAsciiString(validator.avatarUrl)
  }

  if (validator.link) {
    link = hexStringToAsciiString(validator.link)
  }
  
    return {
      id,
      name,
      avatarUrl,
      link
    }
}

/**
 * Send a validator update to the contract
 * @param {Object} params parameters
 * @param {string} params.id
 * @param {string} params.name
 * @param {string} params.avatar
 * @param {string} params.link
 */
export const updateProfileOnContract = async ({ id, name, avatar, link }) => {
  let hexId = utf8StringToHex(id)
  let hexName = utf8StringToHex(name)
  const method = contract.methods.updateProfile(hexId, hexName, avatar, link)
  return executeMethod(method, config.network.contract)
}

export const stringToHex = input => web3.utils.asciiToHex(input)

export const utf8StringToHex = input => web3.utils.utf8ToHex(input).padEnd(66, '0')

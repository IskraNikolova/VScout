import Web3 from 'web3'
const abiDecoder = require('abi-decoder')
import contractAbi from './../../builds/contract.json'
import config from './config'
import { Notify } from 'quasar'

import {
  hexStringToAsciiString
} from './string-conversion'

let web3
let contract
abiDecoder.addABI(contractAbi)
const addr = config.network.address

export const _initializeNetwork = async () => {
  const ethEnabled = () => {
    if (window.web3) {
      web3 = window.web3 = new Web3(window.web3.currentProvider)
      window.ethereum.enable()
      window.ethereum.autoRefreshOnNetworkChange = false
      return true
    }
    return false
  }

  if (!ethEnabled()) {
    Notify('Please install MetaMask to use this dApp!')
  }

  contract = await new web3.eth.Contract(contractAbi, config.network.contract)
}

const getEstimatedGas = async ({ data, from }) => {
  try {
    const gas = await web3.eth.estimateGas({ to: config.network.contract, from, data })
    return gas
  } catch (err) {
    console.log(err)
    return 500000
  }
}

const prepareTransaction = async (method, from) => {
  try {
    const data = method.encodeABI()
    const estimatedGas = await getEstimatedGas({ data, from })
    const gasPrice = await web3.eth.getGasPrice()

    const transactionCount =
      await web3.eth.getTransactionCount(from, 'pending')

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
  const rawTx = await prepareTransaction(method, web3.givenProvider.selectedAddress)
  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction(rawTx)
      .on('transactionHash', (hash) => {
        resolve(hash)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log(confirmationNumber)
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
    const events = await contract.getPastEvents(eventName, filters)
    return events
  } catch (err) {
    return []
  }
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
export const _setValidatorInfo = async ({ id, name, avatar, link }) => {
  const byteName = stringToHex(name)
  const byteAvatar = stringToHex(avatar)
  const byteLink = stringToHex(link)
  const code = await getPermission()
  console.log(code)
  const method = contract.methods.setValidatorInfo(id, byteName, byteAvatar, byteLink, code)
  return executeMethod(method)
}

export const stringToHex = input => web3.utils.asciiToHex(input)

export const utf8StringToHex = input => web3.utils.utf8ToHex(input).padEnd(66, '0')

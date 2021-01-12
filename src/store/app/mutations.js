const BigNumber = require('bignumber.js')

import { VMDict } from './../../utils/constants.js'
import { clean } from './../../utils/commons.js'

import {
  SET_THEME,
  GET_IN_OUT,
  GET_NODE_ID,
  GET_SUBNETS,
  SET_BALANCE,
  SET_SUBNET_ID,
  GET_NODE_INFO,
  GET_NODE_PEERS,
  GET_AVAX_PRICE,
  GET_INFO_PEERS,
  SET_STAKED_AVAX,
  GET_BLOCKCHAINS,
  UPDATE_VALIDATOR,
  SET_IS_INIT_APP,
  GET_NODE_VERSIONS,
  SET_CURRENT_CURRENCY,
  SET_DEFAULT_VALIDATORS
} from './types'

const mutations = {
  [GET_IN_OUT]: (state, { incomingVal, incomingDel, outcomingVal, outcomingDel }) => {
    let result = {
      // 24 hours
      incomingValidatorsHours: 0,
      incomingDelegationsHours: 0,
      outcomingValidatorsHours: 0,
      outcomingDelegationsHours: 0,
      incomingStakeHours: 0,
      outcomingStakeHours: 0,
      // 7 days
      incomingValidatorsDays: 0,
      incomingDelegationsDays: 0,
      outcomingValidatorsDays: 0,
      outcomingDelegationsDays: 0,
      incomingStakeDays: 0,
      outcomingStakeDays: 0,
      // month
      incomingValidatorsMonth: 0,
      incomingDelegationsMonth: 0,
      outcomingValidatorsMonth: 0,
      outcomingDelegationsMonth: 0,
      incomingStakeMonth: 0,
      outcomingStakeMonth: 0
    }
    try {
      // hours
      let incomingStakeHours = new BigNumber(incomingVal.hours.stake)
      incomingStakeHours = BigNumber
        .sum(incomingStakeHours, incomingDel.hours.stake)

      let outcomingStakeHours = new BigNumber(outcomingVal.hours.stake)
      outcomingStakeHours = BigNumber
        .sum(outcomingStakeHours, outcomingDel.hours.stake)

      const incomingValidatorsHours = incomingVal.hours.validators
      const outcomingValidatorsHours = outcomingVal.hours.validators
      const incomingDelegationsHours = incomingDel.hours.delegations
      const outcomingDelegationsHours = outcomingDel.hours.delegations

      // days
      let incomingStakeDays = new BigNumber(incomingVal.days.stake)
      incomingStakeDays = BigNumber
        .sum(incomingStakeDays, incomingDel.days.stake)

      let outcomingStakeDays = new BigNumber(outcomingVal.days.stake)
      outcomingStakeDays = BigNumber
        .sum(outcomingStakeDays, outcomingDel.days.stake)

      const incomingValidatorsDays = incomingVal.days.validators
      const outcomingValidatorsDays = outcomingVal.days.validators
      const incomingDelegationsDays = incomingDel.days.delegations
      const outcomingDelegationsDays = outcomingDel.days.delegations

      // month
      let incomingStakeMonth = new BigNumber(incomingVal.month.stake)
      incomingStakeMonth = BigNumber
        .sum(incomingStakeMonth, incomingDel.month.stake)

      let outcomingStakeMonth = new BigNumber(outcomingVal.month.stake)
      outcomingStakeMonth = BigNumber
        .sum(outcomingStakeMonth, outcomingDel.month.stake)

      const incomingValidatorsMonth = incomingVal.month.validators
      const outcomingValidatorsMonth = outcomingVal.month.validators
      const incomingDelegationsMonth = incomingDel.month.delegations
      const outcomingDelegationsMonth = outcomingDel.month.delegations

      result = {
        incomingValidatorsHours,
        outcomingValidatorsHours,
        incomingDelegationsHours,
        outcomingDelegationsHours,
        incomingStakeHours,
        outcomingStakeHours,
        incomingValidatorsDays,
        outcomingValidatorsDays,
        incomingDelegationsDays,
        outcomingDelegationsDays,
        incomingStakeDays,
        outcomingStakeDays,
        incomingValidatorsMonth,
        outcomingValidatorsMonth,
        incomingDelegationsMonth,
        outcomingDelegationsMonth,
        incomingStakeMonth,
        outcomingStakeMonth
      }
    } catch (err) {
      console.error(err)
    }

    state.inData = result
  },
  [SET_CURRENT_CURRENCY]: (state, { currentCurrency }) => {
    state.currentCurrency = currentCurrency
  },
  [SET_IS_INIT_APP]: (state, { isInit }) => {
    state.isInit = isInit
  },
  [GET_AVAX_PRICE]: (state, { avaxPrice }) => {
    const currentPrice = avaxPrice.current_price
    const high24h = avaxPrice.high_24h
    const low24h = avaxPrice.low_24h
    state.currenciesPriceList = currentPrice
    state.high_24h = high24h
    state.low_24h = low24h
    state.price_change_24h = avaxPrice.price_change_24h_in_currency
    state.price_change_24h_percentage = avaxPrice.price_change_percentage_24h_in_currency
  },
  [GET_NODE_VERSIONS]: (state, { nodesVersions }) => {
    state.nodesVersions = nodesVersions
  },
  [SET_THEME]: (state, { themeName }) => {
    state.theme = themeName
  },
  [GET_NODE_ID]: (state, { nodeID }) => {
    state.nodeID = nodeID
  },
  [GET_SUBNETS]: (state, { subnets }) => {
    state.subnets = subnets
  },
  [SET_BALANCE]: (state, { addressBalance }) => {
    state.addressBalance = addressBalance
  },
  [GET_NODE_INFO]: (state, { nodeInfo }) => {
    state.nodeInfo = nodeInfo
  },
  [GET_NODE_PEERS]: (state, { peers }) => {
    state.peers = peers
  },
  [GET_INFO_PEERS]: (state, { peersMap }) => {
    state.peersMap = peersMap
  },
  [UPDATE_VALIDATOR]: (state, { validator }) => {
    const validators = state.defaultValidators
    if (!validators) return
    const currentValidator = validators
      .find(val => val.nodeID.includes(validator.nodeID))
    if (!currentValidator) return
    const newVal = clean(validator)
    const index = state.validators.indexOf(currentValidator)
    if (index < 0) return
    state.validators[index] = { ...currentValidator, ...newVal }
  },
  [SET_STAKED_AVAX]: (state, { all, validatedStake, delegatedStake }) => {
    state.stakedAVAX = all
    state.validatedStake = validatedStake
    state.delegatedStake = delegatedStake
  },
  [GET_BLOCKCHAINS]: (state, { blockchains }) => {
    blockchains = blockchains.map(b => {
      b.vmName = VMDict[b.vmID].name
      b.vmDocumentation = VMDict[b.vmID].documentation
      return b
    })
    state.blockchains = blockchains
  },
  [SET_SUBNET_ID]: (state, { subnetID }) => {
    state.subnetID = subnetID
  },
  [SET_DEFAULT_VALIDATORS]: (state, { defaultValidators }) => {
    state.defaultValidators = defaultValidators
  }
}

export default mutations

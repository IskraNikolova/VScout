const axios = require('axios')
  .default
const fs = require('fs')
const BigNumber = require('bignumber.js')

const utils = require('../utils.js')

let id = 1
axios.defaults.headers['Content-Type'] = 'application/json'

const body = (method) => {
  return {
    jsonrpc: '2.0',
    method,
    params : {},
    id: id++
  }
}

module.exports = {
  // POST
  validators: async (endpoint) => {
    try {
      const resVal = await axios
        .post(endpoint + '/ext/P', body('platform.getCurrentValidators'))
      if (resVal.data.error) {
        // const error = resVal.data.error
        // const data = JSON.stringify(error)
        // fs.writeFileSync('logs.json', data)
      }
      const apiValidators = resVal.data.result

      const resPVal = await axios
        .post(endpoint + '/ext/P', body('platform.getPendingValidators'))
      if (resPVal.data.error) {
        // const error = resPVal.data.error
        // const data = JSON.stringify(error)
        // fs.writeFileSync('logs.json', data)
      }
      const pendingValidators = resPVal.data.result

      let peersInJson = fs.readFileSync('peers.json').toString()

      if (!peersInJson) peersInJson = {}
      const peers = JSON.parse(peersInJson)

      const {
        allStake,
        validators,
        validatedStake,
        potentialReward,
        delegatedStake
      } = utils.mapValidators(apiValidators.validators, peers.peers)

      const response = {
        allStake,
        validators,
        pendingValidators,
        validatedStake,
        delegatedStake
      }

      let currentSupply = new BigNumber(0)
      const resCSupply = await axios
        .post(endpoint + '/ext/P', body('platform.getCurrentSupply'))

      if (!resCSupply.data.error) {
        const s = resCSupply.data.result.supply ? resCSupply.data.result.supply : 0
        currentSupply = BigNumber(s)
      }

      const totalSupply = currentSupply.minus(potentialReward)

      const supply = JSON.stringify({
        currentSupply: currentSupply.toString(),
        totalSupply: totalSupply.toString()
      })
      fs.writeFileSync('supply.json', supply)

      const data = JSON.stringify(response)
      fs.writeFileSync('validators.json', data)
      
      const statResponse = utils.getStakingStats(apiValidators.validators)
      const stat = JSON.stringify(statResponse)
      fs.writeFileSync('stakeStat.json', stat)
    } catch (err) {
      console.log(err)
      // const data = JSON.stringify(err)
      // fs.writeFileSync('logs.json', data)
    }
  },
  validator: (req, res) => {
    const id = req.body.id
    fs.readFile('validators.json', (err, data) => {
      if (err) {
        res.status(400).send(err)
        res.end()
      }
      try {
        const validators = JSON.parse(data).validators
        const validator = validators.find(v => v.nodeID === id)
        res.status(200).send(validator)
        res.end()
      } catch (err) {
        res.status(400).send(err)
        res.end()
      }
    })
  },
  // GET
  staking: (req, res) => {
    fs.readFile('validators.json', (err, data) => {
      if (err) {
        res.status(400).send(err)
        res.end()
      }
      try {
        const validators = JSON.parse(data)
        res.status(200).send(validators)
        res.end()
      } catch (err) {
        res.status(400).send(err)
        res.end()
      }
    })
  },
  nodeVersions: async (req, res) => {
    try {
      const result = await axios
        .get('https://explorerapi.avax.network/validators')
      res.status(200).send(result.data)
      res.end()
    } catch (err) {
      res.status(400).send(err)
      res.end()
    }
  },
  stats: (req, res) => {
    fs.readFile('stakeStat.json', (err, data) => {
      if (err) {
        res.status(400).send(err)
        res.end()
      }
      try {
        const stats = JSON.parse(data)
        res.status(200).send(stats)
        res.end()
      } catch (err) {
        res.status(400).send(err)
        res.end()
      }
    })
  },
  baseUrl: () => {
    return '/api/validators'
  }
}

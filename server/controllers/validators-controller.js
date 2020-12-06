const axios = require('axios')
  .default
const fs = require('fs')

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
        const error = resVal.data.error
        const data = JSON.stringify(error)
        fs.writeFileSync('logs.json', data)
      }
      const apiValidators = resVal.data.result

      const resPVal = await axios
        .post(endpoint + '/ext/P', body('platform.getPendingValidators'))
      if (resPVal.data.error) {
        const error = resPVal.data.error
        const data = JSON.stringify(error)
        fs.writeFileSync('logs.json', data)
      }
      const pendingValidators = resPVal.data.result
      const {
        allStake,
        validators,
        delegators,
        validatedStake,
        delegatedStake
      } = utils.mapValidators(apiValidators.validators)

      const response = {
        allStake,
        validators: {
          validators,
          delegators
        },
        pendingValidators,
        validatedStake,
        delegatedStake
      }
      const data = JSON.stringify(response)
      fs.writeFileSync('validators.json', data)
      
      const statResponse = utils.getStakingStats(apiValidators.validators)
      const stat = JSON.stringify(statResponse)
      fs.writeFileSync('stakeStat.json', stat)
    } catch (err) {
      console.log(err)
      const data = JSON.stringify(err)
      fs.writeFileSync('logs.json', data)
    }
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

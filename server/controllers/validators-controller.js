const fs = require('fs')
const axios = require('axios')
  .default
const utils = require('../utils.js')
const BigNumber = require('bignumber.js')

const P_CHAIN_ENDPOINT = '/ext/bc/P'

let id = 1
axios.defaults.headers['Content-Type'] = 'application/json'

const body = (method) => {
  return {
    jsonrpc: '2.0',
    method,
    params: {},
    id: id++
  }
}

module.exports = {
  // POST
  validators: async (endpoint) => {
    try {
      const resVal = await axios
        .post(endpoint + P_CHAIN_ENDPOINT, body('platform.getCurrentValidators'))
      const apiValidators = resVal.data.result

      const resPVal = await axios
        .post(endpoint + P_CHAIN_ENDPOINT, body('platform.getPendingValidators'))
      const pendingValidators = resPVal.data.result

      let peersInJson = fs.readFileSync('peers.json')
        .toString()

      if (!peersInJson) peersInJson = {}
      const peers = JSON.parse(peersInJson)

      const {
        allStake,
        validators,
        validatedStake,
        potentialReward,
        delegatorsMap,
        delegatedStake
      } = utils.mapValidatorsUpdate(apiValidators.validators, peers.peers)

      const delegators = JSON.stringify(delegatorsMap)
      fs.writeFileSync('delegators.json', delegators)

      let currentSupply = new BigNumber(0)
      const resCSupply = await axios
        .post(endpoint + P_CHAIN_ENDPOINT, body('platform.getCurrentSupply'))

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

      const statResponse = utils.getStakingStats(validators)
      const stat = JSON.stringify(statResponse)
      fs.writeFileSync('stakeStat.json', stat)
      const response = {
        allStake,
        validators,
        pendingValidators,
        validatedStake,
        delegatedStake,
        delegatorsMap
      }

      const data = JSON.stringify(response)
      fs.writeFileSync('validators.json', data)
    } catch (err) {
      console.log(err)
      // const data = JSON.stringify(err)
      // fs.writeFileSync('logs.json', data)
    }
  },
  validator: async (req, res) => {
    const id = req.body.id
    try {
      const data = await fs.readFileSync('validators.json').toString()
      const validators = JSON.parse(data).validators
      const validator = validators.find(v => v.nodeID === id)
      if (validator) {
        const delegations = await fs.readFileSync('delegators.json').toString()
        validator['delegators'] = (JSON.parse(delegations))[`${id}`]

        res.status(200).send(validator)
        res.end()
      }
    } catch (err) {
      console.log(err)
      res.status(400).send(err)
      res.end()
    }
  },
  // GET
  getUptimeByNodeID: (req, res) => {
    const nodeID = req.body.nodeID
    fs.readFile('uptime.json', (err, data) => {
      if (err) {
        res.status(400).send(err)
        res.end()
      }
      try {
        const uptimes = JSON.parse(data)
        const result = uptimes[nodeID]
        res.status(200).send(result)
        res.end()
      } catch (err) {
        res.status(400).send(err)
        res.end()
      }
    })
  },
  getUptimes: async (observers) => {
    try {
      let length = 0
      if (observers) length = observers.length

      let validatorsJ = fs
        .readFileSync('validators.json')
        .toString()

      validatorsJ = JSON.parse(validatorsJ)
        .validators

      const uptimes = new Object ()
      for (let i = 0; i < length; i++) {
        try {
          const endpoint = observers[i]
            .endpoint

          const cV = validatorsJ
            .find(v => v.nodeID === observers[i].nodeID)
          if (cV) {
            const response = await axios
              .post(endpoint + P_CHAIN_ENDPOINT, body('platform.getCurrentValidators'))

            if (response.data.error) {
              const obsArray = observers.filter(o => o.nodeID !== observers[i].nodeID)
              fs.writeFileSync(
                'observers.json',
                JSON.stringify({ observers: obsArray })
              )
              continue
            }

            const { validators } = response.data.result

            validators.forEach(v => {
              const obj = {
                endpoint,
                uptime: v.uptime,
                observer: observers[i].nodeID
              }

              if (!uptimes[v.nodeID]) uptimes[v.nodeID] = []
              uptimes[v.nodeID].push(obj)
            })
          }
        } catch (err) {
          const obsArray = observers.filter(o => o.nodeID !== observers[i].nodeID)
          fs.writeFileSync(
            'observers.json',
            JSON.stringify({ observers: obsArray })
          )
        }
      }

      if (Object.keys(uptimes).length === 0 && uptimes.constructor === Object) return

      const u = JSON.stringify(uptimes)
      fs.writeFileSync('uptime.json', u)
    } catch (err) {
      console.log(err)
    }
  },
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
  delegations: (req, res) => {
    fs.readFile('delegators.json', (err, data) => {
      if (err) {
        res.status(400).send(err)
        res.end()
      }
      try {
        const delegators = JSON.parse(data)
        res.status(200).send(delegators)
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
        .get('https://peerinfo.avax.network/peerinfo')
      res.status(200).send(result.data)
      res.end()
    } catch (err) {
      res.status(400).send(err)
      res.end()
    }
  },
  stats: (req, res) => {
    try {
      fs.readFile('stakeStat.json', (err, data) => {
        if (err) {
          res.status(400).send(err)
        } else {
          const stakeStat = JSON.parse(data.toString())
          res.status(200).send(stakeStat)
        }
      })
    } catch (err) {
      res.status(400).send(err)
    }
  },
  baseUrl: () => {
    return '/api/validators'
  }
}

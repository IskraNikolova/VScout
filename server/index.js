const env = process.env.NODE_ENV || 'development'
const controllers = require('./controllers')
const { setObserervers, getObserversArray, getEndpoints } = require('./utils')
const fs = require('fs')

const config = require('./config/config')[env]

const app = require('express')()

require('./config/express')(app)

require('./config/routes')(app)

app.listen(config.port, () => console.log(`Server start on port ${config.port}`))

// const endpoint = 'http://135.181.144.201:9650'
const endpoint = 'http://62.210.89.225:9650' // 'http://18.116.253.54:9650' // 'http://142.132.197.144:9650' 'http://18.141.218.134:9650'

// let endpoints = getEndpoints()

// let i = 0
setInterval(() => {
  // const endpoint = endpoints[i]
  try {
    controllers.avax.avaxPrice()
    controllers.platform.blockHeight(endpoint)
    controllers.validators.validators(endpoint)
    controllers.node.peersPost(endpoint)
    controllers.node.info(endpoint)
  } catch (err) {
    console.log(err)
  }
  // i = (index++) % endpoints.length
  // if (i >= endpoints.length) {
  //   endpoints = getEndpoints()
  //   i = 0
  // } else {
  //   i++
  // }
}, 70000)

let index = 1
let inProcess = false

let obs = getObserversArray()
// setObserervers(index, obs)
controllers.validators.getUptimes(obs)
let peers = fs
  .readFileSync('peers.json')
  .toString()

peers = JSON.parse(peers)
  .peers

setInterval(async () => {
  obs = getObserversArray()

  if (obs.length < 33) {
    try {
      if (!inProcess) {
        inProcess = true

        index = (index + 1) % peers.length
        await setObserervers(index, obs)
        inProcess = false
      }
    } catch (err) {
      console.log(err)
    }
  }
}, 8000)

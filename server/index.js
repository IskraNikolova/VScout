const env = process.env.NODE_ENV || 'development'
const controllers = require('./controllers')
const { setObserervers, getObserversArray, getEndpoints } = require('./utils')
const fs = require('fs')

const config = require('./config/config')[env]

let app = require('express')()

require('./config/express')(app)

require('./config/routes')(app)

app.listen(config.port, () => console.log(`Server start on port ${config.port}`))

// const endpoint = 'http://135.181.144.201:9650'
const endpoint =  'http://108.61.246.143:9650'

// let endpoints = getEndpoints()

// let i = 0
setInterval(() => {
  // const endpoint = endpoints[i]
  controllers.avax.avaxPrice()
  controllers.platform.blockHeight(endpoint)
  controllers.validators.validators(endpoint)
  controllers.node.info(endpoint)
  controllers.node.peersPost(endpoint)
  // i = (index++) % endpoints.length
  // if (i >= endpoints.length) {
  //   endpoints = getEndpoints()
  //   i = 0
  // } else {
  //   i++
  // }
}, 70000)

let index = 500
let inProcess = false

let obs = getObserversArray()
// setObserervers(index, obs)
controllers.validators.getUptimes(obs)

setInterval(() => {
  try {
    let validators = fs
      .readFileSync('validators.json')
      .toString()

    validators = JSON.parse(validators)
      .validators

    obs = getObserversArray()
    controllers.validators.getUptimes(obs)

    if (!inProcess) {
      inProcess = true
      setObserervers(index, obs)
      index = (index + 10) % validators.length
      inProcess = false
    }
  } catch (err) {
    console.log(err)
  }
}, 100000)

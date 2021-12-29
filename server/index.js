const env = process.env.NODE_ENV || 'development'
const controllers = require('./controllers')
const { setObserervers, getObserversArray } = require('./utils')
const fs = require('fs')

const config = require('./config/config')[env]

let app = require('express')()

require('./config/express')(app)

require('./config/routes')(app)

app.listen(config.port, () => console.log(`Server start on port ${config.port}`))

setInterval(() => {
  controllers.avax.avaxPrice()
}, 8000)

const endpoint = 'http://135.181.144.201:9650'

setInterval(() => {
  controllers.platform.blockHeight(endpoint)
  controllers.validators.validators(endpoint)
  controllers.node.info(endpoint)
  controllers.node.peersPost(endpoint)
}, 30000)

let index = 600
let inProcess = false

let obs = getObserversArray()
controllers.validators.getUptimes(obs)

// setTimeout(async () => {
//   let obs = await getObserversArray()
//   controllers.validators.getUptimes(obs)
// }, 10)

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

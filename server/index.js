const env = process.env.NODE_ENV || 'development'
const controllers = require('./controllers')
const { setObserervers, getObserversArray, getEndpoints } = require('./utils')
const fs = require('fs')

const config = require('./config/config')[env]

let app = require('express')()

require('./config/express')(app)

require('./config/routes')(app)

app.listen(config.port, () => console.log(`Server start on port ${config.port}`))

setInterval(() => {
  controllers.avax.avaxPrice()
}, 8000)

//const endpoint = 'http://135.181.144.201:9650'

const endpoints = getEndpoints()
// [
//   "http://165.173.18.156:9650",
//   "http://176.31.46.82:9650",                                                                                
//   "http://159.223.20.105:9650",
//   "http://95.217.30.65:9650",
//   "http://52.29.68.225:9650",
//   "http://45.79.106.211:9650",
// "http://34.221.201.229:9650",
// "http://3.237.24.223:9650",
// "http://3.71.10.60:9650",
// "http://161.97.135.216:9650",
// "http://216.128.178.236:9650",
// "http://192.248.176.62:9650",
// "http://15.228.60.175:9650",
// "http:/173.249.43.37:9650",
// "http://95.216.102.220:9650",
// "http://129.213.160.219:9650",
// "http://51.91.29.9:9650",
// "http://3.65.232.148:9650",
// "http://3.71.10.60:9650",
// "http://54.93.65.56:9650",
// "http://3.124.4.29:9650",
// "http://168.119.226.163:9650",
// "http://3.237.24.223:9650"
// ]

let i = 0
setInterval(() => {
  const endpoint = endpoints[i]
  controllers.platform.blockHeight(endpoint)
  controllers.validators.validators(endpoint)
  controllers.node.info(endpoint)
  controllers.node.peersPost(endpoint)
  
  if (i >= endpoints.length) {
    endpoints = getEndpoints()
    i = 0
  } else {
    i = (i + 1) % endpoints.length
  }
}, 30000)

let index = 400
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

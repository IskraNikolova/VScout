const env = process.env.NODE_ENV || 'development'
const controllers = require('./controllers')

const config = require('./config/config')[env]

let app = require('express')()
require('./config/express')(app)

require('./config/routes')(app)

app.listen(config.port, () => console.log(`Server start on port ${config.port}`))

const endpoints = [
  'https://api.avax.network:443',
  'https://vscout.io/vscout-api'
]
let index = 0
let endpoint = endpoints[index]

setInterval(() => {
  controllers.avax.avaxPrice()
}, 8000)

setInterval(() => {
  index = 1 // (index + 1) % 2
  endpoint = endpoints[index]
  controllers.platform.blockHeight(endpoint)
  controllers.validators.validators(endpoint)
  controllers.node.info(endpoint)
  controllers.node.peersPost(endpoint)
}, 20000)

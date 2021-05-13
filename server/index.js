const env = process.env.NODE_ENV || 'development'
const controllers = require('./controllers')

const config = require('./config/config')[env]

let app = require('express')()
require('./config/express')(app)

require('./config/routes')(app)

app.listen(config.port, () => console.log(`Server start on port ${config.port}`))

setInterval(() => {
  controllers.avax.avaxPrice()
}, 8000)

const endpoint = 'http://135.181.93.94:9650'

setInterval(() => {
  controllers.platform.blockHeight(endpoint)
  controllers.validators.validators(endpoint)
  controllers.node.info(endpoint)
  controllers.node.peersPost(endpoint)
}, 30000)

let index = 0
setInterval(() => {
  try {
    controllers.validators.getUptimes(index)
    const { validators } = require('validators.json')
    index = (index + 10) % validators.length
  } catch (err) {
  }
}, 400000)

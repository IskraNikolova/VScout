const controllers = require('../controllers')

module.exports = app => {
  app.get(controllers.validators.baseUrl(), controllers.validators.staking)
  app.get(controllers.node.baseUrl() + '/info', controllers.node.nodeInfo)
  app.get(controllers.platform.baseUrl(), controllers.platform.height)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found')
    res.end()
  })
}
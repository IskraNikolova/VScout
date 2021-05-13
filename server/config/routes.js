const controllers = require('../controllers')

module.exports = app => {
  app.get(controllers.platform.baseUrl(), controllers.platform.height)
  app.get(controllers.validators.baseUrl(), controllers.validators.staking)
  app.get(controllers.validators.baseUrl() + '/delegators', controllers.validators.delegations)
  app.post(controllers.validators.baseUrl() , controllers.validators.validator)
  app.get(controllers.validators.baseUrl() + '/stats', controllers.validators.stats)
  app.post(controllers.validators.baseUrl() + '/uptime', controllers.validators.getUptimeByNodeID)
  app.get(controllers.validators.baseUrl() + '/versions', controllers.validators.nodeVersions)
  app.get(controllers.node.baseUrl() + '/info', controllers.node.nodeInfo)
  app.get(controllers.node.baseUrl() + '/peers', controllers.node.peers)
  app.post(controllers.node.baseUrl() + '/peer', controllers.node.peer)
  app.get(controllers.avax.baseUrl(), controllers.avax.marketData)
  app.get(controllers.avax.baseUrl() + '/supply', controllers.avax.supply)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found')
    res.end()
  })
}
const controllers = require('../controllers')

module.exports = app => {
  app.get(controllers.platform.baseUrl(), controllers.platform.height)
  app.get(controllers.validators.baseUrl(), controllers.validators.staking)
  app.get(controllers.node.baseUrl() + '/info', controllers.node.nodeInfo)
  app.get(controllers.node.baseUrl() + '/peers', controllers.node.peers)
  app.post(controllers.node.baseUrl() + '/peer', controllers.node.peer)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found')
    res.end()
  })
}
const cors = require('cors')
const bodyParser = require('body-parser')

module.exports = app => {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://vscout.io", "http://localhost:8080")
    next()
  })
  app.use(bodyParser.json())
  app.use(cors())
}

const axios = require('axios').default
const fs = require('fs')

let id = 1
axios.defaults.headers['Content-Type'] = 'application/json'

const body = () => {
  return {
    jsonrpc: '2.0',
    method: 'platform.getHeight',
    params : {},
    id: id++
  }
}

module.exports = {
  // POST
  blockHeight: (endpoint) => {
    axios.post(endpoint + '/ext/P', body())
      .then((res) => {
        if (res.data.error) {
          console.log(res)
          // const error = res.data.error
          // const data = JSON.stringify(error)
          // fs.writeFileSync('logs.json', data)
        } else {
          const data = res.data.result
          console.log(data)
          const validators = JSON.stringify(data)
          fs.writeFileSync('height.json', validators)
        }
      })
      .catch((err) => {
        console.log(err)
        // const data = JSON.stringify(err)
        // fs.writeFileSync('logs.json', data)
      })
  },
  // GET
  height: (req, res) => {
    fs.readFile('height.json', (err, data) => {
      if (err) {
        res.status(400).send(err)
        res.end()
        console.log(err)
      }
      try {
        const height = JSON.parse(data)
        console.log(height)
        res.status(200).send(height)
        res.end()
      } catch (err) {
        console.log(err)
        res.status(400).send(err)
        res.end()
      }
    })
  },
  baseUrl: () => {
    return '/api/height'
  }
}

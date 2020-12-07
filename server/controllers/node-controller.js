const axios = require('axios').default
const fs = require('fs')

let id = 1
axios.defaults.headers['Content-Type'] = 'application/json'

const body = (method) => {
  return {
    jsonrpc: '2.0',
    method,
    id: id++
  }
}

module.exports = {
  // POST
  info: async (endpoint) => {
    try {
        const resH = await axios
          .post(endpoint + '/ext/health', body('health.getLiveness'))
        if (resH.data.error) {
          throw new Error(resH.data.error)
        }
        const health = resH.data.result
        const res2 = await axios
          .post(endpoint + '/ext/info', body('info.getNetworkID'))
        if (res2.data.error) {
          throw new Error(res2.data.error)
        }
        const networkID = res2.data.result.networkID
        const res3 = await axios
          .post(endpoint + '/ext/info', body('info.getNetworkName'))
        if (res3.data.error) {
          throw new Error(res3.data.error)
        }
        const networkName = res3.data.result.networkName
        const res4 = await axios
          .post(endpoint + '/ext/info', body('info.getNodeVersion'))
        if (res4.data.error) {
          throw new Error(res4.data.error)
        }
        const version = res4.data.result.version
        const data = {
          health,
          networkID,
          networkName,
          version
        }
        const info = JSON.stringify(data)
        fs.writeFileSync('node-info.json', info)
    } catch (err) {
      console.log(err)
      const data = JSON.stringify(err)
      fs.writeFileSync('logs.json', data)
    }
  },
  peersPost: async (endpoint) => {
    try {
        const resP = await axios
          .post(endpoint + '/ext/info', body('info.peers'))
        if (resP.data.error) {
          throw new Error(resP.data.error)
        }
        const peersResponse = resP.data.result
        const p = peersResponse.peers
        console.log(p)
        let newPeers = []
        let peersInJson = fs.readFileSync('ips.json').toString()
        if (!peersInJson) peersInJson = {}
        const json = JSON.parse(peersInJson)
        for (let i = 0; i < p.length; i++) {
          try {
            const ip = p[i].ip.split(':')[0]
            if (!ip) return
            const currentPeer = json[`${ip}`]
            if(!currentPeer) {
              // Api call
              let response = {}
              try {
                response = await axios
                  .get('https://api.ipgeolocationapi.com/geolocate/' + ip)

                const info = response.data
                if (!info) info = {
                  alpha2: '',
                  continent: '',
                  name: ''
                }
                // add to json
                json[`${ip}`] = {
                  countryCode: info.alpha2,
                  continent: info.continent,
                  country: info.name
                }
                // add to new peers
                newPeers.push({
                  ...p[i],
                  countryCode: info.alpha2,
                  continent: info.continent,
                  country: info.name
                })
              }
              catch (err) {
              }
            } else {
              newPeers.push({
                ...p[i],
                countryCode: currentPeer.countryCode,
                continent: currentPeer.continent,
                country: currentPeer.country
              })
            }
          } catch (err) {
            console.log(err)
          }
        }
        // write to json
        fs.writeFileSync('ips.json', JSON.stringify(json))

        const peers = {
          numPeers: peersResponse.numPeers,
          peers: newPeers
        }
        newPeers = []

        const info = JSON.stringify(peers)
        fs.writeFileSync('peers.json', info)
    } catch (err) {
      console.log(err)
      const data = JSON.stringify(err)
      fs.writeFileSync('logs.json', data)
    }
  },
  peer: async (req, res) => {
    const ip = req.body.ip
    if (!ip) {
      res.status(400).send(err)
      res.end()
    }
    try {
      let peersInJson = fs.readFileSync('peers.json').toString()
      if (!peersInJson) peersInJson = {}
      const json = JSON.parse(peersInJson)
      const result = json[`${ip}`]
      if (!result) {
        throw new Error()
      }
      res.status(200).send(result)
      res.end()
    } catch (err) {
      try {
        const response = await axios
          .get('https://api.ipgeolocationapi.com/geolocate/' + ip)
        if (!response.data) {
          throw new Error('Empty response')
        }
        const result = {
          countryCode: response.data.alpha2,
          continent: response.data.continent,
          country: response.data.name
        }
        res.status(200).send(result)
        res.end()
      } catch (err) {
        res.status(400).send(err)
        res.end()
      }
    }
  },
  // GET
  nodeInfo: (req, res) => {
    fs.readFile('node-info.json', (err, data) => {
      if (err) {
        res.status(400).send(err)
        res.end()
      }
      try {
        const info = JSON.parse(data)
        res.status(200).send(info)
        res.end()
      } catch (err) {
        res.status(400).send(err)
        res.end()
      }
    })
  },
  peers: (req, res) => {
    fs.readFile('peers.json', (err, data) => {
      if (err) {
        res.status(400).send(err)
        res.end()
      }
      try {
        const info = JSON.parse(data)
        res.status(200).send(info)
        res.end()
      } catch (err) {
        res.status(400).send(err)
        res.end()
      }
    })
  },
  baseUrl: () => {
    return '/api/node'
  }
}

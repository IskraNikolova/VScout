const axios = require('axios').default
require('dotenv').config()
const KEY = process.env.KEY
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
          .post(endpoint + '/ext/health', body('health.health'))
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
        const res5 = await axios
          .post(endpoint + '/ext/info', body('info.getNodeID'))
        if (res5.data.error) {
          throw new Error(res4.data.error)
        }
        const nodeID = res5.data.result.nodeID
        const data = {
          health,
          networkID,
          networkName,
          version,
          nodeID
        }
        const info = JSON.stringify(data)
        fs.writeFileSync('node-info.json', info)
    } catch (err) {
      console.log(err)
      // const data = JSON.stringify(err)
      // fs.writeFileSync('logs.json', data)
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
        let newPeers = []
        let peersInJson = fs.readFileSync('ips.json').toString()
        if (!peersInJson) peersInJson = {}
        const json = JSON.parse(peersInJson)
        for (let i = 0; i < p.length; i++) {
          try {
            const ip = p[i].ip.split(':')[0]
            if (!ip) return
            const currentPeer = json[`${ip}`]
            if(!currentPeer || !currentPeer.countryCode) {
            // Api call
            let response = {}
            try {
              response = await axios
                .get(`https://api.ipgeolocation.io/ipgeo?apiKey=${KEY}&ip=${ip}`)
              const info = response.data
              if (!info) info = {
                'country_code2': '',
                'continent_name': '',
                'country_name': '',
                isp: ''
              }
              // add to json
              json[`${ip}`] = {
                countryCode: info['country_code2'],
                continent: info['continent_name'],
                country: info['country_name'],
                isp: info.isp
              }
              // add to new peers
              newPeers.push({
                ...p[i],
                countryCode: info['country_code2'],
                continent: info['continent_name'],
                country: info['country_name'],
                isp: info.isp
              })
            }
            catch (err) {
              newPeers.push({
                ...p[i],
                countryCode: '',
                continent: '',
                country: '',
                isp: ''
              })
            }
            } else {
              newPeers.push({
                ...p[i],
                countryCode: currentPeer.countryCode,
                continent: currentPeer.continent,
                country: currentPeer.country,
                isp: currentPeer.isp
              })
            }
          } catch (err) {
            console.log(err)
          }
        }

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
      // const data = JSON.stringify(err)
      // fs.writeFileSync('logs.json', data)
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
        .get(`https://api.ipgeolocation.io/ipgeo?apiKey=${KEY}&ip=${ip}`)
        if (!response.data) {
          throw new Error('Empty response')
        }
        const result = {
          countryCode: response.data['country_code2'],
          continent: response.data['continent_name'],
          country: response.data['country_name'],
          isp: response.data.isp
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

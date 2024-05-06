const axios = require('axios').default
require('dotenv').config()
const fs = require('fs')

const KEY = process.env.KEY
const INFO_ENDPOINT = '/ext/info'
const HEALTH_ENDPOINT = '/ext/health'
const COUNTRY_CODE = 'country_code2'
const CONTINENT_NAME = 'continent_name'
const COUNTRY_NAME = 'country_name'

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
        .post(endpoint + HEALTH_ENDPOINT, body('health.health'))
      if (resH.data.error) {
        throw new Error(resH.data.error)
      }
      const health = resH.data.result
      const res2 = await axios
        .post(endpoint + INFO_ENDPOINT, body('info.getNetworkID'))
      if (res2.data.error) {
        throw new Error(res2.data.error)
      }
      const networkID = res2.data.result.networkID
      const res3 = await axios
        .post(endpoint + INFO_ENDPOINT, body('info.getNetworkName'))
      if (res3.data.error) {
        throw new Error(res3.data.error)
      }
      const networkName = res3.data.result.networkName
      const res4 = await axios
        .post(endpoint + INFO_ENDPOINT, body('info.getNodeVersion'))
      if (res4.data.error) {
        throw new Error(res4.data.error)
      }
      const version = res4.data.result.version
      const res5 = await axios
        .post(endpoint + INFO_ENDPOINT, body('info.getNodeID'))
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
      let ipsList = fs
        .readFileSync('ips.json')
        .toString()

      if (!ipsList) ipsList = {}
      const ips = JSON.parse(ipsList)

      const resP = await axios
        .post(endpoint + INFO_ENDPOINT, body('info.peers'))

      if (resP.data.error) {
        throw new Error(resP.data.error)
      }

      const peersResponse = resP.data.result
      const p = peersResponse.peers

      const newPeers = []
      for (let i = 0; i < p.length; i++) {
        try {
          const regex = /\d+\.\d+\.\d+\.\d+:\d+/g
          const found = p[i].ip.match(regex)
          if (!found) return

          const ip = p[i].ip.split(':')[0]
          if (!ip) return

          const currentPeer = ips[`${ip}`]
          if (!currentPeer || !currentPeer.countryCode) {
            // Api call
            try {
              const response = await axios
                .get(`https://api.ipgeolocation.io/ipgeo?apiKey=${KEY}&ip=${ip}`)
              let info = response.data
              if (!info) {
                info = {
                  'country_code2': '',
                  'continent_name': '',
                  'country_name': ''
                }
              }

              // add to json
              ips[`${ip}`] = {
                countryCode: info[COUNTRY_CODE],
                continent: info[CONTINENT_NAME],
                country: info[COUNTRY_NAME]
              }

              fs.writeFileSync('ips.json', JSON.stringify(ips))
              // add to new peers
              newPeers.push({
                ip: p[i].ip,
                nodeID: p[i].nodeID,
                version: p[i].version,
                lastSent: p[i].lastSent,
                lastReceived: p[i].lastReceived,
                countryCode: info[COUNTRY_CODE],
                continent: info[CONTINENT_NAME],
                country: info[COUNTRY_NAME]
              })
              const peers = JSON.stringify({
                numPeers: peersResponse.numPeers,
                peers: newPeers
              })
              fs.writeFileSync('peers.json', peers)
            } catch (err) {
              console.log(err)
              newPeers.push({
                ip: p[i].ip,
                nodeID: p[i].nodeID,
                version: p[i].version,
                lastSent: p[i].lastSent,
                lastReceived: p[i].lastReceived,
                countryCode: '',
                continent: '',
                country: ''
              })
              const peers = JSON.stringify({
                numPeers: peersResponse.numPeers,
                peers: newPeers
              })
              fs.writeFileSync('peers.json', peers)
            }
          } else {
            newPeers.push({
              ip: p[i].ip,
              nodeID: p[i].nodeID,
              version: p[i].version,
              lastSent: p[i].lastSent,
              lastReceived: p[i].lastReceived,
              countryCode: currentPeer.countryCode,
              continent: currentPeer.continent,
              country: currentPeer.country
            })
            const peers = JSON.stringify({
              numPeers: peersResponse.numPeers,
              peers: newPeers
            })
            fs.writeFileSync('peers.json', peers)
          }
        } catch (err) {
          console.log(err)
        }
      }
    } catch (err) {
      console.log(err)
      // const data = JSON.stringify(err)
      // fs.writeFileSync('logs.json', data)
    }
  },
  peer: async (req, res) => {
    const ip = req.body.ip
    if (!ip) {
      res.status(400).send('ERROR: IP is undefined')
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
        const regex = /\d+\.\d+\.\d+\.\d+:\d+/g
        const found = ip.match(regex)
        if (!found) {
          throw new Error('Empty response')
        }

        const response = await axios
          .get(`https://api.ipgeolocation.io/ipgeo?apiKey=${KEY}&ip=${ip}`)
        if (!response.data) {
          throw new Error('Empty response')
        }

        const result = {
          countryCode: response.data[COUNTRY_CODE],
          continent: response.data[CONTINENT_NAME],
          country: response.data[COUNTRY_NAME]
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

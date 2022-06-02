const axios = require('axios').default
const fs = require('fs')

module.exports = {
  // POST
  avaxPrice: () => {
    axios.get('https://api.coingecko.com/api/v3/coins/avalanche-2')
      .then((req) => {
        if (!req.data) {
          throw new Error()
        }
        const data = req.data.market_data
        console.log(data)
        const marketData = JSON.stringify(data)
        fs.writeFileSync('price.json', marketData)
      })
      .catch((err) => {
        // const data = JSON.stringify(err)
        // fs.writeFileSync('logs.json', data)
      })
  },
  // GET
  marketData: (req, res) => {
    fs.readFile('price.json', (err, data) => {
      if (err) {
        res.status(400).send(err)
        res.end()
      }
      try {
        const price = JSON.parse(data)
        res.status(200).send(price)
        res.end()
      } catch (err) {
        res.status(400).send(err)
        res.end()
      }
    })
  },
  supply: (req, res) => {
    fs.readFile('supply.json', (err, data) => {
      if (err) {
        res.status(400).send(err)
        res.end()
      }
      try {
        const supply = JSON.parse(data)
        res.status(200).send(supply)
        res.end()
      } catch (err) {
        res.status(400).send(err)
        res.end()
      }
    })
  },
  baseUrl: () => {
    return '/api/market_data'
  }
}

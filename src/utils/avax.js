const BigNumber = require('bignumber.js')

export function getAvaFromnAva (v) {
  return parseFloat(v) / 10 ** 9
}

export function getPriceFromnAvax (v, d) {
  const avax = getAvaFromnAva(v)
  const avaxBG = new BigNumber(avax)
  const multuply = new BigNumber(d)

  const usd = avaxBG.multipliedBy(multuply)
  return usd.toNumber()
}

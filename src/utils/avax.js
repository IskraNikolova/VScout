const BigNumber = require('bignumber.js')

export function getAvaFromnAva (v) {
  const value = new BigNumber(v)
  const result = value.dividedBy(10 ** 9)
  return result.toNumber()
}

export function getPriceFromnAvax (v, d) {
  const avax = getAvaFromnAva(v)
  const avaxBG = new BigNumber(avax)
  const multuply = new BigNumber(d)

  const usd = avaxBG.multipliedBy(multuply)
  return usd.toNumber()
}

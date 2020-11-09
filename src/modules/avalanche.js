import { Avalanche } from 'avalanche'

const { network } = require('./config')
  .default

export const pChain = () => {
  try {
    const avax = new Avalanche(
      network.ip,
      network.port,
      network.protocol,
      network.networkId,
      network.chainId
    )

    return avax.PChain()
  } catch (err) {
    console.log(err)
  }
}

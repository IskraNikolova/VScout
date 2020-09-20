import { Avalanche } from 'avalanche'
const { network } = require('./config')
  .default

const avax = new Avalanche(
  network.ip,
  network.port,
  network.protocol,
  network.networkId,
  network.chainId
)

export const pChain = avax.PChain()

import { Avalanche } from 'avalanche'
const { network } = require('./config')
  .default

export const pChain = (networkEndpoint, networkID) => {
  try {
    const avax = new Avalanche(
      network.ip,
      network.port,
      network.protocol,
      network.networkId,
      network.chainId
    )

    return avax.PChain()
    // const protocol = networkEndpoint
    //   .url
    //   .split('/')[0]
    //   .split(':')[0]

    // const endpoint = networkEndpoint
    //   .url
    //   .split('/')[2]

    // const ip = endpoint.split(':')[0]
    // let port = endpoint.split(':')[1]
    // if (!port) port = ''

    // const avax = new Avalanche(
    //   ip,
    //   port,
    //   protocol,
    //   networkID,
    //   network.chainId
    // )
    // return avax.PChain()
  } catch (err) {
    const avax = new Avalanche(
      network.ip,
      network.port,
      network.protocol,
      network.networkId,
      network.chainId
    )

    return avax.PChain()
  }
}

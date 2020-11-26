import { Avalanche, BinTools } from 'avalanche'
import { KeyPair } from 'avalanche/dist/apis/avm'
import { getPreferredHRP } from 'avalanche/dist/utils/helperfunctions'

const bintools = BinTools.getInstance()

const crypto = require('crypto')

const { network } = require('./config')
  .default

const avax = new Avalanche(
  network.ip,
  network.port,
  network.protocol,
  network.networkId,
  network.chainId
)

export const pChain = () => {
  return avax.PChain()
}

export const verify = (message, signature) => {
  const msgBuff = Buffer.from(message, 'utf8')
  const digest = crypto.createHash('sha256').update(msgBuff).digest()
  const digestBuff = Buffer.from(digest.toString('hex'), 'hex')

  const networkId = avax.getNetworkID()
  const hrp = getPreferredHRP(networkId)
  const keypair = new KeyPair(hrp, 'X')
  const signedBuff = Buffer.from(signature, 'hex')
  const pubKey = keypair.recover(digestBuff, signedBuff)
  const addressBuff = keypair.addressFromPublicKey(pubKey)
  const address = bintools.addressToString(hrp, 'X', addressBuff)
  return address
}

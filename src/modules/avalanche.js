import { Avalanche, BinTools } from 'avalanche'
import { KeyPair } from 'avalanche/dist/apis/avm'
import { getPreferredHRP } from 'avalanche/dist/utils/helperfunctions'

const bintools = BinTools.getInstance()

import createHash from 'create-hash'

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
  const mBuf = Buffer.from(message, 'utf8')
  const msgSize = Buffer.alloc(4)
  msgSize.writeUInt32BE(mBuf.length, 0)
  const msgBuff = Buffer.from(
      `\x1AAvalanche Signed Message:\n${msgSize}${message}`,
      'utf8'
  )
  const digest = createHash('sha256').update(msgBuff).digest()
  const digestBuff = Buffer.from(digest.toString('hex'), 'hex')

  const networkId = avax.getNetworkID()
  const hrp = getPreferredHRP(networkId)
  const keypair = new KeyPair(hrp, 'X')
  const signedBuff = bintools.cb58Decode(signature)
  const pubKey = keypair.recover(digestBuff, signedBuff)
  const addressBuff = keypair.addressFromPublicKey(pubKey)
  const address = bintools.addressToString(hrp, 'X', addressBuff)
  return address
}

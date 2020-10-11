const privateKeyHex = process.env.ADMIN_KEY

import Wallet from 'ethereumjs-wallet'

export let walletAccount

export const initializeKeys = () => {
  if (isWalletInitialized()) return

  const privateKeyBuffer = Buffer.from(privateKeyHex.replace('0x', ''), 'hex')
  walletAccount = Wallet.fromPrivateKey(privateKeyBuffer)
}

export const isWalletInitialized = () => Boolean(walletAccount)
export const getPrivateKeyBuffer = () => walletAccount.getPrivateKey()

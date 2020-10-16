const crypto = require('crypto')

export const _generateHashedCode = (nodeID, secret) => {
  const hash = crypto.createHmac('sha256', secret)
    .update(nodeID)
    .digest('hex')
  return hash
}

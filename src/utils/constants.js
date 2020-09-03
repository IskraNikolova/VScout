export const c = {
  // enpoints
  cChainWs: 'ext/C/ws',
  listAssests: 'x/assets',
  assestById: (id) => `x/assets/${id}`,
  assetsWithOffset: (offset) => `x/assets?&offset=${offset}&limit=100`,
  platform: 'ext/P',
  platformBc: 'ext/bc/P',
  avm: 'ext/bc/X',
  admin: 'ext/admin',
  info: 'ext/info',
  health: 'ext/health',

  // methods
  getBlock: 'timestamp.getBlock',
  getNodeID: 'info.getNodeID',
  getNetworkID: 'info.getNetworkID',
  getNetworkName: 'info.getNetworkName',
  getNodeVersion: 'info.getNodeVersion',
  peers: 'info.peers',
  validates: 'platform.validates',
  getSubnets: 'platform.getSubnets',
  getLiveness: 'health.getLiveness',
  getBlockchains: 'platform.getBlockchains',
  getBlockchainStatus: 'platform.getBlockchainStatus',
  getCurrentValidators: 'platform.getCurrentValidators',
  getPendingValidators: 'platform.getPendingValidators',

  jsonrpc: '2.0',
  contentTypeValue: 'application/json',
  contentTypeHeader: 'content-type'
}

export const VMDict = {
  '': {
    name: 'platformvm',
    documentation: 'https://docs.avax.network/v1.0/en/api/platform/'
  },
  jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq: {
    name: 'avm',
    documentation: 'https://docs.avax.network/v1.0/en/api/avm/'
  },
  mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6: {
    name: 'evm',
    documentation: 'https://docs.avax.network/v1.0/en/api/evm/'
  },
  tGas3T58KzdjLHhBDMnH2TvrddhqTji5iZAMZ3RXs2NLpSnhH: {
    name: 'timestampvm',
    documentation: 'https://docs.avax.network/v1.0/en/api/timestamp/'
  },
  sqjchUjzDqDfBPGjfQq2tXW1UCwZTyvzAWHsNzF2cb1eVHt6w: {
    name: 'spchainvm',
    documentation: 'https://docs.avax.network/v1.0/en/core-concepts/overview/#what-are-virtual-machines'
  },
  sqjdyTKUSrQs1YmKDTUbdUhdstSdtRTGRbUn8sqK8B6pkZkz1: {
    name: 'spdagvm',
    documentation: 'https://docs.avax.network/v1.0/en/core-concepts/overview/#what-are-virtual-machines'
  }
}

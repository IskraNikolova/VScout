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
  getHeight: 'platform.getHeight',
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

//  Denominations of value
export const NanoAvax = 1
export const MicroAvax = 1000 * NanoAvax
export const Schmeckle = 49 * MicroAvax + 463 * NanoAvax
export const MilliAvax = 1000 * MicroAvax
export const Avax = 1000 * MilliAvax
export const KiloAvax = 1000 * Avax
export const MegaAvax = 1000 * KiloAvax

// SupplyCap is the maximum amount of AVAX that should ever exist
export const SupplyCap = 720 * MegaAvax

// MaxSubMinConsumptionRate is the % consumption that incentivizes staking
export const maxSubMinConsumptionRate = 20000 // 2%

// MinConsumptionRate is the minimum % consumption of the remaining tokens
// to be minted
export const minConsumptionRate = 100000 // 10%
export const PercentDenominator = 1000000

// MinimumStakingDuration is the shortest amount of time a staker can bond
// their funds for.
// MinimumStakingDuration = 24 * time.Hour

// MaximumStakingDuration is the longest amount of time a staker can bond
// their funds for.
// MaximumStakingDuration = 365 * 24 * time.Hour

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

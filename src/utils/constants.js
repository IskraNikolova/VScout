export const c = {
  // enpoints
  cChainWs: 'ext/C/ws',
  tx: 'x/transactions',
  listAssests: 'x/assets',
  timestamp: 'ext/bc/timestamp',
  platform: 'ext/P',
  platformBc: 'ext/bc/P',
  keystore: 'ext/keystore',
  avm: 'ext/bc/X',
  admin: 'ext/admin',
  info: 'ext/info',
  health: 'ext/health',
  getLast: '?sort=timestamp-desc&limit=1',
  aggregates: (s, e) => `/aggregates?startTime=${s}&endTime=${e}`,
  aggregatesWInt: (s, e, intervalSize = '1s') => `/aggregates?startTime=${s}&endTime=${e}&intervalSize=${intervalSize}`,

  // methods
  getBlock: 'timestamp.getBlock',
  createUser: 'keystore.createUser',
  getTxStatus: 'avm.getTxStatus',
  exportAVA: 'avm.exportAVA',
  createAddress: 'avm.createAddress',
  getNodeID: 'info.getNodeID',
  getNetworkID: 'info.getNetworkID',
  getNetworkName: 'info.getNetworkName',
  getNodeVersion: 'info.getNodeVersion',
  peers: 'info.peers',
  sign: 'platform.sign',
  issueTx: 'platform.issueTx',
  validates: 'platform.validates',
  getSubnets: 'platform.getSubnets',
  getLiveness: 'health.getLiveness',
  importAVA: 'platform.importAVA',
  getAccount: 'platform.getAccount',
  listAccounts: 'platform.listAccounts',
  createAccount: 'platform.createAccount',
  getBlockchains: 'platform.getBlockchains',
  getCurrentValidators: 'platform.getCurrentValidators',
  getPendingValidators: 'platform.getPendingValidators',
  addDefaultSubnetDelegator: 'platform.addDefaultSubnetDelegator',
  addDefaultSubnetValidator: 'platform.addDefaultSubnetValidator',

  jsonrpc: '2.0',
  contentTypeValue: 'application/json',
  contentTypeHeader: 'content-type'
}

export const temp = {
  minute: {
    sub: { value: 30, label: 'minute' },
    interval: { value: 60, label: 's' },
    label: '60 seconds'
  },
  hourTwo: {
    sub: { value: 2, label: 'hour' },
    interval: { value: 5, label: 'm' },
    label: '5 minutes'
  },
  day: {
    sub: { value: 1, label: 'day' },
    interval: { value: '', label: 'hour' },
    label: '1 hour'
  },
  week: {
    sub: { value: 7, label: 'days' },
    interval: { value: '', label: 'day' },
    label: '24 hours'
  },
  month: {
    sub: { value: 1, label: 'months' },
    interval: { value: '', label: 'day' },
    label: '1 day'
  },
  year: {
    sub: { value: 1, label: 'years' },
    interval: { value: '', label: 'month' },
    label: '1 month'
  }
}

export const c = {
  // enpoints
  tx: 'x/transactions',
  listAssests: 'x/assets',
  timestamp: 'ext/bc/timestamp',
  platform: 'ext/P',
  platformBc: 'ext/bc/P',
  keystore: 'ext/keystore',
  avm: 'ext/bc/X',
  admin: 'ext/admin',
  getLast: '?sort=timestamp-desc&limit=1',
  aggregates: (s, e) => `/aggregates?startTime=${s}&endTime=${e}`,
  aggregatesWInt: (s, e, intervalSize = '1s') => `/aggregates?startTime=${s}&endTime=${e}&intervalSize=${intervalSize}`,

  // methods
  getBlock: 'timestamp.getBlock',
  createUser: 'keystore.createUser',
  getTxStatus: 'avm.getTxStatus',
  exportAVA: 'avm.exportAVA',
  createAddress: 'avm.createAddress',
  getNodeID: 'admin.getNodeID',
  sign: 'platform.sign',
  issueTx: 'platform.issueTx',
  importAVA: 'platform.importAVA',
  getAccount: 'platform.getAccount',
  listAccounts: 'platform.listAccounts',
  createAccount: 'platform.createAccount',
  getBlockchains: 'platform.getBlockchains',
  getCurrentValidators: 'platform.getCurrentValidators',
  getPendingValidators: 'platform.getPendingValidators',
  addDefaultSubnetValidator: 'platform.addDefaultSubnetValidator',

  jsonrpc: '2.0',
  contentTypeValue: 'application/json',
  contentTypeHeader: 'content-type'
}

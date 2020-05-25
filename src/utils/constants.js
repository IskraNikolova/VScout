export const c = {
  // enpoints
  tx: 'x/transactions',
  listAssests: 'x/assets',
  timestamp: 'ext/bc/timestamp',
  platform: 'ext/P',

  // methods
  getBlock: 'timestamp.getBlock',
  getBlockchains: 'platform.getBlockchains',
  getCurrentValidators: 'platform.getCurrentValidators',
  getPendingValidators: 'platform.getPendingValidators',
  getLast: '?sort=timestamp-desc&limit=1',
  aggregates: (s, e) => `/aggregates?startTime=${s}&endTime=${e}`,
  aggregatesWInt: (s, e, intervalSize = '1s') => `/aggregates?startTime=${s}&endTime=${e}&intervalSize=${intervalSize}`,
  jsonrpc: '2.0',
  contentTypeValue: 'application/json',
  contentTypeHeader: 'content-type'
}

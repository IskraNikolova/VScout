export const c = {
  // enpoints
  cChainWs: 'ext/C/ws',
  listAssests: 'x/assets',
  nodeVersions: 'validators',
  getTxApi: (id) => `x/transactions/${id}`,
  assestById: (id) => `x/assets/${id}`,
  assetsWithOffset: (offset) => `x/assets?offset=${offset}&limit=100`,

  // INFO API
  info: 'ext/info',
  getNodeID: 'info.getNodeID',
  getNetworkID: 'info.getNetworkID',
  getNetworkName: 'info.getNetworkName',
  getNodeVersion: 'info.getNodeVersion',
  peers: 'info.peers',

  // HEALTH API
  health: 'ext/health',
  getLiveness: 'health.getLiveness',

  // EVM API
  evm: (id) => `ext/bc/${id}/rpc`,
  ethBlockNumber: 'eth_blockNumber',
  ethChainID: 'eth_chainId',
  ethNetVersion: 'net_version',

  // PLATFORM API
  platform: 'ext/P',
  platformBc: 'ext/bc/P',
  getTx: 'platform.getTx',
  getUtxos: 'platform.getUTXOs',
  validates: 'platform.validates',
  getHeight: 'platform.getHeight',
  getSubnets: 'platform.getSubnets',
  getTxStatus: 'platform.getTxStatus',
  getBalance: 'platform.getBalance',
  getTotalStake: 'platform.getTotalStake',
  getStake: 'platform.getStake',
  getBlockchains: 'platform.getBlockchains',
  getBlockchainStatus: 'platform.getBlockchainStatus',
  getCurrentValidators: 'platform.getCurrentValidators',
  getPendingValidators: 'platform.getPendingValidators',
  getCurrentSupply: 'platform.getCurrentSupply',

  jsonrpc: '2.0',
  contentTypeValue: 'application/json',
  contentTypeHeader: 'content-type',
  cacheControlValue: 'no-cache',
  cacheControlHeader: 'cache-control'
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

// MaximumStakingDuration is the longest amount of time a staker can bond
// their funds for.
export const maximumStakingDuration = 365 * 24 * 60

// Stake duration
export const stakeDuration = (stakeTime) => stakeTime * 24 * 60

export const GENEZIS_ID = 'FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z'

// messages
export const successTxHash = (txHash) => `Transaction hash is ${txHash}. Your transaction is being broadcasted to the blockchain! Please hold on!`
export const errorNodeID = 'Something Wrong! Check if your connection endpoint is healthy and synced with the network OR non-existent validator!'

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

export const currencies = {
  aed: { symbol: 'د.إ', currency: 'United Arab Emirates dirham', isoCode: 'AED' },
  ars: { symbol: 'AR$', currency: 'Argentine peso', isoCode: 'ARS' },
  aud: { symbol: 'AU$', currency: 'Australian dollar', isoCode: 'AUD' },
  bch: { symbol: 'BCH', currency: 'Bitcoin Cash', isoCode: 'BCH' },
  bdt: { symbol: '৳', currency: 'Bangladeshi taka', isoCode: 'BDT' },
  bhd: { symbol: '.د.ب', currency: 'Bahraini dinar', isoCode: 'BHD' },
  bmd: { symbol: 'BM$', currency: 'Bermudian dollar', isoCode: 'BMD' },
  bnb: { symbol: 'BNB', currency: 'Binance Coin', isoCode: 'BNB' },
  brl: { symbol: 'R$', currency: 'Brazilian real', isoCode: 'BRL' },
  btc: { symbol: 'BTC', currency: 'Bitcoin', isoCode: 'BTC' },
  cad: { symbol: 'CA$', currency: 'Canadian dollar', isoCode: 'CAD' },
  chf: { symbol: 'Fr.', currency: 'Swiss franc', isoCode: 'CHF' },
  clp: { symbol: 'CL$', currency: 'Chilean peso', isoCode: 'CLP' },
  cny: { symbol: '¥', currency: 'Chinese yuan', isoCode: 'CNY' },
  czk: { symbol: 'Kč', currency: 'Czech koruna', isoCode: 'CZK' },
  dkk: { symbol: 'kr', currency: 'Danish krone', isoCode: 'DKK' },
  dot: { symbol: 'DOT', currency: 'Polkadot', isoCode: 'DOT' },
  eos: { symbol: 'EOS', currency: 'EOS', isoCode: 'EOS' },
  eth: { symbol: 'ETH', currency: 'Ethereum', isoCode: 'ETH' },
  eur: { symbol: '€', currency: 'Euro', isoCode: 'EUR' },
  gbp: { symbol: '£', currency: 'British pound', isoCode: 'GBP' },
  hkd: { symbol: 'HK$', currency: 'Hong Kong dollar', isoCode: 'HKD' },
  huf: { symbol: 'Ft', currency: 'Hungarian forint', isoCode: 'HUF' },
  idr: { symbol: 'Rp', currency: 'Indonesian rupiah', isoCode: 'IDR' },
  ils: { symbol: '₪', currency: 'Israeli new shekel', isoCode: 'ILS' },
  inr: { symbol: '₹', currency: 'Indian rupee', isoCode: 'INR' },
  jpy: { symbol: '¥', currency: 'Japanese yen', isoCode: 'JPY' },
  krw: { symbol: '₩', currency: 'South Korean won', isoCode: 'KRW' },
  kwd: { symbol: 'د.ك', currency: 'Kuwaiti dinar', isoCode: 'KWD' },
  link: { symbol: 'LINK', currency: 'Chainlink', isoCode: 'LINK' },
  lkr: { symbol: 'Rs', currency: 'Sri Lankan rupee', isoCode: 'LKR' },
  ltc: { symbol: 'LTC', currency: 'Litecoin', isoCode: 'LTC' },
  mmk: { symbol: 'Ks', currency: 'Burmese kyat', isoCode: 'MMK' },
  mxn: { symbol: 'MX$', currency: 'Mexican peso', isoCode: 'MXN' },
  myr: { symbol: 'RM', currency: 'Malaysian ringgit', isoCode: 'MYR' },
  ngn: { symbol: '₦', currency: 'Nigerian naira', isoCode: 'NGN' },
  nok: { symbol: 'kr', currency: 'Norwegian krone', isoCode: 'NOK' },
  nzd: { symbol: 'NZ$', currency: 'New Zealand dollar', isoCode: 'NZD' },
  php: { symbol: '₱', currency: 'Philippine peso', isoCode: 'PHP' },
  pkr: { symbol: '₨', currency: 'Pakistani rupee', isoCode: 'PKR' },
  pln: { symbol: 'zł', currency: 'Polish złoty', isoCode: 'PLN' },
  rub: { symbol: '₽', currency: 'Russian ruble', isoCode: 'RUB' },
  sar: { symbol: '﷼', currency: 'Saudi riyal', isoCode: 'SAR' },
  sek: { symbol: 'kr', currency: 'Swedish krona', isoCode: 'SEK' },
  sgd: { symbol: 'SG$', currency: 'Singapore dollar', isoCode: 'SGD' },
  thb: { symbol: '฿', currency: 'Thai baht', isoCode: 'THB' },
  try: { symbol: '₺', currency: 'Turkish lira', isoCode: 'TRY' },
  twd: { symbol: 'TW$', currency: 'New Taiwan dollar', isoCode: 'TWD' },
  uah: { symbol: '₴', currency: 'Ukrainian hryvnia', isoCode: 'UAH' },
  usd: { symbol: 'US$', currency: 'United States dollar', isoCode: 'USD' },
  vef: { symbol: 'VEF', currency: 'VEF', isoCode: 'VEF' },
  vnd: { symbol: '₫', currency: 'Vietnamese đồng', isoCode: 'VND' },
  xag: { symbol: 'XAG', currency: 'Xrpalike Gene', isoCode: 'XAG' },
  xau: { symbol: 'XAU', currency: 'Xaucoin', isoCode: 'XAU' },
  xdr: { symbol: 'XDR', currency: 'Xandereum', isoCode: 'XDR' },
  xlm: { symbol: 'XLM', currency: 'Stellar', isoCode: 'XLM' },
  xrp: { symbol: 'XRP', currency: 'XRP', isoCode: 'XRP' },
  yfi: { symbol: 'YFI', currency: 'Yearn.finance', isoCode: 'YFI' },
  zar: { symbol: 'R', currency: 'South African rand', isoCode: 'ZAR' }
}

export const labelColors = {
  offline: '#e6e6e6',
  'avalanche/1.6.0': '#eebf8a',
  'avalanche/1.6.1': '#8BEEC9',
  'avalanche/1.6.2': '#94F7B2',
  'avalanche/1.6.3': '#93E3D5',
  'avalanche/1.6.4': '#e3d8eb',
  'avalanche/1.6.5': '#31696b',
  'avalanche/1.7.0': '#a263c7',
  'avalanche/1.7.1': '#ffffff',
  'avalanche/1.7.2': '#c7f0e9',
  'avalanche/1.7.3': '#e3dff0',
  'avalanche/1.7.4': '#8BEEC9',
  'avalanche/1.7.5': '#94F7B2',
  'avalanche/1.7.6': '#31696b',
  'avalanche/1.7.7': '#93E3D5',
  'avalanche/1.7.8': '#e3d8eb',
  'avalanche/1.7.9': '#ffffff',
  'avalanche/1.7.10': '#eebf8a',
  'avalanche/1.7.11': '#a263c7',
  'avalanche/1.7.12': '#fafbff',
  'avalanche/1.7.13': '#94F7B2',
  'avalanche/1.8.0': '#31696b'
}

export const versionNum = {
  offline: 0,
  'avalanche/1.6.0': 1,
  'avalanche/1.6.1': 2,
  'avalanche/1.6.2': 3,
  'avalanche/1.6.3': 4,
  'avalanche/1.6.4': 5,
  'avalanche/1.6.5': 6,
  'avalanche/1.7.0': 7,
  'avalanche/1.7.1': 8,
  'avalanche/1.7.2': 9,
  'avalanche/1.7.3': 10,
  'avalanche/1.7.4': 11,
  'avalanche/1.7.5': 12,
  'avalanche/1.7.6': 13,
  'avalanche/1.7.7': 14,
  'avalanche/1.7.8': 15,
  'avalanche/1.7.9': 16,
  'avalanche/1.7.10': 17,
  'avalanche/1.7.11': 18,
  'avalanche/1.7.12': 19,
  'avalanche/1.7.13': 20,
  'avalanche/1.8.0': 21
}

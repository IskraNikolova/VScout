import { BN } from 'avalanche'

export default function () {
  return {
    code: '',
    height: 0,
    txAVM: {},
    txHash: '',
    currentSupply: new BN(1),
    pendingValidators: [],
    pendingDelegators: [],
    hasNodeConnection: true,
    hasNetworkConnection: true,
    nodeHealth: {},
    assetsCount: 0,
    validators: [],
    delegators: [],
    validator: {}
  }
}

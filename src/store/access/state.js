import { BN } from 'avalanche'

export default function () {
  return {
    code: '',
    height: 0,
    txAVM: {},
    txHash: '',
    currentSupply: new BN(374142935421374421),
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

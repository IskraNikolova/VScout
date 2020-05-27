
export default function () {
  return {
    assetInfo: { isOpen: false, asset: {} },
    addValidatorDialog: { isOpen: false, destinationAccount: { address: null }, payingAccount: { address: null } },
    signTx: { isOpen: false, unsignedTx: null, signer: null },
    pCreate: { isOpen: false, type: null },
    uCreate: { isOpen: false },
    selectAccounts: { isOpen: false, accounts: null }
  }
}

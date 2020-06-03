
export default function () {
  return {
    assetInfo: { isOpen: false, asset: {} },
    addValidatorDialog: { isOpen: false, destinationAccount: { address: null }, payingAccount: { address: null } },
    addIdentification: { isOpen: false, isAuth: false },
    signTx: { isOpen: false, unsignedTx: null, signer: null, signedTx: null },
    pCreate: { isOpen: false, type: null },
    uCreate: { isOpen: false },
    selectAccounts: { isOpen: false, accounts: null }
  }
}

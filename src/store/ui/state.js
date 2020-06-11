
export default function () {
  return {
    signTx: {
      isOpen: false,
      unsignedTx: null,
      signer: null,
      signedTx: null
    },
    typeAccount: { isValidators: true },
    addValidatorDialog: {
      isOpen: false
    },
    delegateValidatorDialog: {
      isOpen: false,
      validator: {}
    },
    formAccounts: {
      destinationAccount: { address: null },
      payingAccount: { address: null }
    },
    uCreate: { isOpen: false },
    nodeHealth: { isOpen: false },
    pCreate: { isOpen: false, type: null },
    assetInfo: { isOpen: false, asset: {} },
    selectAccounts: { isOpen: false, accounts: null },
    addIdentification: { isOpen: false, isAuth: false }
  }
}


export default function () {
  return {
    doesItConnect: false,
    typeAccount: {
      isValidators: true
    },
    nodeHealth: { isOpen: false },
    nodeInfo: { isOpen: false },
    assetInfo: { isOpen: false, asset: {} },
    addIdentification: { isOpen: false, isAuth: false }
  }
}

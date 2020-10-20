import {
  GENEZIS_ID
} from './../utils/constants.js'

export const _verifyReceiveFundsTx = ({ outputs, admin }) => {
  let result = false
  let amount = 0
  for (let i = 0; i < outputs.length; i++) {
    const output = outputs[i]
    const isIncl = output
      .addresses
      .includes(admin.substr(2))
    if (isIncl) {
      result = isIncl
      amount = Number(output.amount)
    }
  }
  return result && amount >= 100000000
}

export const _outputSearch = (tx, rewardOwner) => {
  if (tx.id === GENEZIS_ID) {
    const outputs = tx.outputs
    if (!outputs) return
    for (let i = 0; i < outputs.length; i++) {
      const addresses = outputs[i].addresses
      for (let j = 0; j < addresses.length; j++) {
        if (addresses[j] === rewardOwner.substr(2)) {
          return true
        }
      }
    }
  } else {
    return false
  }
}

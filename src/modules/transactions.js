export const _verifyReceiveFundsTx = (admin, txOutputs) => {
  let result = false
  let amount = 0
  for (let i = 0; i < txOutputs.length; i++) {
    const output = txOutputs[i]
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

export const hexStringToAsciiString = hexString => {
  if (!hexString) return
  if (hexString.startsWith('0x')) {
    hexString = hexString.substr(2)
  }

  return Buffer
    .from(hexString, 'hex')
    .toString('ascii')
    .replace(/\0/g, '')
}

export const hexStringToUtf8String = hexString => {
  if (hexString.startsWith('0x')) {
    hexString = hexString.substr(2)
  }
  return Buffer
    .from(hexString, 'hex')
    .toString('utf8')
    .replace(/\0/g, '')
}

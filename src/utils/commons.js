import moment from 'moment'
/**
* Performs a deep merge of objects and returns new object. Does not modify
* objects (immutable) and merges arrays via concatenation.
*
* @param {...object} objects - Objects to merge
* @returns {object} New object with merged key/values
*/
export function deepMerge (...objects) {
  if (JSON.stringify(objects[0]) === JSON.stringify(objects[1])) return objects[0]
  if (typeof objects[0] === 'string' || typeof objects[1] === 'string') return undefined

  const isObject = obj => obj && typeof obj === 'object'

  try {
    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach(key => {
        if (Array.isArray(prev[key]) && Array.isArray(obj[key])) {
          prev[key] = prev[key].concat(...obj[key])
        } else if (isObject(prev[key]) && isObject(obj[key])) {
          prev[key] = deepMerge(prev[key], obj[key])
        } else {
          prev[key] = obj[key]
        }
      })
      return prev
    }, {})
  } catch (err) {
    return undefined
  }
}

export function clean (obj) {
  const newVal = obj
  for (var propName in newVal) {
    if (newVal[propName] === null ||
      newVal[propName] === undefined ||
      newVal[propName] === '' ||
      newVal[propName] === 0) {
      delete newVal[propName]
    }
  }
  delete newVal.nodeID
  return newVal
}

export function groupBy (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

export function round (num, prec) {
  const multiplier = Math.pow(prec, 1 || 0)
  return Math.round((Number(num) + Number.EPSILON) * multiplier) / multiplier
}

export function stringToHex (str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).substr(-2)
  }
  return color
}

export function stringToColor (str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const colors = [
    '#94F7B2',
    '#c7f0e9',
    '#31696b',
    '#8BEEC9',
    '#e3d8eb',
    '#93E3D5',
    '#a263c7',
    '#ffffff',
    '#eebf8a',
    '#fafbff',
    '#c9caca',
    '#fde2e2',
    '#56818b'
  ]

  return colors[Math.abs(hash) % colors.length]
}

export function extractNumber (str) {
  const match = str.match(/\d+/g)
  if (match) {
    return match.join('')
  }
  return null
}

export function getChartLabel (interval, key) {
  if (typeof key === 'undefined' ||
      typeof interval === 'undefined') return

  const func = {
    minute: (date) => {
      return moment(date).format('mm:ss')
    },
    hourTwo: (date) => {
      return moment(date).format('LT')
    },
    day: (date) => {
      return moment(date).format('ddd ha')
    },
    week: (date) => {
      return `${moment(date).format('D')} ${moment.weekdaysShort()[moment(date).day()]}`
    },
    month: (date) => {
      return ` ${moment(date).format('D')} ${moment.monthsShort()[moment(date).month()]}`
    },
    year: (date) => {
      return moment.months()[moment(date).month()]
    }
  }

  return func[key](interval.endTime)
}

/**
* Get difference between two timestamps in seconds
*
* @param {Number} first - timestamp
* @param {Number} second - timestamp
* @returns { Number } seconds
*/
export function secBetweenTwoTime (first, second) {
  const res = Math.abs(new Date(Number(first)) - new Date(Number(second))) / 10
  return res % 60
}

var MD5 = makeMD5()
/**
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
*/
export function makeMD5 () {
  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length
  */
  function coreMd5 (x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32)
    x[(((len + 64) >>> 9) << 4) + 14] = len

    var a = 1732584193
    var b = -271733879
    var c = -1732584194
    var d = 271733878

    for (var i = 0; i < x.length; i += 16) {
      var olda = a
      var oldb = b
      var oldc = c
      var oldd = d

      a = md5Ff(a, b, c, d, x[i + 0], 7, -680876936)
      d = md5Ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5Ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5Ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5Ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5Ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5Ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5Ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5Ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5Ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5Ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5Ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5Ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5Ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5Ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5Ff(b, c, d, a, x[i + 15], 22, 1236535329)

      a = md5Gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5Gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5Gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5Gg(b, c, d, a, x[i + 0], 20, -373897302)
      a = md5Gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5Gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5Gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5Gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5Gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5Gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5Gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5Gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5Gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5Gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5Gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5Gg(b, c, d, a, x[i + 12], 20, -1926607734)

      a = md5Hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5Hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5Hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5Hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5Hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5Hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5Hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5Hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5Hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5Hh(d, a, b, c, x[i + 0], 11, -358537222)
      c = md5Hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5Hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5Hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5Hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5Hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5Hh(b, c, d, a, x[i + 2], 23, -995338651)

      a = md5Ii(a, b, c, d, x[i + 0], 6, -198630844)
      d = md5Ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5Ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5Ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5Ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5Ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5Ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5Ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5Ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5Ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5Ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5Ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5Ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5Ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5Ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5Ii(b, c, d, a, x[i + 9], 21, -343485551)

      a = safeAdd(a, olda)
      b = safeAdd(b, oldb)
      c = safeAdd(c, oldc)
      d = safeAdd(d, oldd)
    }
    return [a, b, c, d]
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5Cmn (q, a, b, x, s, t) {
    return safeAdd(bitRol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5Ff (a, b, c, d, x, s, t) {
    return md5Cmn((b & c) | ((~b) & d), a, b, x, s, t)
  }
  function md5Gg (a, b, c, d, x, s, t) {
    return md5Cmn((b & d) | (c & (~d)), a, b, x, s, t)
  }
  function md5Hh (a, b, c, d, x, s, t) {
    return md5Cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5Ii (a, b, c, d, x, s, t) {
    return md5Cmn(c ^ (b | (~d)), a, b, x, s, t)
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data
  */
  function coreHmacMd5 (key, data) {
    var bkey = str2binl(key)
    if (bkey.length > 16) bkey = coreMd5(bkey, key.length * MD5.chrsz)

    var ipad = [], opad = []
    for (var i = 0; i < 16; i++) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5C5C5C5C
    }

    var hash = coreMd5(ipad.concat(str2binl(data)), 512 + data.length * MD5.chrsz)
    return coreMd5(opad.concat(hash), 512 + 128)
  }

  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safeAdd (x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bitRol (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /*
  * Convert a string to an array of little-endian words
  * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
  */
  function str2binl (str) {
    var bin = [], chrsz = MD5.chrsz
    var mask = (1 << chrsz) - 1
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32)
    }
    return bin
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2str (bin) {
    var str = '', chrsz = MD5.chrsz
    var mask = (1 << chrsz) - 1
    for (var i = 0; i < bin.length * 32; i += chrsz) {
      str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask)
    }
    return str
  }

  /*
  * Convert an array of little-endian words to a hex string.
  */
  function binl2hex (binarray) {
    var hexTab = MD5.hexcase ? '0123456789ABCDEF' : '0123456789abcdef'
    var str = ''
    for (var i = 0; i < binarray.length * 4; i++) {
      str += hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
            hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF)
    }
    return str
  }

  /*
  * Convert an array of little-endian words to a base-64 string
  */
  function binl2b64 (binarray) {
    var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    var str = ''
    for (var i = 0; i < binarray.length * 4; i += 3) {
      var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) |
        (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) |
        ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF)
      for (var j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > binarray.length * 32) str += MD5.b64pad
        else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F)
      }
    }
    return str
  }

  return {
    /*
    * Configurable variables. You may need to tweak these to be compatible with
    * the server-side, but the defaults work in most cases.
    */
    hexcase: 0, // hex output format. 0 - lowercase; 1 - uppercase
    b64pad: '', // base-64 pad character. "=" for strict RFC compliance
    chrsz: 8, // bits per input character. 8 - ASCII; 16 - Unicode

    /*
    * These are the functions you'll usually want to call
    * They take string arguments and return either hex or base-64 encoded strings
    */
    hex: function (s) {
      return binl2hex(coreMd5(str2binl(s), s.length * MD5.chrsz))
    },

    base64: function (s) {
      return binl2b64(coreMd5(str2binl(s), s.length * MD5.chrsz))
    },

    string: function (s) {
      return binl2str(coreMd5(str2binl(s), s.length * MD5.chrsz))
    },

    hmac: {
      hex: function (key, data) {
        return binl2hex(coreHmacMd5(key, data))
      },

      base64: function (key, data) {
        return binl2b64(coreHmacMd5(key, data))
      },

      string: function (key, data) {
        return binl2str(coreHmacMd5(key, data))
      }
    },

    test: function () { // Perform a simple self-test to see if the VM is working
      return this.hex('abc') === '900150983cd24fb0d6963f7d28e17f72'
    }
  }
}

export function getAvatar (id) {
  const Md5 = makeMD5()
  const hash = Md5.hex(id)
  return {
    monster: `https://www.gravatar.com/avatar/${hash}?d=monsterid&s=150`,
    avatar: `https://www.gravatar.com/avatar/${hash}?d=identicon&s=150`
  }
}

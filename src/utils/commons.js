
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

/**
* Get difference between two timestamps in seconds
*
* @param {Number} first - timestamp
* @param {Number} second - timestamp
* @returns { Number } seconds
*/
export function secBetweenTwoTime (first, second) {
  const res = Math.abs(new Date(first) - new Date(second))
  return res % 60
}

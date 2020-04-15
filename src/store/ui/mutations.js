import { deepMerge } from './../../../src/utils/commons'

import { UPDATE_UI } from './types'

const mutations = {
  [UPDATE_UI]: (state, data) => {
    const newState = deepMerge(state, data)
    Object.entries(newState).forEach(([key, value]) => {
      state[key] = value
    })
  }
}

export default mutations

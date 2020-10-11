import {
  SET_CODE
} from './types'

const mutations = {
  [SET_CODE]: (state, { code }) => {
    state.code = code
  }
}

export default mutations

import state from './state'
import * as getters from './getters'
import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: false,
  getters,
  mutations,
  actions,
  state
}

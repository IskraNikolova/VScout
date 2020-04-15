import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import app from './app'
import ui from './ui'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => {
    const persistState = { ...state }
    // don't persist UI state
    delete persistState.ui
    return persistState
  }
})

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
const Store = new Vuex.Store({
  modules: {
    app,
    ui
  },
  plugins: [vuexLocal.plugin],
  strict: process.env.DEV
})

export default Store

const initialStateCopy = JSON.parse(JSON.stringify(Store.state))
export function resetState () {
  Store.replaceState(JSON.parse(JSON.stringify(initialStateCopy)))
}

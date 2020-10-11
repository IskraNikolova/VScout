import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import ui from './ui'
import app from './app'
import access from './access'
import memory from './memory'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => {
    const persistState = { ...state }
    // don't persist UI and App state
    delete persistState.ui
    delete persistState.access
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
    ui,
    app,
    memory,
    access
  },
  plugins: [vuexLocal.plugin],
  strict: process.env.DEV
})

export default Store

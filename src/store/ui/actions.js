import {
  UPDATE_UI
} from './types'

const updateUi = ({ commit }, data) => {
  commit(UPDATE_UI, data)
}

export default {
  [UPDATE_UI]: updateUi
}

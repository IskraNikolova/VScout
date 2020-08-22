import {
  UPDATE_UI,
  OPEN_NODE_INFO,
  CLOSE_NODE_INFO,
  OPEN_ASSET_INFO,
  CLOSE_ASSET_INFO,
  OPEN_NODE_HEALTH,
  CLOSE_NODE_HEALTH,
  OPEN_ADD_IDENTIFICATION,
  CLOSE_ADD_IDENTIFICATION
} from './types'

const updateUi = ({ commit }, data) => {
  commit(UPDATE_UI, data)
}

const openAssetInfo = ({ commit }, { asset }) => {
  commit(UPDATE_UI, { assetInfo: { isOpen: true, asset } })
}

const closeAssetInfo = ({ commit }) => {
  commit(UPDATE_UI, { assetInfo: { isOpen: false, asset: {} } })
}

const openNodeInfo = ({ commit }) => {
  commit(UPDATE_UI, { nodeInfo: { isOpen: true } })
}

const closeNodeInfo = ({ commit }) => {
  commit(UPDATE_UI, { nodeInfo: { isOpen: false } })
}

const openNodeHealth = ({ commit }) => {
  commit(UPDATE_UI, { nodeHealth: { isOpen: true } })
}

const closeNodeHealth = ({ commit }) => {
  commit(UPDATE_UI, { nodeHealth: { isOpen: false } })
}

const openAddIdentification = ({ commit }) => {
  commit(UPDATE_UI, { addIdentification: { isOpen: true, isAuth: false } })
}

const closeAddIdentification = ({ commit }) => {
  commit(UPDATE_UI, { addIdentification: { isOpen: false, isAuth: false } })
}

export default {
  [UPDATE_UI]: updateUi,
  [OPEN_NODE_INFO]: openNodeInfo,
  [CLOSE_NODE_INFO]: closeNodeInfo,
  [OPEN_ASSET_INFO]: openAssetInfo,
  [CLOSE_ASSET_INFO]: closeAssetInfo,
  [OPEN_NODE_HEALTH]: openNodeHealth,
  [CLOSE_NODE_HEALTH]: closeNodeHealth,
  [OPEN_ADD_IDENTIFICATION]: openAddIdentification,
  [CLOSE_ADD_IDENTIFICATION]: closeAddIdentification
}

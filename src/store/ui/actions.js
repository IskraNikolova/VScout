import {
  UPDATE_UI,
  OPEN_ASSET_INFO,
  CLOSE_ASSET_INFO
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

export default {
  [UPDATE_UI]: updateUi,
  [OPEN_ASSET_INFO]: openAssetInfo,
  [CLOSE_ASSET_INFO]: closeAssetInfo
}

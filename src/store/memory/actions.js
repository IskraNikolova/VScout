import {
  GET_NODE_PEERS,
  GET_INFO_PEERS
} from './types.js'

import {
  _getPeers,
  _getDefPeers
} from './../../modules/network.js'

const {
  network
} = require('./../../modules/config.js')
  .default

const COUNTRY_CODE = 'countryCode'

import {
  UPDATE_UI
} from './../ui/types'

import {
  groupBy
} from './../../utils/commons.js'

async function getNodePeers (
  { getters, commit, dispatch }, { isIgnore = true }) {
  try {
    const response = await _getDefPeers()

    if (response.error) {
      dispatch(GET_NODE_PEERS, { isIgnore: false })
      return
    }

    const peers = response.data.result
    commit(GET_NODE_PEERS, { peers })
    if (getters.networkEndpoint.url === network.endpointUrls[0].url && isIgnore) {
      const peersMap = groupBy(peers.peers, COUNTRY_CODE)
      Object.keys(peersMap).map(function (key, index) {
        peersMap[key] = peersMap[key].length
      })

      commit(GET_INFO_PEERS, { peersMap })
    } else {
      const response = await _getPeers({
        endpoint: getters.networkEndpoint.url
      })

      if (response.data.error) {
        commit(UPDATE_UI, { doesItConnect: true })
        return
      }

      let peers = await getInfoPeers(response.data.result.peers, getters.peers.peers)

      if (!peers) peers = []
      const result = {
        numPeers: peers.length,
        peers
      }
      commit(GET_NODE_PEERS, { peers: result })

      const peersMap = groupBy(peers, COUNTRY_CODE)
      Object.keys(peersMap).map(function (key, index) {
        peersMap[key] = peersMap[key].length
      })

      commit(GET_INFO_PEERS, { peersMap })
    }
  } catch (err) {
    console.log(err)
  }
}

async function getInfoPeers (peers, info) {
  return await Promise.all(peers.map(async p => {
    try {
      const ip = p.ip.split(':')[0]
      const r = info
        .find(val => val.ip.includes(ip))
      return {
        ...p,
        ...r
      }
    } catch (err) {
      return p
    }
  }))
}

export default {
  [GET_NODE_PEERS]: getNodePeers
}

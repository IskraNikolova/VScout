import { hexStringToAsciiString } from './string-conversion'
import {
  _getPastEvents
} from './networkRpc'

const SET_VALIDATOR_INFO = 'SetValidatorInfoEvent'

const mapEvent = event => ({
  ...event.returnValues,
  blockHash: event.blockHash,
  transactionHash: event.transactionHash
})

const mapInfo = (data) => ({
  id: hexStringToAsciiString(data.id),
  avatarUrl: hexStringToAsciiString(data.avatarUrl),
  link: hexStringToAsciiString(data.link),
  name: hexStringToAsciiString(data.name)
})

/**
 * Get validators info from past events
 * @param {Object} params parameters
 * @param {number} params.fromBlock
 * @param {number} params.toBlock
 */
export const getPastEvents = async () => {
  const events = await _getPastEvents(SET_VALIDATOR_INFO)

  return Promise.all(events
    .map(mapEvent)
    .map(async x => mapInfo(x))
  )
}

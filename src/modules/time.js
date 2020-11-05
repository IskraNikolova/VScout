import moment from 'moment'

export const getDuration = (s, e) => {
  const start = moment(new Date(Number(s) * 1000))
  const end = moment(new Date(Number(e) * 1000))

  return moment.duration(end.diff(start))
}

export const getDurationHumanize = (s, e) => {
  const start = moment(new Date(Number(s) * 1000))
  const end = moment(new Date(Number(e) * 1000))

  return moment.duration(end.diff(start)).humanize()
}

export const getDurationByDayCount = (dur) => {
  return moment.duration(dur, 'days')
}

export const getDurationByMinutesCount = (dur) => {
  const a = moment()
  const b = moment(new Date(dur))
  const result = a.diff(b, 'minutes')
  return result
}

export const diff = (s, e) => {
  const a = moment(new Date(Number(s) * 1000))
  const b = moment(new Date(Number(e) * 1000))
  const result = a.diff(b)
  return result
}

export const getEndOfDay = (e) => {
  return moment(new Date(Number(e) * 1000)).endOf('day').fromNow()
}

export const countDownCounter = (e) => {
  const currentTime = moment(new Date() / 1000)
  const leftTime = moment(new Date(Number(e))) - currentTime
  let duration = moment.duration(leftTime, 'seconds')
  duration = moment.duration(duration.asSeconds(), 'seconds')

  const isMinimumAmountForStake = (duration.months() < 1 && duration.days() >= 14) || duration.months() >= 1
  const months = duration.months().toString().padStart(2, '0')
  const days = duration.days().toString().padStart(2, '0')
  const hours = duration.hours().toString().padStart(2, '0')
  const minutes = duration.minutes().toString().padStart(2, '0')
  // const seconds = duration.seconds().toString().padStart(2, '0')
  const result = `${months} : ${days} : ${hours} : ${minutes}`

  return { countdown: result, isMinimumAmountForStake }
}

export const timeago = (t) => {
  return moment.duration(t).humanize(true)
}

export const date = (time) => {
  return moment(Number(time) * 1000).format('YYYY-MM-DD HH:mm')
}

export const dateFormat = (time, format) => {
  return moment(Number(time) * 1000).format(format)
}

export const datePickerFormat = ({ value, label }) => {
  const date = moment().add(Number(value), label)
  return date.format('YYYY-MM-DD HH:mm')
}

export const toUnix = (date) => {
  return moment(date).unix()
}

export const dateLL = (time) => {
  return moment(Number(time) * 1000).format('LL')
}

export const fromNow = (time) => {
  return moment(new Date(Number(time) * 1000), 'YYYYMMDD').fromNow()
}

export const getWeeks = (s, e) => {
  const start = moment(new Date(s), 'YYYYMMDD')
  const end = moment(new Date(e), 'YYYYMMDD')
  return end.diff(start, 'week')
}

export const getSeconds = (time) => {
  return moment(new Date(Number(time) * 1000), 'YYYYMMDD').fromNow()
}

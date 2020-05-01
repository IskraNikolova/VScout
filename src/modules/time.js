import moment from 'moment'

export const getDuration = (s, e) => {
  s = new Date(Number(s) * 1000)
  e = new Date(Number(e) * 1000)
  const date1 = moment(s)
  const date2 = moment(e)
  const duration = moment.duration(date2.diff(date1))
  return duration
}

export const timeago = (t) => {
  return moment.duration(t).humanize(true)
}

export const date = (time) => {
  return moment(Number(time) * 1000).format('llll')
}

export const fromNow = (time) => {
  return moment(new Date(Number(time) * 1000), 'YYYYMMDD').fromNow()
}

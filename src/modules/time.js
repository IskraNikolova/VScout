import moment from 'moment'

export const getDuration = (s, e) => {
  const start = moment(new Date(Number(s) * 1000))
  const end = moment(new Date(Number(e) * 1000))

  return moment.duration(end.diff(start))
}

export const timeago = (t) => {
  return moment.duration(t).humanize(true)
}

export const date = (time) => {
  return moment(Number(time) * 1000).format('llll')
}

export const dateLL = (time) => {
  return moment(Number(time) * 1000).format('LL')
}

export const fromNow = (time) => {
  return moment(new Date(Number(time) * 1000), 'YYYYMMDD').fromNow()
}

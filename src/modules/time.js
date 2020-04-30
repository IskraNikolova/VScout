import moment from 'moment'

export const getDuration = (s, e) => {
  s = new Date(Number(s) * 1000)
  e = new Date(Number(e) * 1000)
  const date1 = moment(s, 'MM/DD/YYYY')
  const date2 = moment(e, 'MM/DD/YYYY')
  const duration = moment.duration(date2.diff(date1))
  return duration
}

export const timeago = (t) => {
  const dur = Math.round(moment.duration(t).asSeconds())
  if (dur < 60 && dur > 0) {
    return `${dur} sec left`
  } else if (dur < 3600 && dur > 0) {
    return `${Math.round(moment.duration(t).asMinutes())} min left`
  } else if (dur > 3600 && dur < 86400) {
    return `${Math.round(moment.duration(t).asHours())} hours left`
  } else if (dur > 3600) {
    return `${Math.round(moment.duration(t).asDays())} days left`
  }
  return 'completed'
}

export const date = (time) => {
  return moment(Number(time) * 1000).format('llll')
}

export const fromNow = (time) => {
  return moment(new Date(Number(time) * 1000), 'YYYYMMDD').fromNow()
}

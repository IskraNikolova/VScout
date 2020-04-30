<template>
<div class="row">
  <div class="col">
    <label for="file" class="row">
      <div class="col">Start <span class="text-accent">{{ date(startTime) }} </span><small>({{ fromNow(startTime) }})</small></div>
      <div class="col-3">End <span class="text-accent">{{ date(endTime) }}</span></div>
    </label>
    <q-linear-progress id="file" dark stripe rounded size="20px" :value="progress(startTime, endTime)" color="accent" class="q-mt-sm" >
    <div class="absolute-full flex flex-center">
      <q-badge color="black" text-color="accent" :label="round(progress(startTime, endTime) * 100) + '% ' + leftTime(startTime, endTime) " />
    </div>
    </q-linear-progress>
  </div>
</div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ProgressBarValidateSession',
  props: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  methods: {
    date (time) {
      return moment(Number(time) * 1000).format('llll')
    },
    fromNow (time) {
      return moment(new Date(Number(time) * 1000), 'YYYYMMDD').fromNow()
    },
    progress (startTime, endTime) {
      const allMinutes = this.getDuration(startTime, endTime)
      const nowMinutes = this.getDuration(startTime, this.getUnixTime())
      if (nowMinutes > allMinutes) return 1
      const result = Math.floor(nowMinutes) / Math.floor(allMinutes)
      return this.round(result)
    },
    leftTime (s, e) {
      const all = this.getDuration(s, e)
      const last = this.getDuration(s, this.getUnixTime())
      const res = this.timeago(all - last)
      return res
    },
    getUnixTime () { return Date.now() / 1000 | 0 },
    timeago (t) {
      const dur = Math.round(moment.duration(t).asMinutes())
      if (dur < 60 && dur > 0) {
        return `left ${dur} min`
      } else if (dur < 1440 && dur > 0) {
        return `left ${Math.round(moment.duration(t).asHours())} hour`
      } else if (dur > 1440) {
        return `left ${Math.round(moment.duration(t).asDays())} days`
      }
      return 'complete'
    },
    getDuration (s, e) {
      s = new Date(Number(s) * 1000)
      e = new Date(Number(e) * 1000)
      const date1 = moment(s, 'MM/DD/YYYY')
      const date2 = moment(e, 'MM/DD/YYYY')
      const duration = moment.duration(date2.diff(date1))
      return duration
    },
    round (result) {
      const multiplier = Math.pow(1000, 1 || 0)
      const res = Math.round(result * multiplier) / multiplier
      return res
    }
  }
}
</script>

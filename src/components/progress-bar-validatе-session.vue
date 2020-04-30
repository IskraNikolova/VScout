<template>
  <div>
    <label for="file" class="row">
      <div class="col-3"><small>{{ leftTime(startTime, endTime) }}</small></div>
    </label>
    <q-linear-progress id="file" dark stripe rounded size="30px" :value="progress(startTime, endTime)" color="white">
    <div class="absolute-full flex flex-center">
      <q-badge color="white" text-color="accent" :label="round(progress(startTime, endTime) * 100) + '% '" />
    </div>
    </q-linear-progress>
  </div>
</template>

<script>
import { getDuration, timeago } from './../modules/time'

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
    progress (startTime, endTime) {
      const allMinutes = getDuration(startTime, endTime)
      const nowMinutes = getDuration(startTime, this.getUnixTime())
      if (nowMinutes > allMinutes) return 1
      const result = Math.floor(nowMinutes) / Math.floor(allMinutes)
      return this.round(result)
    },
    leftTime (s, e) {
      const all = getDuration(s, e)
      const last = getDuration(s, this.getUnixTime())
      const res = timeago(all - last)
      return res
    },
    getUnixTime () { return Date.now() / 1000 | 0 },
    round (result) {
      const multiplier = Math.pow(1000, 1 || 0)
      const res = Math.round(result * multiplier) / multiplier
      return res
    }
  }
}
</script>

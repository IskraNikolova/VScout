<template>
  <div>
    <q-linear-progress dark size="49px" :value="progress" :buffer="progress" color="accent">
      <div class="absolute-full text-black progressBadge">
        {{ progressBadge }} %
      </div>
    </q-linear-progress>
    <div class="absolute-full timeago">
      <div>{{ timeago }}</div>
    </div>
  </div>
</template>

<script>
import { getDuration, timeago } from './../modules/time'
import { round } from './../utils/commons'

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
  computed: {
    progressBadge: function () {
      return round(this.progressM() * 100, 1000)
    },
    progress: function () {
      return this.progressM()
    },
    timeago: function () {
      return this.timeagoM()
    }
  },
  methods: {
    dur () {
      return getDuration(this.startTime, this.endTime)
    },
    lastDur () {
      return getDuration(this.startTime, Date.now() / 1000 | 0)
    },
    timeagoM () {
      return timeago(this.dur() - this.lastDur())
    },
    progressM () {
      const result = Math.floor(this.lastDur()) / Math.floor(this.dur())
      return round(result, 1000)
    }
  }
}
</script>

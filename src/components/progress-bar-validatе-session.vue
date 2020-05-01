<template>
  <div style="margin-top: -5px;">
    <label for="file" class="row">
      <div class="col-3"><small>{{ timeago}}</small></div>
    </label>
    <q-linear-progress id="file" dark stripe rounded size="18px" :value="progress" color="accent">
    <div class="absolute-full flex flex-center">
      <q-badge color="black" text-color="accent" :label="progressBadge + '% '" />
    </div>
    </q-linear-progress>
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
  data () {
    return {
      progress: 0,
      timeago: ''
    }
  },
  created () {
    this.progress = this.progressM()
    this.timeago = this.timeagoM()
    setInterval(() => {
      this.progress = this.progressM()
      this.timeago = this.timeagoM()
    }, 60000)
  },
  computed: {
    progressBadge: function () {
      return round(this.progress * 100, 1000)
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

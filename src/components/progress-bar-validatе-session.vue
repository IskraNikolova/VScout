<template>
  <div>
    <q-linear-progress size="50px" :value="progress" :buffer="progress" color="primary">
      <div class="absolute-full text-black progressBadge">
        <span class="text-grey text-bold">{{ progressBadge }} %</span>
      </div>
    </q-linear-progress>
    <div class="absolute-full timeago text-negative text-medium">
      <small>{{ endOfDate }}</small>
    </div>
  </div>
</template>

<script>
import { round } from './../utils/commons.js'
import { getDuration, getEndOfDay } from './../modules/time.js'

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
    endOfDate: function () {
      return getEndOfDay(this.endTime)
    }
  },
  methods: {
    dur () {
      return getDuration(this.startTime, this.endTime)
    },
    lastDur () {
      return getDuration(this.startTime, Date.now() / 1000 | 0)
    },
    progressM () {
      const result = Math.floor(this.lastDur()) / Math.floor(this.dur())
      return round(result, 1000)
    }
  }
}
</script>

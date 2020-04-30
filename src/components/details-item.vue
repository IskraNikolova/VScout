<template>
  <div>
    <q-avatar size="12px" color="grey" class="column-2"><img :src="img" /></q-avatar>
    <div>Validator Id: <span id="identity">{{ identity }}</span></div>
    <div>Start <span class="text-accent">{{ startDate }} </span><small>({{ fromNowGet }})</small></div>
    <div>End <span class="text-accent">{{ endDate }}</span></div>
  </div>
</template>

<script>
import { date, fromNow } from './../modules/time'

export default {
  name: 'DetailsItem',
  props: {
    img: {
      type: String,
      required: true
    },
    identity: {
      type: String,
      required: true
    },
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
    startDate: function () {
      return date(this.startTime)
    },
    endDate: function () {
      return date(this.endTime)
    },
    fromNowGet: function () {
      return fromNow(this.startTime)
    }
  }
}
</script>
<style scoped>
  #identity {
    color: #87C5D6;
    font-size: 10px;
  }
</style>

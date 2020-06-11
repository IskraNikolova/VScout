<template>
<div>
  <div class="row">
    <div class="col">
      <div>Validator ID: <span id="identity">{{ identity }}</span></div>
      <div>P-Chain Account (staker) <span id="identity">{{ address }}</span></div>
      <div>Start <span class="text-accent">{{ startDate }} </span><small>({{ fromNowGet }})</small></div>
      <div>End <span class="text-accent">{{ endDate }}</span></div>
    </div>
  </div>
</div></template>

<script>
import { date, fromNow } from './../modules/time'

export default {
  name: 'DetailsItem',
  props: {
    identity: {
      type: String,
      required: true
    },
    address: {
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
    color: #ffa959;
  }
</style>

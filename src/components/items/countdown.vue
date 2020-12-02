<template>
  <div>
    <div class="col count-down q-pa-xs" :style="'border-color:' + color">
      <div :class="'text-medium text-' + textColor" id="value">{{ months }}</div>
      <div :class="'text-' + textColor" id="label">MONTHS</div>
    </div>
    <div class="col count-down q-pa-xs" :style="'border-color:' + color">
      <div :class="'text-medium text-' + textColor" id="value">{{ days }}</div>
       <div :class="'text-' + textColor" id="label">DAYS</div>
    </div>
    <div class="col count-down q-pa-xs" :style="'border-color:' + color">
      <div :class="'text-medium text-' + textColor" id="value">{{ hours }}</div>
       <div :class="'text-' + textColor" id="label">HOURS</div>
    </div>
    <div class="col count-down q-pa-xs" :style="'border-color:' + color">
      <div :class="'text-medium text-' + textColor" id="value"> {{ minutes }}</div>
       <div :class="'text-' + textColor" id="label">MINUTES</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Countdown',
  props: {
    countdown: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    textColor: {
      type: String,
      required: false
    }
  },
  computed: {
    dataArray: function () {
      if (!this.countdown) return
      return this.countdown.split(':')
    },
    months: function () {
      return this.dataArray[0]
    },
    days: function () {
      return this.dataArray[1]
    },
    hours: function () {
      return this.dataArray[2]
    },
    minutes: function () {
      return this.dataArray[3]
    }
  }
}
</script>

<style scoped>
  .count-down {
    border-style: solid;
    border-width: 0.5px;
    border-radius: 5px;
    margin-right: 2px;
  }
  #label {
    font-size: 8px;
    text-align: center;
  }
  #value {
    text-align: center;
  }
</style>

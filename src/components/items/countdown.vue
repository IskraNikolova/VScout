<template>
  <div>
    <div class="col count-down q-pa-xs q-ml-md" :style="'border-color:' + color">
      <div class="text-medium" id="value">{{ months }}</div>
      <div id="label">MONTHS</div>
    </div>
    <div class="col count-down q-pa-xs" :style="'border-color:' + color">
      <div class="text-medium" id="value">{{ days }}</div>
       <div id="label">DAYS</div>
    </div>
    <div class="col count-down q-pa-xs" :style="'border-color:' + color">
      <div class="text-medium" id="value">{{ hours }}</div>
       <div id="label">HOURS</div>
    </div>
    <div class="col count-down q-pa-xs" :style="'border-color:' + color">
      <div class="text-medium" id="value"> {{ minutes }}</div>
       <div id="label">MINUTES</div>
    </div>
    <!--<div class="col count-down q-pa-xs" :style="'border-color:' + color">
      <div class="text-medium" id="value"> {{ seconds }}</div>
      <div id="label">SECONDS</div>
    </div>-->
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
    // seconds: function () {
    //   return this.dataArray[4]
    // }
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

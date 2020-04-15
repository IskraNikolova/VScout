<template>
  <q-card
    class="q-mt-md q-pa-md q-pl-xl q-pr-xl"
    dark
    flat
    id="custom-card">
    <div class="row">
      <div class="col-md-2 col-xs-10">
        <div id="f-size11" class="q-pb-md">LAST BLOCK TIMESTAMP</div>
        <div class="text-h5 text-accent q-pb-md"><b>{{ lastBlock.timestamp }}</b></div>
        <div id="f-size12">Finalization is <span class="text-accent">5</span> behind</div>
      </div>
      <div class="col-2 q-pt-md">
        <img src="~assets/block.svg" id="logo">
      </div>
      <div class="col-md-2 col-xs-10">
        <div id="f-size11" class="q-pb-md">BLOCK TIME</div>
        <div class="text-h5 text-accent q-pb-md"><b>{{ blockTime }} s</b></div>
        <div id="f-size12">1 hour average is <span class="text-accent">0.5</span>s</div>
      </div>
      <div class="col-2 q-pt-md">
        <img src="~assets/hourglass.svg" id="logo">
      </div>
      <div class="col-md-4 col-xs-12">
        <div class="row q-pb-md">
          <div id="f-size11">EPOCH: <span class="text-accent">10</span></div>
          <div class="on-right" id="f-size11">PROGRESS: <span class="text-accent">62%</span></div>
        </div>
        <div class="q-pb-md">
          <q-linear-progress dark stripe rounded size="20px" :value="0.62" color="accent"/>
        </div>
        <div id="f-size12" class="q-pt-md"><span class="text-accent">1d 23h 20m</span> until new epoch</div>
      </div>
    </div>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BlockItem',
  computed: {
    ...mapGetters([
      'lastBlock',
      'blockTime'
    ])
  }
}
</script>
<style scoped>
  #custom-card {
    border-right: 2px solid #87C5D6;
    background: radial-gradient(circle, #344245 0%, #000709 70%);
    opacity:0.9;
  }
  #f-size12 {
    font-size: 12px;
  }
  #f-size11 {
    font-size: 11px;
  }
  #logo {
    width:30vw;
    max-width:30px;
  }
</style>

<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header reveal class="bg-white text-black q-pt-md q-pr-xl" style="z-index: 0;">
      <q-toolbar>
        <q-img class="md background-img-s" src="./../statics/img/background.png"/>
        <q-img class="xl background-img-s" src="./../statics/img/background.png"/>
        <q-img class="lg background-img-s" src="./../statics/img/background.png"/>
        <q-img class="md" src="~assets/AVAVE.png" id="toolbar-logo" style="margin-left: -5%;"/>
        <q-img class="xl" src="~assets/AVAVE.png" id="toolbar-logo" style="margin-left: -5%;"/>
        <q-img class="lg" src="~assets/AVAVE.png" id="toolbar-logo" style="margin-left: -5%;"/>
        <q-toolbar-title></q-toolbar-title>
        <q-img class="xs" src="~assets/AVAVE.png" id="toolbar-logo"/>
        <q-img class="sm" src="~assets/AVAVE.png" id="toolbar-logo"/>
        <q-btn push no-caps flat id="logo-sim" icon="img:statics/rwc.svg">
          <q-popup-proxy>
            <q-banner class="q-pa-md" dense style="width: 430px;">
              <div class="q-pb-md">Reward Calculator</div>
              <div class="q-pa-md absolute-top-right">
                <q-badge outline size="xs" color="accent" :label="percentReward.toFixed(2) + '%'" />
                </div>
              <q-input
                label-color="orange"
                outlined
                v-model="stakeAmount"
                label="Staking Amount"
                mask="#"
                input-class="text-right"
                suffix="$AVAX"
                precision= '2'
                reverse-fill-mask
                color="accent"
                @input="calculate"
                class="q-pb-xl"
                :rules="[value => value >= 2000 || 'Stake Amount must be greater or equal to 2000 $AVAX']"
              />
              <q-slider
                class="q-ml-xs q-mr-xs"
                v-model="stakeTime"
                :min="2"
                :max="52"
                :step="1"
                :label-value="'Staking Time ' + stakeTime + ' weeks'"
                label-always
                @input="calculate"
                label-text-color="orange"
                label-color="white"
                color="orange"
              />
              <div class="row">
                <div class="col-4">
                  <small>Weekly Earning  </small>
                  <div>
                    <span class="text-accent">
                      {{ weekly.toFixed(2) }}
                    </span> $AVAX&nbsp;
                  </div>
                </div>
                <div class="col-4 q-pl-xs">
                  <small>{{ stakeTime }} Weeks Earnings </small>
                  <div>
                    <span class="text-accent">
                      {{ (weekly * stakeTime).toFixed(2) }}
                    </span> $AVAX
                  </div>
                </div>
                <div class="col-4 q-pl-md">
                  <small>Yearly Earning </small>
                  <div>
                    <span class="text-accent">
                      {{ result.toFixed(2) }}
                    </span> $AVAX
                  </div>
                  </div>
                </div>
            </q-banner>
          </q-popup-proxy>
        </q-btn>
        <select-network-dropdown />
        <q-btn-dropdown
          flat
          dropdown-icon="img:statics/node.svg"
          id="target-el"
        >
          <div class="no-wrap q-pa-md text-orange">
            Switch To Endpoint
          </div>
          <switch-endpoint />
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
    <q-page-container style="z-index: 10;">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import SwitchEndpoint from './../components/switch-endpoint'
import SelectNetworkDropdown from './../components/items/select-network-dropdown'

export default {
  name: 'MainLayout',
  components: {
    SwitchEndpoint,
    SelectNetworkDropdown
  },
  data () {
    return {
      stakeAmount: 2000,
      stakeTime: 2,
      result: 0.00,
      yearly: 0.00,
      weekly: 0.00,
      percentReward: 4,
      btnNetwork: false,
      switchNet: '#target-el'
    }
  },
  mounted () {
    this.calculate()
  },
  methods: {
    calculate () {
      this.stakeTime = Math.round(this.stakeTime)
      const basePercY = 4
      if (this.stakeTime > 2) {
        //  additional percent reward; calculate 11.11%  bonus devide 52 weeks
        const bonusPercentPerWeek = 0.2136538461538462
        this.percentReward = (this.stakeTime * bonusPercentPerWeek) + basePercY
        this.result = (this.stakeAmount * this.percentReward) / 100
      } else {
        this.percentReward = basePercY
        this.result = (this.stakeAmount * basePercY) / 100
      }
      this.weekly = this.result / 52
    }
  }
}
</script>

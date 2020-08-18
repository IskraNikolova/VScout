<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header reveal>
      <div class="sm">
        <q-toolbar class="background-white">
          <q-btn flat @click="drawer=!drawer" round dense icon="menu" sm class="text-grey"/>
          <q-toolbar-title @click="$router.push('/')" style="cursor:pointer;margin-left: 12px;">
            VScout.io
          </q-toolbar-title>
          <q-btn push flat id="logo-sim" label="calculator">
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
            label="endpoint"
            id="target-el"
          >
            <div class="no-wrap q-pa-md text-orange">
              Switch To Endpoint
            </div>
            <switch-endpoint />
          </q-btn-dropdown>
        </q-toolbar>
        <q-toolbar class="background-orange">
          <q-toolbar-title>
            <img src="~assets/vscout.svg" style="width: 200px;">
          </q-toolbar-title>
          <q-bar>
            <q-input
              outlined
              dark
              stack-label
              color="white"
              style="min-width: 450px;"
              placeholder="Search Validator/Blockchain/Subnet"
              clearable v-model="filter"
            >
              <template v-slot:append>
                <q-icon name="search" @click="search"/>
              </template>
            </q-input>
          </q-bar>
        </q-toolbar>
      </div>
      <div class="md">
        <q-toolbar class="background-white">
          <q-btn flat @click="drawer=!drawer" round dense icon="menu" sm class="text-grey"/>
          <q-toolbar-title @click="$router.push('/')" style="cursor:pointer;margin-left: 12px;">
            VScout.io
          </q-toolbar-title>
          <q-btn push flat id="logo-sim" label="calculator">
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
            label="endpoint"
            id="target-el"
          >
            <div class="no-wrap q-pa-md text-orange">
              Switch To Endpoint
            </div>
            <switch-endpoint />
          </q-btn-dropdown>
        </q-toolbar>
        <q-toolbar class="background-orange">
          <q-toolbar-title>
            <img src="~assets/vscout.svg" style="width: 200px;">
          </q-toolbar-title>
          <q-bar>
            <q-input
              outlined
              dark
              stack-label
              color="white"
              style="min-width: 450px;"
              placeholder="Search Validator/Blockchain/Subnet"
              clearable v-model="filter"
            >
              <template v-slot:append>
                <q-icon name="search" @click="search"/>
              </template>
            </q-input>
          </q-bar>
        </q-toolbar>
      </div>
      <div class="lg">
        <q-toolbar class="background-white">
          <q-btn flat @click="drawer=!drawer" round dense icon="menu" sm class="text-grey"/>
          <q-toolbar-title @click="$router.push('/')" style="cursor:pointer;margin-left: 12px;">
            VScout.io
          </q-toolbar-title>
          <q-btn push flat id="logo-sim" label="calculator">
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
            label="endpoint"
            id="target-el"
          >
            <div class="no-wrap q-pa-md text-orange">
              Switch To Endpoint
            </div>
            <switch-endpoint />
          </q-btn-dropdown>
        </q-toolbar>
        <q-toolbar class="background-orange">
          <q-toolbar-title>
            <img src="~assets/vscout.svg" style="width: 200px;">
          </q-toolbar-title>
          <q-bar>
            <q-input
              outlined
              dark
              stack-label
              color="white"
              style="min-width: 450px;"
              placeholder="Search Validator/Blockchain/Subnet"
              clearable v-model="filter"
            >
              <template v-slot:append>
                <q-icon name="search" @click="search"/>
              </template>
            </q-input>
          </q-bar>
        </q-toolbar>
      </div>
      <div class="xl">
        <q-toolbar class="background-white">
          <q-btn flat @click="drawer=!drawer" round dense icon="menu" sm class="text-grey"/>
          <q-toolbar-title @click="$router.push('/')" style="cursor:pointer;margin-left: 12px;">
            VScout.io
          </q-toolbar-title>
          <q-btn push flat id="logo-sim" label="calculator">
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
            label="endpoint"
            id="target-el"
          >
            <div class="no-wrap q-pa-md text-orange">
              Switch To Endpoint
            </div>
            <switch-endpoint />
          </q-btn-dropdown>
        </q-toolbar>
        <q-toolbar class="background-orange">
          <q-toolbar-title>
            <img src="~assets/vscout.svg" style="width: 200px;">
          </q-toolbar-title>
          <q-bar>
            <q-input
              outlined
              dark
              stack-label
              color="white"
              style="min-width: 450px;"
              placeholder="Search Validator/Blockchain/Subnet"
              clearable v-model="filter"
            >
              <template v-slot:append>
                <q-icon name="search" @click="search"/>
              </template>
            </q-input>
          </q-bar>
        </q-toolbar>
      </div>
      <div class="xs">
        <div class="background-white row">
          <q-btn flat @click="drawer=!drawer" round dense icon="menu" sm class="text-grey"/>
          <div class="col" @click="$router.push('/')" style="cursor:pointer;margin-top: 7px;margin-left: 7px;">
            VScout.io
          </div>
        </div>
        <div class="background-orange q-pb-md">
          <div>
            <img src="~assets/vscout.svg" style="width: 150px;">
          </div>
            <q-bar>
            <q-input
              outlined
              dark
              stack-label
              color="white"
              style="min-width: 100%;"
              placeholder="Search Validator/Blockchain/Subnet"
              clearable v-model="filter"
            >
              <template v-slot:append>
                <q-icon name="search" @click="search"/>
              </template>
            </q-input>
          </q-bar>
        </div>
      </div>
    </q-header>
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="200"
      :breakpoint="500"
    >
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="img:statics/rwc.svg" />
            </q-item-section>

            <q-item-section>
              <q-btn push flat no-caps label="Calculator" style="margin-left: -50px;">
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
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="img:statics/blockchain-black.svg" />
            </q-item-section>

            <q-item-section>
              <span @click="isB=true">Blockchains</span>
              <q-dialog v-model="isB" transition-show="rotate" transition-hide="rotate">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Blockchains</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <list-blockchains />
                  </q-card-section>

                  <q-card-actions align="right">
                    <q-btn flat label="Close" color="primary" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="img:statics/network.svg" />
            </q-item-section>

            <q-item-section>
              <span @click="isS=true">Subnets</span>
              <q-dialog v-model="isS" transition-show="rotate" transition-hide="rotate">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Subnets</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <list-subnets />
                  </q-card-section>

                  <q-card-actions align="right">
                    <q-btn flat label="Close" color="primary" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="img:statics/node.svg" />
            </q-item-section>

            <q-item-section>
              <span @click="isE=true">Endpoint</span>
              <q-dialog v-model="isE" transition-show="rotate" transition-hide="rotate">
                <q-card>
                  <q-card-section>
                    <div class="text-h6">Switch To Endpoint</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <switch-endpoint />
                  </q-card-section>

                  <q-card-actions align="right">
                    <q-btn flat label="Close" color="primary" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <q-page-sticky position="top" style="z-index: 11;" :offset="[0, 18]" v-if="!hasNetworkConnection">
        <q-btn
          round
          icon="wifi_off"
          size="lg"
          color="grey"
        />
      </q-page-sticky>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import SwitchEndpoint from './../components/switch-endpoint'
import ListSubnets from './../components/list-subnets'
import ListBlockchains from './../components/list-blockchains'
import SelectNetworkDropdown from './../components/items/select-network-dropdown'

export default {
  name: 'MainLayout',
  components: {
    ListSubnets,
    SwitchEndpoint,
    ListBlockchains,
    SelectNetworkDropdown
  },
  computed: {
    ...mapGetters(['hasNetworkConnection'])
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
      switchNet: '#target-el',
      filter: '',
      drawer: false,
      isB: false,
      isS: false,
      isE: false
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
    },
    search () {
      this.$router.push(`/search/${this.filter}`)
    }
  }
}
</script>

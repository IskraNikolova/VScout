<template>
  <div>
    <div class="gt-xs q-pa-xl">
      <div class="text-bold q-pl-md">ADDRESS</div>
      <div class="text-medium text-orange text-h6 q-pl-md q-pt-md">{{ address }}</div>
      <div class="row">
        <q-card flat bordered class="col-5 q-mt-md">
          <q-card-section>
            <div class="q-mb-md text-medium">BALANCE (AVAX)</div>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">LOCKED STAKEABLE</small></span>
              <span class="on-right text-medium text-h6">{{ lockedStakeable }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">LOCKED NOT STAKEABLE</small></span>
              <span class="on-right">{{ lockedNotStakeable }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">UNLOCKED</small></span>
              <span class="on-right">{{ unlocked }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
            <q-separator class="q-mt-xs q-mb-xs" style="width: 180px;"/>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">TOTAL</small></span>
              <span class="on-right">{{ balance }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
          </q-card-section>
        </q-card>
        <div class="col-1"></div>
        <q-card flat bordered class="col-5 q-mt-md">
          <q-card-section>
            <div class="q-mb-md text-medium"><span class="text-orange">{{outputs.length}}</span> UTXOS</div>
            <q-scroll-area style="height: 150px;">
              <div v-if="outputs.length >= 1"><div v-for="(output, i) in outputs" v-bind:key="i">
                <q-card>
                  <q-card-section>
                    <div>
                      <span class="text-subtitle2"><small style="opacity: 0.8;">TYPE NAME</small></span>
                      <span class="on-right">{{ output._typeName }}</span>
                    </div>
                    <div>
                      <span class="text-subtitle2"><small style="opacity: 0.8;">TYPE ID</small></span>
                      <span class="on-right">{{ output._typeID }}</span>
                    </div>
                    <div>
                      <span class="text-subtitle2"><small style="opacity: 0.8;">AMOUNT</small></span>
                      <span class="on-right">{{ getAmount(output) }}</span>
                      <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
                    </div>
                    <div>
                      <span class="text-subtitle2"><small style="opacity: 0.8;">LOCK TIME</small></span>
                      <span class="on-right">{{ output.getLocktime() }}</span>
                    </div>
                    <div>
                      <span class="text-subtitle2"><small style="opacity: 0.8;">THRESHOLD</small></span>
                      <span class="on-right">{{ output.getThreshold() }}</span>
                    </div>
                  </q-card-section>
                </q-card>
              </div></div>
              <div v-else>NONE</div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="xs">
      <div class="text-bold q-pl-md">ADDRESS</div>
      <div class="text-medium text-orange text-h7 q-pl-md q-pt-md">{{ address }}</div>
        <q-card flat bordered class="q-mt-md">
          <q-card-section>
            <div class="q-mb-md text-medium">BALANCE (AVAX)</div>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">LOCKED STAKEABLE</small></span>
              <span class="on-right text-medium text-h6">{{ lockedStakeable }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">LOCKED NOT STAKEABLE</small></span>
              <span class="on-right">{{ lockedNotStakeable }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">UNLOCKED</small></span>
              <span class="on-right">{{ unlocked }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
            <q-separator class="q-mt-xs q-mb-xs" style="width: 180px;"/>
            <div>
              <span class="text-subtitle2"><small style="opacity: 0.8;">TOTAL</small></span>
              <span class="on-right">{{ balance }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
          </q-card-section>
        </q-card>
        <q-card flat bordered class="q-mt-md">
          <q-card-section>
            <div class="q-mb-md text-medium"><span class="text-orange">{{outputs.length}}</span> UTXOS</div>
            <q-scroll-area style="height: 150px;">
              <div v-if="outputs.length >= 1"><div v-for="(output, i) in outputs" v-bind:key="i">
                <q-card>
                  <q-card-section>
                    <div>
                      <span class="text-subtitle2"><small style="opacity: 0.8;">TYPE NAME</small></span>
                      <span class="on-right">{{ output._typeName }}</span>
                    </div>
                    <div>
                      <span class="text-subtitle2"><small style="opacity: 0.8;">TYPE ID</small></span>
                      <span class="on-right">{{ output._typeID }}</span>
                    </div>
                    <div>
                      <span class="text-subtitle2"><small style="opacity: 0.8;">AMOUNT</small></span>
                      <span class="on-right">{{ getAmount(output) }}</span>
                      <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
                    </div>
                    <div>
                      <span class="text-subtitle2"><small style="opacity: 0.8;">LOCK TIME</small></span>
                      <span class="on-right">{{ output.getLocktime() }}</span>
                    </div>
                    <div>
                      <span class="text-subtitle2"><small style="opacity: 0.8;">THRESHOLD</small></span>
                      <span class="on-right">{{ output.getThreshold() }}</span>
                    </div>
                  </q-card-section>
                </q-card>
              </div></div>
              <div v-else>NONE</div>
            </q-scroll-area>
          </q-card-section>
        </q-card>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

import {
  SET_BALANCE
} from './../../store/app/types'

import { getAvaFromnAva } from './../../utils/avax.js'
import { pChain } from './../../modules/avalanche.js'

export default {
  name: 'AddressDetails',
  watch: {
    addressBalance: function () {
      this.outputs = []
      this.getUtxos()
    }
  },
  computed: {
    ...mapGetters([
      'networkEndpoint',
      'addressBalance'
    ]),
    address: function () {
      return this.$route.params.id
    },
    balance: function () {
      if (!this.addressBalance) return 0
      return getAvaFromnAva(this.addressBalance.balance).toLocaleString()
    },
    lockedNotStakeable: function () {
      if (!this.addressBalance) return 0
      return getAvaFromnAva(this.addressBalance.lockedNotStakeable).toLocaleString()
    },
    lockedStakeable: function () {
      if (!this.addressBalance) return 0
      return getAvaFromnAva(this.addressBalance.lockedStakeable).toLocaleString()
    },
    unlocked: function () {
      if (!this.addressBalance) return 0
      return getAvaFromnAva(this.addressBalance.unlocked).toLocaleString()
    }
  },
  data () {
    return {
      outputs: []
    }
  },
  getLocktime (val) {
    if (!val) return
    return val.getLocktime()
  },
  async created () {
    await this.getUtxos()
  },
  methods: {
    getAmount (val) {
      if (!val) return
      return getAvaFromnAva(val.amountValue.toString()).toLocaleString()
    },
    async getUtxos () {
      const utxos = await pChain().getUTXOs(this.address)
      const keys = Object.keys(utxos.utxos)
      for (let i = 0; i < keys.length; i++) {
        this.outputs.push(utxos.utxos[keys[i]].output)
      }
    }
  },
  beforeDestroy () {
    this.$store.commit(SET_BALANCE, { addressBalance: {} })
    this.outputs = []
  }
}
</script>

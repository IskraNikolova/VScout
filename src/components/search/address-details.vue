<template>
  <div class="q-pa-md panel">
    <div class="text-medium text-h6 q-pl-md q-pt-md">{{ address }}</div>
      <div class="q-pl-md">
        <div class="q-mb-md q-pt-xl">
          BALANCE ({{ asset }})
          <q-btn :label="getISO(currentCurrency)" class="q-ml-md" size="xs" color="accent" v-if="!isUsd" outline @click="takeUSD" />
          <q-btn label="AVAX" class="q-ml-md" size="xs" color="accent" v-else outline @click="takeAVAX" />
        </div>
        <div>
          <span class="text-subtitle2"><small style="opacity: 0.8;">UNLOCKED</small></span>
          <span class="on-right text-h6">{{ unlocked }}</span>
          <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">{{ asset }}</span>
        </div>
        <div>
          <span class="text-subtitle2"><small style="opacity: 0.8;">LOCKED NOT STAKEABLE</small></span>
          <span class="on-right">{{ lockedNotStakeable }}</span>
          <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">{{ asset }}</span>
        </div>
        <div>
          <span class="text-subtitle2"><small style="opacity: 0.8;">LOCKED STAKEABLE</small></span>
          <span class="on-right">{{ lockedStakeable }}</span>
          <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">{{ asset }}</span>
        </div>
        <q-separator class="q-mt-xs q-mb-xs" style="width: 180px;"/>
        <div>
          <span class="text-subtitle2"><small style="opacity: 0.8;">TOTAL BALANCE</small></span>
          <span class="on-right">{{ balance }}</span>
          <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">{{ asset }}</span>
        </div>
      </div>
      <q-table
        flat
        :title="outputs.length + ' Output UTXOs'"
        :data="outputs"
        :columns="columns"
        :filter="filter"
        row-key="txID"
        class="panel"
        :pagination="pagination"
      >
        <template slot="top-left">
        </template>
        <template v-slot:top-right="props">
          <q-input
            borderless
            color="accent"
            label-color="accent"
            stack-label
            label="Filter utxos..."
            clearable v-model="filter"
          >
            <template v-slot:append>
              <q-icon name="search" color="accent" />
            </template>
          </q-input>
          <q-btn
            size="xs"
            flat round dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            class="absolute-top-right"
          />
        </template>
        <template v-slot:body="props">
          <q-tr
            :props="props"
            auto-width
          >
            <q-td
              v-for="(col) in props.cols"
              :key="col.name"
              :props="props"
            >
            <div v-if="col.name === 'amount'">
              <span>{{ col.value }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
            <!--<div v-else-if="col.name === 'txID'">
              <router-link :to="'/tx/' + col.value">{{ col.value }}</router-link>
            </div>-->
            <div v-else>{{ col.value }}</div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

import {
  SET_BALANCE
} from './../../store/app/types'

import { BinTools } from 'avalanche'
const bintools = BinTools.getInstance()

import { getAvaFromnAva, getPriceFromnAvax } from './../../utils/avax.js'
import { pChain } from './../../modules/avalanche.js'
import { currencies } from './../../utils/constants.js'
import { _getBalance } from './../../modules/network.js'

export default {
  name: 'AddressDetails',
  watch: {
    address: function () {
      this.outputs = []
      this.getUtxos()
      this.getBalance(this.address)
    }
  },
  computed: {
    ...mapGetters([
      'networkEndpoint',
      'addressBalance',
      'currentCurrency',
      'currenciesPriceList'
    ]),
    address: function () {
      return this.$route.params.id
    },
    balance: function () {
      if (!this.addressBalance) return 0
      if (!this.isUsd) {
        return getAvaFromnAva(this.addressBalance.balance)
          .toLocaleString()
      }
      return getPriceFromnAvax(this.addressBalance.balance, this.currenciesPriceList[`${this.currentCurrency}`])
        .toLocaleString()
    },
    lockedNotStakeable: function () {
      if (!this.addressBalance) return 0
      if (!this.isUsd) {
        return getAvaFromnAva(this.addressBalance.lockedNotStakeable)
          .toLocaleString()
      }
      return getPriceFromnAvax(this.addressBalance.lockedNotStakeable, this.currenciesPriceList[`${this.currentCurrency}`])
        .toLocaleString()
    },
    lockedStakeable: function () {
      if (!this.addressBalance) return 0
      if (!this.isUsd) {
        return getAvaFromnAva(this.addressBalance.lockedStakeable)
          .toLocaleString()
      }
      return getPriceFromnAvax(this.addressBalance.lockedStakeable, this.currenciesPriceList[`${this.currentCurrency}`])
        .toLocaleString()
    },
    unlocked: function () {
      if (!this.addressBalance) return 0
      if (!this.isUsd) {
        return getAvaFromnAva(this.addressBalance.unlocked)
          .toLocaleString()
      }
      return getPriceFromnAvax(this.addressBalance.unlocked, this.currenciesPriceList[`${this.currentCurrency}`])
        .toLocaleString()
    }
  },
  data () {
    return {
      pagination: {
        rowsPerPage: 5
      },
      isUsd: false,
      asset: 'AVAX',
      filter: '',
      outputs: [],
      columns: [
        {
          name: 'typeId',
          align: 'left',
          label: '#TYPE',
          field: row => row._typeID,
          headerClasses: 'text-medium'
        },
        {
          name: 'txID',
          align: 'left',
          label: 'TX',
          field: row => row.txID,
          headerClasses: 'text-medium'
        },
        {
          name: 'amount',
          align: 'left',
          label: 'AMOUNT (AVAX)',
          field: row => row.amount,
          headerClasses: 'text-medium'
        },
        {
          name: 'threshold',
          align: 'left',
          label: 'THRESHOLD',
          field: row => row.threshold,
          headerClasses: 'text-medium'
        },
        {
          name: 'locktime',
          align: 'left',
          label: 'LOCKTIME',
          field: row => row.locktime,
          headerClasses: 'text-medium'
        },
        {
          name: 'typeName',
          align: 'left',
          label: 'TYPE NAME',
          field: row => row._typeName,
          headerClasses: 'text-medium'
        }
      ]
    }
  },
  getLocktime (val) {
    if (!val) return
    return val.getLocktime()
  },
  created () {
    Promise.all([
      this.getBalance(this.address),
      this.getUtxos()
    ])
  },
  methods: {
    getISO (val) {
      if (!val) return
      return currencies[`${val}`].isoCode
    },
    getSubstrTX (val) {
      if (!val) return
      return `${val.substr(0, 15)}...${val.substr(42)}`
    },
    takeUSD () {
      this.isUsd = true
      this.asset = this.getISO(this.currentCurrency)
    },
    takeAVAX () {
      this.isUsd = false
      this.asset = 'AVAX'
    },
    getAmount (val) {
      if (!val) return
      return getAvaFromnAva(val.amountValue.toString()).toLocaleString()
    },
    async getBalance (param) {
      if (!param) return
      const res = await _getBalance({ endpoint: this.networkEndpoint.url, params: { address: param } })
      if (res.data.error) return

      const response = res.data.result

      this.$store.commit(SET_BALANCE, { addressBalance: response })
    },
    async getUtxos () {
      try {
        if (!this.address) return
        const utxos = await pChain(this.networkEndpoint.url)
          .getUTXOs([`${this.address}`])
        const keys = Object.keys(utxos.utxos)

        for (let i = 0; i < keys.length; i++) {
          const output = utxos.utxos[keys[i]].output
          const tableObj = {
            txID: '',
            _typeID: '',
            _typeName: '',
            amount: 0,
            locktime: 0,
            threshold: ''
          }

          tableObj.txID = bintools.cb58Encode(utxos.utxos[keys[i]].getTxID())
          tableObj._typeID = output._typeID
          tableObj._typeName = output._typeName
          tableObj.amount = this.getAmount(output)
          tableObj.locktime = output.getLocktime()
          tableObj.threshold = output.getThreshold()
          this.outputs.push(tableObj)
        }
      } catch (err) {
      }
    }
  },
  beforeDestroy () {
    this.$store.commit(SET_BALANCE, { addressBalance: {} })
    this.outputs = []
  }
}
</script>

<template>
  <div class="q-pa-md">
    <div class="text-medium text-orange text-h6 q-pl-md q-pt-md">{{ address }}</div>
      <div class="q-pl-md">
        <div class="q-mb-md q-pt-xl">
          BALANCE ({{ asset }})
          <q-btn label="USD" class="q-ml-md" size="xs" color="accent" v-if="!isUsd" outline @click="takeUSD" />
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
        :title="outputs.length + ' UTXOs'"
        :data="outputs"
        :columns="columns"
        :filter="filter"
        row-key="nodeID"
        :pagination="pagination"
      >
        <template slot="top-left">
        </template>
        <template v-slot:top-right="props">
          <q-input
            borderless
            color="accent"
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
            color="grey"
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
              style="padding: 0px!important;margin:0px!important;"
            >
            <div v-if="col.name === 'amount'">
              <span>{{ col.value }}</span>
              <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
            </div>
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

import { getAvaFromnAva, getUsdFromnAvax } from './../../utils/avax.js'
import { pChain } from './../../modules/avalanche.js'
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
      'avaxUsdPrice'
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
      return getUsdFromnAvax(this.addressBalance.balance, this.avaxUsdPrice)
        .toLocaleString()
    },
    lockedNotStakeable: function () {
      if (!this.addressBalance) return 0
      if (!this.isUsd) {
        return getAvaFromnAva(this.addressBalance.lockedNotStakeable)
          .toLocaleString()
      }
      return getUsdFromnAvax(this.addressBalance.lockedNotStakeable, this.avaxUsdPrice)
        .toLocaleString()
    },
    lockedStakeable: function () {
      if (!this.addressBalance) return 0
      if (!this.isUsd) {
        return getAvaFromnAva(this.addressBalance.lockedStakeable)
          .toLocaleString()
      }
      return getUsdFromnAvax(this.addressBalance.lockedStakeable, this.avaxUsdPrice)
        .toLocaleString()
    },
    unlocked: function () {
      if (!this.addressBalance) return 0
      if (!this.isUsd) {
        return getAvaFromnAva(this.addressBalance.unlocked)
          .toLocaleString()
      }
      return getUsdFromnAvax(this.addressBalance.unlocked, this.avaxUsdPrice)
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
          name: 'index',
          label: '#',
          align: 'center',
          field: row => row.index,
          headerClasses: 'text-medium'
        },
        {
          name: 'id',
          align: 'left',
          label: 'UTXO ID',
          field: row => row.id,
          headerClasses: 'text-medium'
        },
        {
          name: 'typeId',
          align: 'center',
          label: 'TYPE ID',
          field: row => row._typeID,
          headerClasses: 'text-medium'
        },
        {
          name: 'typeName',
          align: 'center',
          label: 'TYPE NAME',
          field: row => row._typeName,
          headerClasses: 'text-medium'
        },
        {
          name: 'amount',
          align: 'center',
          label: 'AMOUNT (AVAX)',
          field: row => row.amount,
          headerClasses: 'text-medium'
        },
        {
          name: 'threshold',
          align: 'center',
          label: 'THRESHOLD',
          field: row => row.threshold,
          headerClasses: 'text-medium'
        },
        {
          name: 'locktime',
          align: 'center',
          label: 'LOCKTIME',
          field: row => row.locktime,
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
    takeUSD () {
      this.isUsd = true
      this.asset = 'USD'
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
        for (let i = 1; i <= keys.length; i++) {
          const output = utxos.utxos[keys[i]].output
          const tableObj = {
            index: 0,
            id: '',
            _typeID: '',
            _typeName: '',
            amount: 0,
            locktime: 0,
            threshold: ''
          }
          tableObj.index = i
          tableObj.id = keys[i]
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

<template>
  <q-page>
    <div style="padding: 1%;">
      <div>
        <span class="text-h6 q-pl-sm q-mb-xl text-white">{{ getPeersLength }} Peers Connected with</span> <span class="text-medium text-purple"> {{ getNodeFormat(nodeID) }}</span>
      </div>
      <div class="row q-pl-xs q-pt-md">
      <div class="col-2 text-purple">
        <div v-for="p in keys1" v-bind:key="p">
          <img v-if="p !== 'undefined'" :src="'./statics/flag/' + getCode(statics[`${p}`].code[0]) + '.png'" id="logo-s"/>
          <span v-if="p !== 'undefined'"><span>  {{ p }}</span>
          <span class="text-medium text-white"> {{ statics[`${p}`].count }}</span></span>
        </div>
      </div>
      <div class="8 q-mt-xl" style="width: 65%;height: 350px;"><MapChart
        style="z-index: 30;"
        :countryData="peersMap"
        highColor="#aa7dc9"
        defaultCountryFillColor="#ffffff"
        legendBoxShadowCss="0px 0px 15px #fff"
        :showLegend="true"
        :currencyAdd="false"
        :showEmptyValue="true"
      /></div>
      <div class="col-2 text-purple">
        <div v-for="p in keys2" v-bind:key="p">
          <img v-if="p !== 'undefined'" :src="'./statics/flag/' + getCode(statics[`${p}`].code[0]) + '.png'" id="logo-s"/>
          <span v-if="p !== 'undefined'">  {{ p }}</span>
          <span v-if="p !== 'undefined'" class="text-medium text-white"> {{ statics[`${p}`].count }}</span>
        </div>
      </div>
      </div>
      <q-card
        class="q-pb-md q-mt-sm panel2"
        id="custom-card"
        style="min-height: 400px;"
      >
        <!--<div class="text-h7 q-pl-md q-pt-md"><q-icon name="info" color="grey" /> "Uptime" shows the stat from the perspective of the connected endpoint.</div>-->
        <q-table
          flat
          :data="peersView"
          :columns="columns"
          :filter="filter"
          row-key="id"
          class="panel2"
          color="accent"
          :pagination="pagination"
          :dark="appTheme==='dark'"
        >
        <template slot="top-left">
          <q-btn
              size="sm"
              flat
              class="q-ml-sm"
              color="panel2"
              icon-right="archive"
              label="Export to csv"
              no-caps
              @click="exportTable"
            />
          </template>
          <template v-slot:top-right="props">
            <q-input
                borderless
                color="accent"
                stack-label
                label="Filter peers..."
                clearable v-model="filter"
                :dark="appTheme==='dark'"
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
                  <span v-if="col.name === 'validator'">
                    <span v-if="col.value" class="text-purple">Yes</span>
                    <span v-else>No</span>
                  </span>
                  <span v-else-if="col.name === 'location'">
                    <img v-if="props.row !== 'undefined'" :src="'./statics/flag/' + getCode(props.row) + '.png'" id="logo-s"/> {{ col.value}}
                  </span>
                  <span v-else>{{ col.value }}</span>
                </q-td>
            </q-tr>
            </template>
        </q-table>
        </q-card>
      <div class="flex flex-center">
        <img src="~assets/vscoutlogo5.svg" id="logo">
      </div>
      <div class="flex flex-center q-mt-xl text-white">
        Made with ❤️ for builders everywhere.
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'

import MapChart from 'vue-chart-map'

import {
  groupBy,
  round
} from './../utils/commons.js'

import { datePickerFormat } from './../modules/time.js'
import { getAvaFromnAva } from './../utils/avax.js'

import {
  exportFile
} from 'quasar'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== undefined
    ? formatFn(val)
    : val
  formatted = formatted === undefined || formatted === null
    ? ''
    : String(formatted)
  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')
  return `"${formatted}"`
}

export default {
  name: 'PagePeers',
  components: {
    MapChart
  },
  watch: {
    validators: function () {
      this.peersView = this.getPeers()
    }
  },
  created () {
    this.peersView = this.getPeers()
  },
  data () {
    return {
      pagination: {
        rowsPerPage: 15
      },
      peersView: [],
      filter: '',
      columns: [
        {
          name: 'index',
          align: 'left',
          label: '#',
          field: row => `${row.index}.`,
          headerClasses: 'text-medium'
        },
        {
          name: 'id',
          align: 'left',
          label: 'NODE ID',
          field: row => `${row.nodeID}`,
          headerClasses: 'text-medium'
        },
        // {
        //   name: 'ip',
        //   align: 'left',
        //   label: 'IP',
        //   field: row => `${row.ip}`,
        //   headerClasses: 'text-medium'
        // },
        {
          name: 'validator',
          align: 'left',
          label: 'IS VALIDATOR',
          field: row => row.isValidator,
          headerClasses: 'text-medium'
        },
        {
          name: 'stake',
          align: 'left',
          label: 'STAKE (AVAX)',
          field: row => row.stake,
          headerClasses: 'text-medium'
        },
        {
          name: 'owner',
          align: 'left',
          label: 'OWNER',
          field: row => row.owner,
          headerClasses: 'text-medium'
        },
        {
          name: 'uptime',
          align: 'left',
          label: 'UPTIME',
          field: row => row.uptime,
          headerClasses: 'text-medium'
        },
        {
          name: 'version',
          align: 'left',
          label: 'VERSION',
          field: row => row.version,
          headerClasses: 'text-medium'
        },
        {
          name: 'location',
          align: 'left',
          label: 'LOCATION',
          field: row => row.country,
          headerClasses: 'text-medium'
        },
        {
          name: 'lastSent',
          align: 'left',
          label: 'LAST SENT',
          field: row => this.dateFormat(row.lastSent),
          headerClasses: 'text-medium'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'nodeID',
      'peers',
      'peersMap',
      'validators',
      'appTheme'
    ]),
    statics: function () {
      const statics = groupBy(this.peers.peers, 'country')
      Object.keys(statics).map(function (key, index) {
        statics[key] = { count: statics[key].length, code: statics[key] }
      })
      return statics
    },
    keys1: function () {
      const keys = Object.keys(this.statics)
      const index = keys.length / 2
      return keys.splice(0, index)
    },
    keys2: function () {
      const keys = Object.keys(this.statics)
      const index = keys.length / 2
      return keys.splice(index)
    },
    getPeersLength: function () {
      if (!this.peers || !this.peers.numPeers) return
      return this.peers.numPeers
    }
  },
  methods: {
    exportTable () {
      const content = [this.columns.map(col => wrapCsvValue(col.label))].concat(
        this.peersView.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === undefined ? col.name : col.field],
          col.format
        )).join(','))
      ).join('\r\n')
      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )
      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    getCode (val) {
      if (!val) return
      if (!val.countryCode) return ''
      return val.countryCode.toLowerCase()
    },
    getPeers () {
      const peersRes = []
      this.peers
        .peers.forEach((peer, i) => {
          const isValidator = this.validators
            .find(v => v.nodeID === peer.nodeID)
          const p = { ...peer }
          if (isValidator) {
            p.isValidator = true
            p.uptime = `${Math.round(Number(isValidator.uptime) * 100, 2)} %`
            p.stake = round(getAvaFromnAva(isValidator.stakeAmount), 1000).toLocaleString()
            p.owner = isValidator.rewardOwner.addresses[0]
          } else {
            p.isValidator = false
            p.uptime = ''
            p.stake = ''
            p.owner = ''
          }
          p.index = i + 1
          peersRes.push(p)
        })
      return peersRes
    },
    getNodeFormat (val) {
      if (!val) return
      return `${val.substr(0, 22)}...${val.substr(32)}`
    },
    dateFormat (date) {
      return datePickerFormat(date)
    }
  }
}
</script>
<style scoped>
 #logo {
  width: 190vw;
  max-width: 190px;
 }
</style>

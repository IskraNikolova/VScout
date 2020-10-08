<template>
  <q-page>
    <div style="padding: 1%;">
      <q-card
        class="q-mt-md q-pt-md q-pb-md"
        id="custom-card"
        style="padding-top: 3%;min-height: 400px;"
      >
        <q-btn
          @click="back"
          icon="arrow_back"
          label="Back"
          no-caps
          color="accent"
          flat
        />
        <div>
          <span class="text-h6 q-pl-md q-pt-md">Peers Connected with</span> <span class="text-medium text-orange"> {{ nodeID }}</span></div>
        <q-table
          flat
          :data="peers"
          :columns="columns"
          :filter="filter"
          row-key="id"
          :pagination="pagination"
        >
            <template slot="top-left">
             <div class="row"><div style="width: 10px; height: 10px;background-color: #aa7dc9;margin-top: 5px;margin-right: 5px;"></div> Validator</div>
            </template>
            <template v-slot:top-right="props">
            <q-input
                borderless
                color="accent"
                stack-label
                label="Filter peers..."
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
                >
                  <span v-if="props.row.isValidator" class="text-orange">{{ col.value }}</span>
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

import { datePickerFormat } from './../modules/time.js'

export default {
  name: 'PagePeers',
  components: {
  },
  data () {
    return {
      pagination: {
        rowsPerPage: 15
      },
      filter: '',
      columns: [
        {
          name: 'id',
          align: 'left',
          label: 'NODE ID',
          field: row => `[${row.nodeID}]`,
          headerClasses: 'text-medium'
        },
        {
          name: 'ip',
          align: 'center',
          label: 'IP',
          field: row => row.ip,
          headerClasses: 'text-medium'
        },
        {
          name: 'version',
          align: 'center',
          label: 'VERSION',
          field: row => row.version,
          headerClasses: 'text-medium'
        },
        {
          name: 'lastSent',
          align: 'center',
          label: 'LAST SENT',
          field: row => this.dateFormat(row.lastSent),
          headerClasses: 'text-medium'
        },
        {
          name: 'lastReceived',
          align: 'center',
          label: 'LAST RECEIVED',
          field: row => this.dateFormat(row.lastReceived),
          headerClasses: 'text-medium'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'nodeInfo',
      'nodeID',
      'validators'
    ]),
    peers: function () {
      const peersRes = []
      this.nodeInfo
        .peers.forEach(peer => {
          const isValidator = this.validators.find(v => v.nodeID === peer.nodeID)
          const p = { ...peer }
          p.isValidator = isValidator !== undefined
          peersRes.push(p)
        })
      return peersRes
    }
  },
  methods: {
    dateFormat (date) {
      return datePickerFormat(date)
    },
    back () {
      this.$router.push('/')
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

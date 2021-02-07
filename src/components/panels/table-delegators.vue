<template>
  <div class="q-mt-md panel2">
    <q-table
      :data="curentDelegators"
      :columns="columns"
      :filter="filter"
      row-key="rewardOwner"
      :pagination="pagination"
      :visible-columns="visibleColumns"
      :class="tableClass + ' panel2'"
      id="custom-table"
      color="accent"
      :dark="appTheme==='dark'"
    >
      <template slot="top-left">
        <q-btn
          size="xs"
          v-if="!isNotSticky"
          class="text-accent"
          flat
          icon="push_pin"
          @click="isNotSticky=!isNotSticky"
        >
          <tooltip-style v-bind:text="textStickyNegative" />
        </q-btn>
        <q-btn
          size="xs"
          v-else
          flat
          icon="push_pin"
          @click="isNotSticky=!isNotSticky"
        >
          <tooltip-style v-bind:text="textStickyPositive" />
        </q-btn>
        <q-btn-toggle
          v-model="type"
          flat
          size="xs"
          toggle-color="accent"
          @click.native="onGetDelegators"
          :options="[
            {label: 'Active', value: 'active'},
            {label: 'Pending', value: 'pending'}
          ]"
        />|
        <q-btn-toggle
          v-model="type2"
          flat
          size="xs"
          toggle-color="panel"
          @click.native="onSwitchAccounts"
          :options="[
            {label: 'Validators', value: 'validators'},
            {label: 'Delegations', value: 'delegators'}
          ]"
        />
      </template>
      <template slot="top-left">
        <small><div class="col" style="margin-top: 20px; margin-bottom: 10px;">
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="duration" label="Duration" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="startTime" label="Start Time" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="endTime" label="End Time" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="progress" label="Progress" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="remainingTime" label="Countdown" />
        </div></small>
      </template>
      <template v-slot:header-cell-index="props">
        <q-th :props="props">
          <q-icon
            size="2.0em"
            name="group"
          />
        </q-th>
      </template>
      <template v-slot:top-right="props">
        <q-input
          :dark="appTheme==='dark'"
          borderless
          color="accent"
          stack-label
          label-color="accent"
          label="Filter delegations..."
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
          style="cursor: pointer;"
          auto-width
        >
          <q-td
            v-for="(col) in props.cols"
            :key="col.name"
            :props="props"
            id="custom-td"
          >
            <div v-if="col.name === 'rewardOwner'" class="row q-ml-xs" @click="props.expand = !props.expand">
              <img :src="props.row.avatar" class="avatar" />
              <div
                class="q-pt-sm q-ml-sm">
                {{ getFormatOwner(col.value) }}
              </div>
            </div>
            <div v-else-if="col.name === 'progress'">
              <progress-bar-validate-session
                v-bind:startTime="props.row.startTime"
                v-bind:endTime="props.row.endTime"
              />
            </div>
            <div v-else-if="col.name === 'stake' || col.name === 'potentialReward'">
              {{ col.value }}
              <span class="text-accent text-medium">
                <small> AVAX</small>
              </span>
            </div>
            <countdown
              class="row"
              v-bind:countdown="col.value"
              v-bind:color="'#86b9b0'"
              v-else-if="col.name === 'remainingTime'"
              style="min-width: 180px;"
            />
            <div v-else>
              {{ col.value }}
            </div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <details-delegator v-bind:delegator="props.row" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  copyToClipboard
} from 'quasar'

import { date } from './../../modules/time.js'
const humanizeDuration = require('humanize-duration')
import { round } from './../../utils/commons.js'
import { getAvaFromnAva } from './../../utils/avax.js'

import ProgressBarValidateSession from './../progress-bar-validatе-session'

import { UPDATE_UI } from './../../store/ui/types'

export default {
  name: 'TableDelegators',
  components: {
    Countdown: () => import('components/items/countdown'),
    DetailsDelegator: () => import('components/details-delegator'),
    TooltipStyle: () => import('components/tooltip-style'),
    ProgressBarValidateSession
  },
  watch: {
    isNotSticky: function (val) {
      if (val) {
        this.tableClass = ''
      } else {
        if (this.appTheme === 'default') this.tableClass = 'sticky-header-table-light'
        else this.tableClass = 'sticky-header-table-dark'
      }
    },
    appTheme: function (val) {
      if (val === 'default' && this.isNotSticky) this.tableClass = ''
      else if (val === 'default' && !this.isNotSticky) this.tableClass = 'sticky-header-table-light'
      else if (val === 'dark' && this.isNotSticky) this.tableClass = ''
      else this.tableClass = 'sticky-header-table-dark'
    },
    curentDelegators: function (newDelegators, oldDelegators) {
      if (newDelegators.length !== oldDelegators.length) {
        this.visibleColumns = this.getVisibleColumns(this.curentDelegators)
      }
    }
  },
  data () {
    return {
      filter: '',
      isActive: true,
      isNotSticky: true,
      type: 'active',
      type2: 'delegators',
      pagination: {
        rowsPerPage: 15
      },
      border: '#87C5D6',
      columns: [
        {
          name: 'index',
          label: '#',
          align: 'left',
          field: row => row.index,
          headerClasses: 'text-medium'
        },
        {
          name: 'rewardOwner',
          align: 'left',
          label: 'REWARD OWNER',
          field: row => this.getRewardOwnerFormat(row.rewardOwner),
          headerClasses: 'text-medium'
        },
        {
          name: 'nodeID',
          align: 'left',
          label: 'NODE ID',
          field: row => row.nodeID,
          style: 'font-size: 12px;',
          headerClasses: 'text-medium'
        },
        {
          name: 'stake',
          align: 'left',
          label: 'DELEGATED',
          field: row => Number(row.stakeAmount),
          format: (val, row) => `${this.getFormatReward(row.stakeAmount)}`,
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'duration',
          align: 'left',
          label: 'DURATION',
          field: row => Number(row.duration),
          format: (val, row) => `${this.getDurationL(val)}`,
          style: 'font-size: 85%;',
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'startTime',
          align: 'left',
          label: 'START TIME',
          field: row => row.startTime,
          format: (val, row) => `${this.formatDate(row.startTime, 'll')}`,
          style: 'font-size: 13px;',
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'endTime',
          align: 'left',
          label: 'END TIME',
          field: row => row.endTime,
          format: (val, row) => `${this.formatDate(row.endTime, 'll')}`,
          style: 'font-size: 13px;',
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'progress',
          align: 'left',
          label: 'Progress (%)',
          field: 'progress',
          headerClasses: 'text-medium'
        },
        {
          name: 'remainingTime',
          align: 'center',
          label: 'COUNTDOWN',
          field: row => row.remainingTime,
          headerClasses: 'text-medium'
        }
      ],
      textStickyPositive: 'Sticky header',
      textStickyNegative: 'Remove a sticky header',
      tableClass: '',
      visibleColumns: []
    }
  },
  created () {
    this.visibleColumns = this.getVisibleColumns(this.curentDelegators)
  },
  computed: {
    ...mapGetters([
      'nodeID',
      'appTheme',
      'delegators',
      'pendingDelegators'
    ]),
    curentDelegators: function () {
      if (this.isActive) return this.delegators
      return this.pendingDelegators
    }
  },
  methods: {
    getVisibleColumns (curentDelegators) {
      const columns = this.columns.map(c => c.name)
      if (curentDelegators.find(a => !a.rewardOwner)) {
        return columns
          .filter(c =>
            c !== 'rewardOwner' &&
            c !== 'index' &&
            c !== 'progress' &&
            c !== 'potentialReward')
      }
      return columns
        .filter(c =>
          c !== 'endTime' &&
          c !== 'progress')
    },
    getDurationL (val) {
      return humanizeDuration(val, {
        units: ['d'],
        round: true
      })
    },
    getFormatOwner (val) {
      if (!val) return
      if (val.length > 20) return `${val.substr(0, 20)}...${val.substr(28)}`
      return val
    },
    getColor (nodeID) {
      const color = this.intToRGB(this.hashCode(nodeID))
      return color
    },
    hashCode (str) {
      let hash = 0
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }
      return hash
    },
    intToRGB (i) {
      const c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase()

      return '00000'.substring(0, 6 - c.length) + c
    },
    getRewardOwnerFormat (val) {
      if (!val) return
      return val.addresses[0]
    },
    copyToClipboard (id) {
      if (!id) return

      copyToClipboard(id)
      this.$q.notify({
        message: 'Copied to clipboard!',
        color: 'white',
        textColor: 'black',
        position: 'center',
        timeout: 1000
      })
    },
    onGetDelegators () {
      const temp = {
        active: () => { this.isActive = true },
        pending: () => { this.isActive = false }
      }
      temp[this.type]()
    },
    onSwitchAccounts () {
      const temp = {
        validators: true,
        delegators: false
      }
      this.$store.commit(UPDATE_UI, {
        typeAccount: {
          isValidators: temp[this.type2]
        }
      })
    },
    getFormatReward (val) {
      if (!val) return 0
      const avax = getAvaFromnAva(val)
      return round(avax, 100)
        .toLocaleString()
    },
    formatDate (time) {
      if (!time) return
      return date(time)
    }
  }
}
</script>
<style scoped>
 #custom-table {
   border-right: 2px solid #86b9b0;
 }
 #custom-td {
  padding-top: 0px!important;
  padding-bottom: 0px!important;
  height: 50px!important;
}
</style>
<style lang="sass">
.sticky-header-table-light
  /* height or max-height is important */
  max-height: 610px
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #ffffff
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
.sticky-header-table-dark
  /* height or max-height is important */
  max-height: 610px
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #3f424a
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>

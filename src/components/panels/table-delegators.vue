<template>
  <div class="q-mt-md panel">
    <q-table
      :data="curentDelegators"
      :columns="columns"
      :filter="filter"
      row-key="nodeID"
      :pagination="pagination"
      :visible-columns="visibleColumns"
      :class="tableClass + ' panel'"
      id="custom-table"
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
      <template v-slot:header-cell-index="props">
        <q-th :props="props">
          <q-icon
            style="margin-left: 13px;"
            size="2.0em"
            name="group"
          />
        </q-th>
      </template>
      <template v-slot:top-right="props">
        <q-input
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
          @click="props.expand = !props.expand"
        >
          <q-td
            v-for="(col) in props.cols"
            :key="col.name"
            :props="props"
            style="padding: 0px!important;margin:0px!important;"
          >
            <div v-if="col.name === 'rewardOwner'" class="row q-ml-xs">
              <q-avatar size="25px">
                <img :src="props.row.avatar" />
              </q-avatar>
              <div
                style="font-size: 90%;"
                class="q-pt-xs q-ml-xs">
                {{ col.value }}
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
            <div v-else class="q-pl-md">
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
    DetailsDelegator: () => import('components/details-delegator'),
    TooltipStyle: () => import('components/tooltip-style'),
    ProgressBarValidateSession
  },
  watch: {
    isNotSticky: function (val) {
      if (!val) this.tableClass = 'sticky-header-table'
      // else this.tableClass = 'light-background shadow-3 sticky-header-table'
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
          align: 'center',
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
          field: row => `[${row.nodeID}]`,
          style: 'font-size: 12px;',
          headerClasses: 'text-medium'
        },
        {
          name: 'stake',
          align: 'center',
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
          style: 'font-size: 10px;',
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'endTime',
          align: 'left',
          label: 'END TIME',
          field: row => row.endTime,
          format: (val, row) => `${this.formatDate(row.endTime, 'll')}`,
          style: 'font-size: 10px;',
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'progress',
          align: 'left',
          label: 'Progress (%)',
          field: 'progress',
          headerClasses: 'text-medium'
        }
      ],
      textStickyPositive: 'Sticky header',
      textStickyNegative: 'Remove a sticky header',
      tableClass: ''
    }
  },
  computed: {
    ...mapGetters([
      'nodeID',
      'delegators',
      'pendingDelegators'
    ]),
    curentDelegators: function () {
      if (this.isActive) return this.delegators
      return this.pendingDelegators
    },
    visibleColumns: function () {
      const columns = this.columns.map(c => c.name)
      if (this.curentDelegators.find(a => !a.rewardOwner)) {
        return columns
          .filter(c =>
            c !== 'rewardOwner' &&
            c !== 'index' &&
            c !== 'potentialReward')
      }
      return columns
    }
  },
  methods: {
    getDurationL (val) {
      return humanizeDuration(val, {
        units: ['d'],
        round: true
      })
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
      this.$emit('getDelegators', this.type)
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
   border-right: 2px solid #87C5D6;
 }
</style>
<style lang="sass">
.sticky-header-table
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
</style>

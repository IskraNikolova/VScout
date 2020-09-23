<template>
  <div class="q-mt-md">
    <q-table
      :data="curentVal"
      :columns="columns"
      :filter="filter"
      row-key="index"
      :visible-columns="visibleColumns"
      :pagination="pagination"
      class="light-background shadow-3"
      id="custom-table"
    >
    <template v-slot:header-cell-delegate="props">
      <q-th :props="props">
        <q-icon
          size="4.5em"
          name="img:statics/delegate.png"
        />
      </q-th>
    </template>
      <template slot="top-left">
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
          toggle-color="orange"
          @click.native="onSwitchAccounts"
          :options="[
            {label: 'Validators', value: 'validators'},
            {label: 'Delegations', value: 'delegations'}
          ]"
        />
      </template>
      <template v-slot:header-cell-index="props">
        <q-th :props="props">
          <q-icon
            size="2.0em"
            class="q-pl-xs"
            name="img:statics/delegate.png"
          />
        </q-th>
      </template>
      <template slot="top-right" v-if="!isGrid">
        <q-input
          borderless
          color="accent"
          stack-label
          label="Filter delegations..."
          clearable v-model="filter"
        >
          <template v-slot:append>
            <q-icon name="search" color="accent" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" style="cursor: pointer;" auto-width @click="props.expand = !props.expand">
          <q-td
            v-for="(col) in props.cols"
            :key="col.name"
            :props="props"
            style="padding: 0px!important;margin:0px!important;"
          >
            <div v-if="col.name === 'rewardOwner'" class="row q-pl-md">
              <q-avatar size="25px">
                <img :src="props.row.avatar" />
              </q-avatar>
              <div
                style="font-size: 90%;"
                class="q-pt-xs q-ml-md">
                {{ col.value }}
              </div>
            </div>
            <div v-else-if="col.name === 'progress'">
              <progress-bar-validate-session
                v-bind:startTime="props.row.startTime"
                v-bind:endTime="props.row.endTime"
              />
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
  openURL,
  copyToClipboard
} from 'quasar'

import { date } from './../../modules/time.js'
import { UPDATE_UI } from './../../store/ui/types'

import ProgressBarValidateSession from './../progress-bar-validatе-session'

export default {
  name: 'TableDelegators',
  components: {
    DetailsDelegator: () => import('components/details-delegator'),
    ProgressBarValidateSession
  },
  data () {
    return {
      type: 'active',
      type2: 'delegations',
      isGrid: false,
      isActive: true,
      filter: '',
      pagination: {
        rowsPerPage: 20
      },
      border: '#87C5D6',
      separator: 'cell',
      columns: [
        {
          name: 'index',
          label: '#',
          align: 'center',
          field: row => row.index
        },
        {
          name: 'rewardOwner',
          align: 'left',
          label: 'Reward Owner',
          field: row => `${this.getRewardOwnerFormat(row.rewardOwner)}`
        },
        {
          name: 'nodeId',
          align: 'left',
          label: 'Delegated Node ID',
          field: row => `[${row.nodeId}]`,
          style: 'font-size: 12px;'
        },
        {
          name: 'stake',
          align: 'left',
          label: 'Delegated (AVAX)',
          field: row => `${row.stake.toLocaleString()} AVAX`,
          sortable: true
        },
        {
          name: 'startTime',
          align: 'left',
          label: 'Start Time',
          field: row => this.formatDate(row.startTime),
          style: 'font-size: 10px;',
          sortable: true
        },
        {
          name: 'endTime',
          align: 'left',
          label: 'End Time',
          field: row => this.formatDate(row.endTime),
          style: 'font-size: 10px;',
          sortable: true
        },
        { name: 'progress', align: 'left', label: 'Progress (%)', field: 'progress' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'nodeID',
      'delegators',
      'pendingDelegators'
    ]),
    curentVal: {
      get: function () {
        if (this.isActive) return this.delegators
        return this.pendingDelegators
      }
    },
    visibleColumns: function () {
      const columns = this.columns.map(c => c.name)
      if (this.curentVal.find(a => !a.rewardOwner)) {
        return columns.filter(c => c !== 'rewardOwner')
      }

      return columns
    }
  },
  methods: {
    onClick (props) {
      if (!props.row.link) return
      try {
        openURL(props.row.link)
      } catch (err) {
      }
    },
    getRewardOwnerFormat (val) {
      if (!val) return
      return `${val.addresses[0].substr(0, 15)}...${val.addresses[0].substr(30)}`
    },
    getLocalString (val) {
      if (val) return val.toLocaleString()
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
        delegations: false
      }
      this.$store.commit(UPDATE_UI, {
        typeAccount: {
          isValidators: temp[this.type2]
        }
      })
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
 .container_row{
  display: grid;
}

.layer1, .layer2{
  grid-column: 1;
  grid-row: 1;
}

</style>

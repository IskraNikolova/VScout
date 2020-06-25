<template>
  <div class="q-mt-md">
    <q-table
      :data="curentVal"
      :columns="columns"
      :separator="separator"
      :filter="filter"
      row-key="index"
      :pagination="pagination"
      class="light-background shadow-3"
      id="custom-table"
    >
    <template v-slot:header-cell-delegate="props">
      <q-th :props="props">
        <q-icon
          size="3.0em"
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
            {label: 'Delegators', value: 'delegators'}
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
          label="Filter delegatorss..."
          clearable v-model="filter"
        >
          <template v-slot:append>
            <q-icon name="search" color="accent" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" auto-width>
          <q-td
            v-for="(col) in props.cols"
            :key="col.name"
            :props="props"
            style="padding: 0px!important;margin:0px!important;"
          >
            <div v-if="col.name === 'pAccount'" class="row q-pl-md">
              <q-avatar size="25px">
                <img :src="props.row.avatar" />
              </q-avatar>
              <div
                style="font-size: 90%;"
                class="q-pt-xs q-ml-md">
                {{ props.row.pAccount}}
              </div>
            </div>
            <div v-else-if="col.name === 'index'">
              {{ col.value }}
            </div>
            <div v-else-if="col.name === 'progress'">
              <progress-bar-validate-session
                v-bind:startTime="props.row.startTime"
                v-bind:endTime="props.row.endTime"
              />
            </div>
            <div v-else-if="col.name === 'stake'" class="q-pl-md">
              <div>
                {{ col.value }}
                <small style="color: grey;">
                  ({{ getLocalString(props.row.stakenAva)}} nAvax)
                </small>
              </div>
            </div>
            <div v-else-if="col.name === 'startTime'" class="q-pl-md">
              <small>{{ formatDate(col.value) }}</small>
            </div>
            <div v-else-if="col.name === 'endTime'" class="q-pl-md">
              <small>{{ formatDate(col.value) }}</small>
            </div>
            <div v-else class="q-pl-md">
              <small>{{ col.value }}</small>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { date } from './../../modules/time'
import { copyToClipboard, openURL } from 'quasar'
import { UPDATE_UI } from './../../store/ui/types'
import ProgressBarValidateSession from './../progress-bar-validatе-session'

export default {
  name: 'TableDelegators',
  components: {
    ProgressBarValidateSession
  },
  data () {
    return {
      type: 'active',
      type2: 'delegators',
      curentValidators: [],
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
          name: 'pAccount',
          align: 'left',
          label: 'DELEGATOR (P-Chain Account)',
          field: 'pAccount'
        },
        {
          name: 'nodeId',
          align: 'left',
          label: 'VALIDATOR (Node ID)',
          field: 'nodeId'
        },
        {
          name: 'stake',
          align: 'left',
          label: 'STAKE (AVAX / nAvax)',
          field: row => row.stake > 1 ? row.stake.toLocaleString() : row.stake,
          sortable: true
        },
        { name: 'startTime', align: 'left', label: 'START TIME', field: 'startTime', sortable: true },
        { name: 'endTime', align: 'left', label: 'END TIME', field: 'endTime', sortable: true },
        { name: 'progress', align: 'left', label: 'PROGRESS (%)', field: 'progress' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'nodeID',
      'delegators',
      'networkEndpoint',
      'pendingDelegators',
      'isDefaultSubnetID'
    ]),
    curentVal: {
      get: function () {
        if (this.isActive) return this.delegators
        return this.pendingDelegators
      }
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
    getLocalString (val) {
      if (!val) return val
      return val.toLocaleString()
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

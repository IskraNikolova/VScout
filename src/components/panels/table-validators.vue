<template>
  <div class="q-mt-md">
    <q-table
      :data="curentValidators"
      :columns="columns"
      row-key="rank"
      :separator="separator"
      :filter="filter"
      :pagination="pagination"
      :grid="isGrid"
      class="light-background shadow-3"
      id="custom-table"
      :visible-columns="visibleColumns"
      :loading="visible"
    >
      <template v-slot:header-cell-delegate="props">
        <q-th :props="props">
          <q-icon name="img:statics/delegate.png" size="3.0em" />
        </q-th>
      </template>
      <template slot="top-left" v-if="isActive && curentValidators.length < 1">
         <q-btn size="xs" outline label="Load For Default Subnet" @click="onGetDefaultValidators"/>
      </template>
      <template slot="top-left" v-else>
        <q-btn size="xs" flat icon="apps" @click="isGrid=true"/>
        <q-btn size="xs" flat icon="reorder" @click="isGrid=false"/>
        <settings />
        <q-btn-toggle
          v-model="type"
          flat
          size="xs"
          toggle-color="accent"
          @click.native="onGetValidators"
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
        <!--<q-btn size="xs" outline label="Add Identification" icon="img:statics/id.svg" @click.native="onAddIdentification" />
        <add-identification-dialog ref="addIdentificationRef" />-->
      </template>
      <template slot="top-right" v-if="!isGrid">
        <q-input
          borderless
          color="accent"
          stack-label
          label="Filter validators..."
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
            style="padding: 0px!important;height: 50px!important;"
          >
            <div v-if="col.name === 'validator'" class="row q-pl-md">
              <div :style="'border: solid 1px ' + border(props.row.connected) + ';border-radius: 50px;width: 30px;'">
              <q-avatar size="25px" @click="onClick(props.row.link)">
                <q-img :src="props.row.avatar">
                  <template v-slot:error>
                    <div class="bg-negative text-white">
                      ?
                    </div>
                </template>
                </q-img>
              </q-avatar>
              </div>
              <div
                v-if="props.row.name !== props.row.nodeID"
                style="cursor:pointer;"
                class="q-pt-xs q-ml-md"
                @click="props.expand = !props.expand">
                {{ props.row.name}}
                <div class="text-grey">({{ props.row.nodeID }})</div>
              </div>
              <div
                v-else
                style="cursor:pointer;"
                @click="props.expand = !props.expand"
                class="q-pl-xs q-pt-xs"
              >
                {{ props.row.nodeID.substr(0, 14) }} ... {{ props.row.nodeID.substr(35) }}
              </div>
            </div>
            <div v-else-if="col.name === 'stake'">
              <div>
                <small class="text-grey">Total:</small> {{ props.row.total > 1 ? props.row.total.toLocaleString() : props.row.total }}
              </div>
              <div>
                <small class="text-grey">Own: </small> <span class="text-orange">{{ col.value }}</span>
                <small class="text-grey"> D: {{ getFormatDS(props.row.delegateStake) }}</small>
              </div>
            </div>
            <div v-else-if="col.name === 'weight'">
              {{ col.value }}
              <q-tooltip content-class="bg-white text-grey" content-style="font-size: 12px">Weight is the validator’s weight used for sampling.</q-tooltip>
            </div>
            <div v-else-if="col.name === 'percent'">
              <div class="container_row" v-if="props.row.cumulativeStake">
                <div
                  class="layer1"
                  :style="'border-radius:0px 15px 0px 0px;height: 50px;width:' + props.row.cumulativeStake + '%;background: rgb(50,53,59);background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(50,53,59,1) ' + (props.row.cumulativeStake - props.row.percent) / 5 + '%, rgba(255,96,0,1) 95%);'">
                </div>
                <div class="layer2">
                  <q-linear-progress
                    size="49px"
                    :value="(props.row.cumulativeStake - props.row.percent) / 100"
                    :buffer="(props.row.cumulativeStake - props.row.percent) / 100"
                    style="opacity:0.6;border-radius:0px 15px 0px 0px;"
                    color="grey">
                    <div
                      class="absolute-full text-bold text-black"
                      style="font-size: 15px;margin-top: 6%;"
                    >
                      {{props.row.cumulativeStake}} %
                    </div>
                  </q-linear-progress>
                </div>
              </div>
            </div>
            <div v-else-if="col.name === 'progress'">
              <progress-bar-validate-session
                v-bind:startTime="props.row.startTime"
                v-bind:endTime="props.row.endTime"
              />
            </div>
            <div v-else>{{ col.value }}</div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <details-validator v-bind:validator="props.row" />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:item="props">
        <div style="max-width: 400px;width: 100%;margin:auto;margin-bottom: 5px;">
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar style="cursor:pointer;" @click="onClick(props.row.link)">
                <q-avatar>
                  <q-img :src="props.row.avatar">
                    <template v-slot:error>
                      <div>
                        ?
                      </div>
                    </template>
                  </q-img>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label >
                  <small>Rank </small>
                  <span class="text-accent">
                    {{ props.row.rank }}
                  </span>
                </q-item-label>
                <q-item-label>
                  <span style="cursor:pointer;" @click="onClick(props.row.link)">{{ props.row.name }} <small v-if="props.row.name !== props.row.nodeID" class="text-grey">({{props.row.nodeID}})</small></span>
                  <small>
                    <q-icon
                      @click="copyToClipboard(props.row.nodeID)"
                      color="grey"
                      name="file_copy"
                    />
                  </small>
                </q-item-label>
                <q-item-label v-if="props.row.address">
                  <small class="text-grey">
                    Owner ({{ props.row.address.substr(0, 12)}} ... {{ props.row.address.substr(22) }})
                    <q-icon
                      @click="copyToClipboard(props.row.address)"
                      color="grey"
                      name="file_copy"
                    />
                  </small>
                </q-item-label>
                <q-item-label v-if="props.row.weight">
                  <small class="text-grey">
                    Weight: <span class="text-accent">{{ props.row.weight }}</span>
                  </small>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section horizontal>
              <q-card-section class="col-6 q-mb-xl">
                <div class="text-medium q-mb-md">Stake (AVAX)</div>
                <small class="text-grey">Own</small>
                {{ props.row.stake > 1 ? getLocalString(props.row.stake) : props.row.stake }}
                <div>
                  <small class="text-grey">Delegated</small>
                  {{ props.row.delegateStake }}
                </div>
                <q-separator />
                <div>
                  <small class="text-grey">Total</small>
                  {{ props.row.total > 1 ? props.row.total.toLocaleString() : props.row.total }}
                  <small class="text-accent">$AVAX</small>
                </div>
                <div class="text-medium q-mt-md">Network Share (%)</div>
                <span class="text-orange q-pl-xs" v-if="props.row.percent !== 'NaN'">
                  {{ props.row.percent }} %
                </span>
                <div class="text-medium q-mt-md">Staked By</div>
                <div class="text-grey">
                  <small>{{ props.row.fromNowST }}</small>
                </div>
              </q-card-section>
              <q-separator vertical />
              <q-card-section class="col-6">
                <cumulative-stake-chart
                  v-if="props.row.cumulativeStake"
                  v-bind:name="props.row.nodeID"
                  v-bind:percent="props.row.percent"
                  v-bind:percentAll="props.row.cumulativeStake ? props.row.cumulativeStake : NaN"
                /><div v-else> - </div>
              </q-card-section>
            </q-card-section>
            <q-card-section style="margin-top: -50px;"><div class="text-grey text-medium">Progress (%)</div>
            <progress-bar-validate-session
              v-bind:startTime="props.row.startTime"
              v-bind:endTime="props.row.endTime"
            /></q-card-section>
            <q-separator />
            <q-card-section horizontal>
              <q-card-section class="col-6">
                <small class="text-grey text-bold">Start Time</small>
                <br />
                <small>{{ formatDate(props.row.startTime) }}</small>
              </q-card-section>
              <q-separator vertical/>
              <q-card-section class="col-6">
                <small class="text-grey text-bold">End Time</small>
                <br />
                <small>{{ formatDate(props.row.endTime) }}</small>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  copyToClipboard,
  openURL
} from 'quasar'

import { date } from './../../modules/time.js'
import { round } from './../../utils/commons.js'
const { network } = require('./../../modules/config').default
import { UPDATE_UI } from './../../store/ui/types.js'

import { SET_SUBNET_ID } from './../../store/app/types.js'

export default {
  name: 'TableItem',
  components: {
    Settings: () => import('components/panels/settings'),
    DetailsValidator: () => import('components/details-validator'),
    CumulativeStakeChart: () => import('components/cumulative-stake-chart'),
    // AddIdentificationDialog: () => import('components/dialogs/add-identification-dialog'),
    ProgressBarValidateSession: () => import('components/progress-bar-validatе-session')
  },
  data () {
    return {
      filter: '',
      visible: false,
      type: 'active',
      type2: 'validators',
      isGrid: false,
      isActive: true,
      pagination: {
        rowsPerPage: 21
      },
      separator: 'cell',
      columns: [
        {
          name: 'rank',
          label: 'Rank',
          align: 'center',
          field: row => row.rank,
          sortable: true,
          style: 'width: 50px',
          headerClasses: 'text-medium'
        },
        {
          name: 'validator',
          align: 'center',
          label: 'Validator',
          field: row => row.name,
          headerClasses: 'text-medium'
        },
        {
          name: 'stake',
          align: 'center',
          label: 'Stake (AVAX)',
          field: row => row.stake > 1 ? row.stake.toLocaleString() : row.stake,
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'weight',
          align: 'center',
          label: 'Weight',
          field: row => row.weight,
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'networkShare',
          align: 'center',
          label: 'Network Share (%)',
          field: row => ` ${row.percent} %`,
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'percent',
          align: 'center',
          label: 'Cumulative Stake (%)',
          field: 'cumulativeStake',
          headerClasses: 'text-medium'
        },
        {
          name: 'delegationFee',
          align: 'center',
          label: 'Delegation Fee (%)',
          field: row => `${row.delegationFee} %`,
          headerClasses: 'text-medium'
        },
        {
          name: 'uptime',
          align: 'center',
          label: 'Up Time (%)',
          field: row => `${Math.round(row.uptime * 100, 2)} %`,
          headerClasses: 'text-medium'
        },
        {
          name: 'startTime',
          align: 'center',
          label: 'Start Time',
          field: row => this.formatDate(row.startTime),
          sortable: true,
          headerClasses: 'text-medium'
        },
        { name: 'progress', align: 'left', label: 'Progress (%)', field: 'progress', headerClasses: 'text-medium' }
      ]
    }
  },
  created () {
    this.visible = true
    const i = setInterval(() => {
      if (this.validators.length > 0) {
        this.visible = false
        clearInterval(i)
      }
    }, 500)
  },
  computed: {
    ...mapGetters([
      'nodeID',
      'validators',
      'pendingValidators'
    ]),
    isYourNode: function (id) {
      return id === this.nodeID
    },
    curentValidators: {
      get: function () {
        if (this.isActive) return this.validators
        return this.pendingValidators
      }
    },
    visibleColumns: function () {
      const columns = this.columns.map(c => c.name)
      if (this.curentValidators.find(a => a.percent === 'NAN' || !a.percent)) {
        return columns.filter(c => c !== 'percent' && c !== 'networkShare' && c !== 'weight' && c !== 'uptime')
      } else if (this.curentValidators.find(a => a.weight < 1)) {
        return columns.filter(c => c !== 'weight')
      } else if (this.curentValidators.find(a => a.weight > 0)) {
        return columns.filter(c => c !== 'uptime' && c !== 'delegationFee')
      }

      return columns.filter(c => c !== 'stake')
    }
  },
  methods: {
    getFormatDS (val) {
      if (!val) return 0

      return round(val, 100).toLocaleString()
    },
    border (isConnected) {
      if (isConnected) return '#87C5D6'
      else return '#ff5252'
    },
    onClick (link) {
      if (link) openURL(link)
    },
    onDelegate (validator) {
      this.$refs
        .delegateValidatorDialog
        .openDelegate(validator)
    },
    getLocalString (val) {
      if (val) return val.toLocaleString()
    },
    onAddIdentification () {
      this.$refs.addIdentificationRef.openAddId()
    },
    copyToClipboard (id) {
      copyToClipboard(id)
      this.$q.notify({
        message: 'Copied to clipboard!',
        color: 'white',
        textColor: 'black',
        position: 'center',
        timeout: 1000
      })
    },
    onGetValidators () {
      const temp = {
        active: () => { this.isActive = true },
        pending: () => { this.isActive = false }
      }
      temp[this.type]()
      this.$emit('getValidators', this.type)
    },
    onGetDefaultValidators () {
      this.$store.commit(SET_SUBNET_ID, { subnetID: network.defaultSubnetID })
      this.$emit('getDefaultValidators')
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
      if (time) return date(time)
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

.layer1, .layer2, .layer3{
  grid-column: 1;
  grid-row: 1;
}
</style>

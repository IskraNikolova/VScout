<template>
  <div class="q-mt-md">
    <q-table
      :data="curentValidators"
      :columns="columns"
      row-key="rank"
      :filter="filter"
      :pagination="pagination"
      :grid="isGrid"
      :class="tableClass"
      id="custom-table"
      :visible-columns="visibleColumns"
      :loading="visible"
    >
      <template slot="top-left"
        v-if="isActive && curentValidators.length < 1"
      >
        <q-btn size="xs" outline label="Load For Default Subnet" @click="onGetDefaultValidators"/>
      </template>

      <template slot="top-left" v-else>
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
          class="text-grey"
          flat
          icon="push_pin"
          @click="isNotSticky=!isNotSticky"
        >
          <tooltip-style v-bind:text="textStickyPositive" />
        </q-btn>

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
        <q-btn size="xs" outline label="Add Identification" icon="img:statics/id.svg" @click.native="onAddIdentification" />
        <add-identification-dialog ref="addIdentificationRef" />
      </template>
      <template slot="top-left" v-if="!isGrid">
        <small><div class="col" style="margin-top: 20px; margin-bottom: 10px;">
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="networkShare" label="Network Share" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="percent" label="Cumulative Stake" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="uptime" label="Uptime" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="startTime" label="Start Time" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="endTime" label="End Time" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="progress" label="Progress" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="remainingCapacity" label="Remaining Capacity" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="remainingTime" label="Remaining Time" />
        </div></small>
      </template>
      <template v-slot:top-right="props" v-if="!isGrid">
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
        <q-btn
          size="xs"
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="absolute-top-right"
          color="grey"
        />
      </template>
      <template v-slot:header-cell-rank="props">
        <q-th :props="props">
          Rank
          <q-icon name="img:statics/star.svg" size="1.5em">
          </q-icon>
        </q-th>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" auto-width>
          <q-td
            v-for="(col) in props.cols"
            :key="col.name"
            :props="props"
            id="custom-td"
          >
            <div v-if="col.name === 'validator'" class="row" id="validator">
              <div :style="'border: solid 1px ' + getBorderIsDelegatable(props.row.isMinimumAmountForStake, props.row.remainingCapacity ) + ';border-radius: 50px;width: 27px;'">
                <q-avatar size="25px" @click="onClick(props.row.link)">
                  <q-img :src="props.row.avatar">
                    <template v-slot:error>
                      <div class="bg-negative text-white">
                      </div>
                  </template>
                  </q-img>
                </q-avatar>
              </div>
              <div
                v-if="props.row.name !== props.row.nodeID"
                style="cursor:pointer;"
                class="q-pl-xs q-pt-xs"
                @click="props.expand = !props.expand">
                {{ col.value }} ({{ getFormatNodeID(props.row.nodeID) }})
              </div>
              <div
                v-else
                style="cursor:pointer;font-size: 12px;"
                @click="props.expand = !props.expand"
                class="q-pl-xs q-pt-xs"
              >
                {{ col.value }}
              </div>
            </div>
            <div v-else-if="col.name === 'rank'" id="rank">
              {{ col.value }}
            </div>
            <div v-else-if="col.name === 'stake'">
              <div>
                <small class="text-grey">Total:</small> {{ getFormatReward(props.row.totalStakeAmount) }}
              </div>
              <div>
                <small class="text-grey">Own: </small>
                <span class="text-orange">{{ getFormatReward(col.value) }}</span>
                <small class="text-grey"> D: {{ getFormatReward(props.row.delegateStake) }}</small>
              </div>
            </div>
            <div v-else-if="col.name === 'weight'">
              {{ col.value }}
              <tooltip-style
                v-bind:text="'Weight is the validator’s weight used for sampling.'"
                v-bind:icon="'info'"
              />
            </div>
            <div v-else-if="col.name === 'delegationFee'">
              {{ col.value }} %
            </div>
            <div v-else-if="col.name === 'percent'">
              <div
                class="container_row"
                v-if="props.row.cumulativeStake"
              >
                <div
                  class="layer1"
                  :style="'border-radius:0px 5px 0px 0px;height: 50px;width:' + props.row.cumulativeStake + '%;background: rgb(50,53,59);background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(50,53,59,1) ' + (props.row.cumulativeStake - props.row.percent) / 5 + '%, rgba(255,96,0,1) 95%);'">
                </div>
                <div class="layer2">
                  <q-linear-progress
                    size="49px"
                    rounded
                    :value="getData(props.row, props.row)"
                    :buffer="getData(props.row, props.row)"
                    id="pr"
                    color="grey">
                    <div
                      class="absolute-full text-bold text-black"
                      id="lp"
                    >
                      {{ col.value }} %
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
            <div v-else-if="col.name === 'uptime'">
              <q-badge :color="getColorUptime(props.row.uptime)" outline class="text-medium" style="min-width: 57px;">
                <span style="margin: auto;">{{ getUpTime(props.row.uptime) }} %</span>
              </q-badge>
            </div>
            <countdown
              class="row"
              v-bind:countdown="col.value"
              v-bind:color="getIsDelegatable(props.row.isMinimumAmountForStake)"
              v-else-if="col.name === 'remainingTime'"
              style="min-width: 200px;"
            />
            <div v-else>{{ col.value }}</div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <details-validator v-bind:validator="props.row"/>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:item="props">
        <div style="max-width: 420px;width: 100%;margin:auto;margin-bottom: 5px;">
          <q-card flat bordered>
            <span class="absolute absolute-top-right q-mt-xs q-mr-md">
              <small class="q-mr-xs">Uptime</small>
              <q-badge :color="getColorUptime(props.row.uptime)" >
                {{ getUpTime(props.row.uptime) }} %
              </q-badge>
            </span>
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
                <q-item-label>
                  <small>Rank </small>
                  <span class="text-accent">
                    {{ props.row.rank }}
                  </span>
                </q-item-label>
                <q-item-label class="q-mt-md">
                  <span style="cursor:pointer;font-size: 11.5px;" @click="onClick(props.row.link)">
                    {{ props.row.name }} <small v-if="props.row.name !== props.row.nodeID" class="text-grey">({{props.row.nodeID}})</small>
                  </span>
                  <small>
                    <q-icon
                      @click="copyToClipboard(props.row.nodeID)"
                      color="grey"
                      name="file_copy"
                    />
                  </small>
                </q-item-label>
                <q-item-label>
                  <small class="text-grey">
                    Owner ({{ getFormatOwner(props.row.rewardOwner)}})
                    <q-icon
                      @click="copyToClipboard(props.row.rewardOwner.addresses[0])"
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
                {{ getFormatReward(props.row.stakeAmount)}}
                <div>
                  <small class="text-grey">Delegated</small>
                  {{ getFormatReward(props.row.delegateStake) }}
                </div>
                <q-separator />
                <div>
                  <small class="text-grey">Total</small>
                  {{ getFormatReward(props.row.totalStakeAmount)}}
                  <small class="text-accent">AVAX</small>
                </div>
                <div class="text-medium q-mt-md">Network Share (%)</div>
                <span class="text-orange q-pl-xs" v-if="props.row.percent !== 'NaN'">
                  {{ props.row.percent }} %
                </span>
                <div class="text-medium q-mt-md">Delegation Fee</div>
                <div class="text-grey">
                  {{ props.row.delegationFee }} %
                </div>
                  <div class="text-medium q-mt-md">Staked By</div>
                  <div class="text-grey">
                    <small>{{ stakedBy(props.row.startTime) }}</small>
                  </div>
              </q-card-section>
              <q-separator vertical />
              <q-card-section class="col-6">
                <cumulative-stake-chart
                  style="margin-bottom: 26px;"
                  v-bind:name="props.row.nodeID"
                  v-bind:percent="props.row.percent"
                  v-bind:percentAll="props.row.cumulativeStake ? props.row.cumulativeStake : NaN"
                />
                <div class="text-medium q-mt-md">Potential Reward</div>
                <div class="text-grey">
                  <small>{{ getFormatReward(props.row.potentialReward) }} <span class="text-accent">AVAX</span></small>
                </div>
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
                <small>{{ formatDate(props.row.startTime, 'MMMM Do YYYY, h:mm:ss a') }}</small>
              </q-card-section>
              <q-separator vertical/>
              <q-card-section class="col-6">
                <small class="text-grey text-bold">End Time</small>
                <br />
                <small>{{ formatDate(props.row.endTime, 'MMMM Do YYYY, h:mm:ss a') }}</small>
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

import { dateFormat, fromNow } from './../../modules/time.js'
import { getAvaFromnAva } from './../../utils/avax.js'
import { round } from './../../utils/commons.js'
const { network } = require('./../../modules/config').default
import { UPDATE_UI } from './../../store/ui/types.js'

import { SET_SUBNET_ID } from './../../store/app/types.js'

export default {
  name: 'TableItem',
  components: {
    Settings: () => import('components/panels/settings'),
    TooltipStyle: () => import('components/tooltip-style'),
    DetailsValidator: () => import('components/details-validator'),
    CumulativeStakeChart: () => import('components/cumulative-stake-chart'),
    Countdown: () => import('components/items/countdown'),
    AddIdentificationDialog: () => import('components/dialogs/add-identification-dialog'),
    ProgressBarValidateSession: () => import('components/progress-bar-validatе-session')
  },
  watch: {
    curentValidators: function (newValidators, oldValidators) {
      if (newValidators.length !== oldValidators.length) {
        this.visibleColumns = this.getVisibleColumns(this.curentValidators)
      }
    },
    isNotSticky: function (val) {
      if (val) this.tableClass = 'light-background shadow-3'
      else this.tableClass = 'light-background shadow-3 sticky-header-table'
    }
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
        rowsPerPage: 20
      },
      columns: [
        {
          name: 'rank',
          label: 'Rank',
          align: 'left',
          field: row => row.rank,
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'validator',
          align: 'center',
          label: 'Validator (Node ID)',
          field: row => row.name,
          headerClasses: 'text-medium'
        },
        {
          name: 'stake',
          align: 'center',
          label: 'Stake (AVAX)',
          field: row => Number(row.stakeAmount),
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
          label: 'Network Share',
          field: row => ` ${round(Number(row.percent), 1000)} %`,
          sortable: true,
          style: 'font-size: 15px;',
          headerClasses: 'text-medium'
        },
        {
          name: 'percent',
          align: 'center',
          label: 'Cumulative Stake',
          field: 'cumulativeStake',
          headerClasses: 'text-medium'
        },
        {
          name: 'delegationFee',
          align: 'center',
          label: 'Delegation Fee',
          field: row => round(Number(row.delegationFee), 1000),
          sortable: true,
          style: 'font-size: 15px;',
          headerClasses: 'text-medium'
        },
        {
          name: 'uptime',
          align: 'center',
          label: 'Uptime',
          sortable: true,
          field: row => row.uptime,
          headerClasses: 'text-medium'
        },
        {
          name: 'startTime',
          align: 'center',
          label: 'Start Time',
          field: row => row.startTime,
          format: (val, row) => `${this.formatDate(row.startTime, 'll')}`,
          style: 'font-size: 85%;',
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'endTime',
          align: 'center',
          label: 'End Time',
          sortable: true,
          field: row => row.endTime,
          format: (val, row) => `${this.formatDate(row.endTime, 'll')}`,
          style: 'font-size: 85%;',
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
          name: 'remainingCapacity',
          align: 'center',
          label: 'Remaining Capacity',
          field: row => row.remainingCapacity,
          format: (val, row) => `${this.getFormatReward(val)} AVAX`,
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'remainingTime',
          align: 'center',
          label: 'Remaining Time (Countdown)',
          field: row => row.remainingTime,
          headerClasses: 'text-medium'
        }
      ],
      isNotSticky: true,
      visibleColumns: [],
      textStickyPositive: 'Sticky header',
      textStickyNegative: 'Remove a sticky header',
      tableClass: 'light-background shadow-3'
    }
  },
  created () {
    this.visibleColumns = this.getVisibleColumns(this.curentValidators)
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
    }
  },
  methods: {
    getData (row) {
      return (row.cumulativeStake - row.percent) / 100
    },
    stakedBy (date) {
      return fromNow(date)
    },
    getVisibleColumns (curentValidators) {
      const columns = this.columns.map(c => c.name)
      if (curentValidators.find(a => a.percent === 'NAN' || !a.percent)) {
        return columns
          .filter(c =>
            c !== 'percent' &&
            c !== 'networkShare' &&
            c !== 'weight' &&
            c !== 'uptime' &&
            c !== 'progress' &&
            c !== 'rank'
          )
      } else if (curentValidators.find(a => !a.weight)) {
        return columns.filter(c => c !== 'weight' && c !== 'percent' && c !== 'progress' && c !== 'networkShare' && c !== 'uptime')
      } else if (curentValidators.find(a => a.weight)) {
        return columns.filter(c => c !== 'uptime' && c !== 'delegationFee')
      }

      return columns.filter(c => c !== 'stake')
    },
    getIsDelegatable (isMinimumAmountForStake) {
      const temp = {
        true: '#588da8',
        false: '#e8e8e8'
      }
      return temp[isMinimumAmountForStake]
    },
    getBorderIsDelegatable (isMinimumAmountForStake, remainingCapacity) {
      const temp = {
        true: 'green',
        false: '#e8e8e8'
      }
      return temp[isMinimumAmountForStake && remainingCapacity > 25]
    },
    getUpTime (val) {
      if (!val) return 0
      return round(val * 100, 1000)
    },
    getColorUptime (val) {
      if (val >= 0.6) return 'green'
      return 'negative'
    },
    getFormatReward (val) {
      if (!val) return 0

      const avax = getAvaFromnAva(val)

      return round(avax, 100)
        .toLocaleString()
    },
    getFormatOwner (val) {
      if (!val.addresses) return
      return `${val.addresses[0].substr(0, 12)}...${val.addresses[0].substr(32)}`
    },
    getFormatNodeID (val) {
      if (!val) return
      return `${val.substr(0, 20)}...${val.substr(32)}`
    },
    onClick (link) {
      if (link) openURL(link)
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
    formatDate (time, format) {
      if (time) return dateFormat(time, format)
    }
  }
}
</script>
<style scoped>
 #custom-table {
   border-right: 2px solid #588da8;
 }
 .container_row{
  display: grid;
}

.layer1, .layer2, .layer3{
  grid-column: 1;
  grid-row: 1;
}
#rank {
  margin-left: 25px!important;
  font-size: 14px;
}
#validator {
  min-width: 330px;
  margin-left: -20px;
}
#custom-td {
  padding: 0px!important;
  height: 50px!important;
}
#pr {
  opacity:0.5;
  border-radius:0px 5px 0px 0px;
}
#lp {
  font-size: 15px;
  margin-top: 9.5%;
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

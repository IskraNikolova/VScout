<template>
  <div class="q-mt-sm">
    <q-table
      :data="curentValidators"
      :columns="columns"
      row-key="rank"
      :filter="filter"
      :filter-method="filterMethod"
      :sort-method="customSort"
      :pagination="pagination"
      :grid="isGrid"
      :class="tableClass + ' panel'"
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
          toggle-color="info"
          @click.native="onSwitchAccounts"
          :options="[
            {label: 'Validators', value: 'validators'},
            {label: 'Delegations', value: 'delegations'}
          ]"
        />
        <q-btn
          class="q-ml-sm"
          no-caps color="panel"
          outline size="sm"
          label="Add Identification"
          icon="perm_identity"
          @click.native="onAddIdentification"
        />
        <add-identification-dialog ref="addIdentificationRef" />
        <q-btn
          size="sm"
          flat
          class="q-ml-sm"
          color="panel"
          icon-right="archive"
          label="Export to csv"
          no-caps
          @click="exportTable"
        />
      </template>
      <template slot="top-left" v-if="!isGrid">
        <small><div class="col" style="margin-top: 20px; margin-bottom: 10px;">
          <q-toggle size="xs" color="accent" v-model="visibleColumns" v-if="isDefaultSubnetID(subnetID)" val="networkShare" label="Network Share" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" v-if="isDefaultSubnetID(subnetID)" val="percent" label="Cumulative Stake" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" v-if="isDefaultSubnetID(subnetID)" val="uptime" label="Uptime" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="duration" label="Duration" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="startTime" label="Start Time" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="endTime" label="End Time" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="progress" label="Progress" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="remainingCapacity" label="Capacity" />
          <q-toggle size="xs" color="accent" v-model="visibleColumns" val="remainingTime" label="Countdown" />
        </div></small>
      </template>
      <template v-slot:top-right="props" v-if="!isGrid">
        <q-input
          :dark="appTheme==='dark'"
          borderless
          color="accent"
          stack-label
          label-color="accent"
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
        />
      </template>
      <template v-slot:header-cell-rank="props">
        <q-th :props="props">
          RANK
          <q-icon name="img:statics/star.svg" size="1.5em">
          </q-icon>
        </q-th>
      </template>
      <template v-slot:header-cell-validator="props">
        <q-th :props="props">
          <span style="margin-left: -60px!important;">VALIDATOR (NAME / NODE ID)</span>
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
            <div v-if="col.name === 'avatar'">
              <q-img :src="col.value" class="avatar">
                <template v-slot:error>
                  <div class="bg-white absolute-center">
                    <q-img src="~assets/image.jpg" style="width: 35vw;max-width: 35px;" />
                  </div>
                </template>
              </q-img>
            </div>
            <div v-else-if="col.name === 'validator'" class="row">
              <div
                style="cursor:pointer;margin-left: -25px;"
                @click="props.expand = !props.expand">
                {{ getFormatValidator(col.value) }}
              </div>
            </div>
            <div v-else-if="col.name === 'rank'">
              {{ col.value }}
            </div>
            <div v-else-if="col.name === 'remainingCapacity'">
               {{ col.value }}
               <span class="text-accent text-medium">
                 <small> AVAX</small>
               </span>
            </div>
            <div v-else-if="col.name === 'stakeAmount'">
              <div>
                <small>Total:</small> {{ getFormatReward(props.row.totalStakeAmount) }}
              </div>
              <div>
                <small>Own: </small>
                <span class="text-panel text-medium">{{ col.value }}</span>
                <small> D: {{ getFormatReward(props.row.delegateStake) }}</small>
              </div>
            </div>
            <div v-else-if="col.name === 'percent'">
              <div
                class="container_row"
                v-if="props.row.cumulativeStake"
              >
                <div
                  class="layer1"
                  :style="'border-radius:0px 5px 0px 0px;height: 50px;width:' + props.row.cumulativeStake + '%;background: rgb(50,53,59);background: linear-gradient(90deg, rgba(46, 1, 63, 1) 0%, rgba(50,53,59,1) ' + (props.row.cumulativeStake - props.row.percent) / 5 + '%, rgb(170,125,201) 95%);'">
                </div>
                <div class="layer2">
                  <q-linear-progress
                    size="49px"
                    rounded
                    :value="getData(props.row, props.row)"
                    :buffer="getData(props.row, props.row)"
                    id="pr">
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
              <q-badge :color="getColorUptime(col.value)" outline class="text-medium" style="min-width: 57px;">
                <span style="margin: auto;">{{ getUpTime(col.value) }} %</span>
              </q-badge>
            </div>
            <countdown
              class="row"
              v-bind:countdown="col.value"
              v-bind:color="getIsDelegatable(props.row.isMinimumAmountForStake)"
              v-else-if="col.name === 'remainingTime'"
              style="min-width: 180px;"
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
          <q-card flat bordered class="dark-panel">
            <span class="absolute absolute-top-right q-mt-xs q-mr-md">
              <small class="q-mr-xs">Uptime</small>
              <q-badge :color="getColorUptime(props.row.uptime)" >
                {{ getUpTime(props.row.uptime) }} %
              </q-badge>
            </span>
            <q-item>
              <q-item-section avatar style="cursor:pointer;" @click="onClick(props.row.link)">
                <q-img :src="props.row.avatar" :style="'width: 65vw;max-width: 65px;min-height: 65px;border-radius: 5px;border-radius: 5px;'">
                  <template v-slot:error>
                    <div class="bg-white absolute-center">
                      <q-img src="~assets/image.jpg" style="width: 35vw;max-width: 35px;" />
                    </div>
                </template>
                </q-img>
              </q-item-section>
              <q-item-section style="min-height: 80px;">
                <q-item-label>
                  <small>Rank </small>
                  <span class="text-accent">
                    {{ props.row.rank }}
                  </span>
                </q-item-label>
                <q-item-label class="q-mt-md">
                  <span v-if="props.row.name !== props.row.nodeID" style="cursor:pointer;font-size: 11.5px;" @click="onClick(props.row.link)">
                    <span class="text-medium">{{ props.row.name }}</span>
                    <br />
                    <small>{{ props.row.nodeID }}</small>
                  </span>
                  <span v-else>{{ getFormatSubstr(props.row.nodeID) }}</span>
                  <small>
                    <q-icon
                      @click="copyToClipboard(props.row.nodeID)"
                      name="file_copy"
                    />
                  </small>
                </q-item-label>
                <q-item-label>
                  <small>
                    Owner ({{ getFormatSubstr(getRewardOwner(props.row.rewardOwner)) }})
                    <q-icon
                      @click="copyToClipboard(getRewardOwner(props.row.rewardOwner))"
                      name="file_copy"
                    />
                  </small>
                </q-item-label>
                <q-item-label v-if="props.row.weight">
                  <small>
                    Weight: <span class="text-accent">{{ props.row.weight }}</span>
                  </small>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section horizontal>
              <q-card-section class="col-6 q-mb-xl">
                <div class="text-medium q-mb-md">Stake (AVAX)</div>
                <small>Own</small>
                {{ getFormatReward(props.row.stakeAmount)}}
                <div>
                  <small>Delegated</small>
                  {{ getFormatReward(props.row.delegateStake) }}
                </div>
                <q-separator />
                <div>
                  <small>Total</small>
                  {{ getFormatReward(props.row.totalStakeAmount)}}
                  <small class="text-accent">AVAX</small>
                </div>
                <div class="text-medium q-mt-md">Network Share (%)</div>
                <span class="q-pl-xs" v-if="props.row.percent !== 'NaN'">
                  {{ props.row.percent }} %
                </span>
                <div class="text-medium q-mt-md">Delegation Fee</div>
                <div>
                  {{ props.row.delegationFee }} %
                </div>
                  <div class="text-medium q-mt-md">Staked By</div>
                  <div>
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
                <div>
                  <small>{{ getFormatReward(props.row.potentialReward) }} <span class="text-accent">AVAX</span></small>
                </div>
              </q-card-section>
            </q-card-section>
            <q-card-section style="margin-top: -50px;"><div class="text-medium">Progress (%)</div>
            <progress-bar-validate-session
              v-bind:startTime="props.row.startTime"
              v-bind:endTime="props.row.endTime"
            /></q-card-section>
            <q-separator />
            <q-card-section horizontal>
              <q-card-section class="col-6">
                <small class="text-bold">Start Time</small>
                <br />
                <small>{{ formatDate(props.row.startTime, 'MMMM Do YYYY, h:mm') }}</small>
              </q-card-section>
              <q-separator vertical/>
              <q-card-section class="col-6">
                <small class="text-bold">End Time</small>
                <br />
                <small>{{ formatDate(props.row.endTime, 'MMMM Do YYYY, h:mm') }}</small>
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
  exportFile,
  openURL
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
const humanizeDuration = require('humanize-duration')
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
    '$store.state.validators': function () {
    },
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
      visible: false,
      type: 'active',
      type2: 'validators',
      isGrid: false,
      isActive: true,
      pagination: {
        sortBy: 'validator',
        descending: true,
        page: 1,
        rowsPerPage: 25
      },
      columns: [
        {
          name: 'rank',
          align: 'left',
          field: row => row.rank,
          style: 'padding-left: 20px;',
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'avatar',
          align: 'right',
          label: '',
          field: row => row.avatar
        },
        {
          name: 'validator',
          align: 'left',
          field: row => row.name,
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'stakeAmount',
          align: 'left',
          label: 'STAKE (AVAX)',
          field: row => Number(row.stakeAmount),
          format: (val, row) => `${this.getFormatReward(val)}`,
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'weight',
          align: 'center',
          label: 'WEIGHT',
          field: row => row.weight,
          format: (val, row) => `${this.getWeight(val)}`,
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'networkShare',
          align: 'left',
          label: 'NETWORK SHARE',
          field: row => Number(row.percent),
          format: (val, row) => `${round(Number(val), 1000)} %`,
          sortable: true,
          style: 'font-size: 15px;',
          headerClasses: 'text-medium'
        },
        {
          name: 'percent',
          align: 'left',
          label: 'CUMULATIVE STAKE',
          field: 'cumulativeStake',
          headerClasses: 'text-medium'
        },
        {
          name: 'delegationFee',
          align: 'left',
          label: 'FEE',
          field: row => Number(row.delegationFee),
          format: (val, row) => `${round(Number(val), 1000)} %`,
          sortable: true,
          style: 'font-size: 15px;',
          headerClasses: 'text-medium'
        },
        {
          name: 'uptime',
          align: 'left',
          label: 'UPTIME',
          sortable: true,
          field: row => row.uptime,
          headerClasses: 'text-medium'
        },
        // {
        //   name: 'connected',
        //   align: 'left',
        //   label: 'CONNECTED',
        //   sortable: true,
        //   field: row => row.connected,
        //   headerClasses: 'text-medium'
        // },
        {
          name: 'duration',
          align: 'left',
          label: 'DURATION',
          field: row => Number(row.duration),
          format: (val, row) => `${this.getDurationL(val)}`,
          style: 'font-size: 15px;',
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'startTime',
          align: 'left',
          label: 'START TIME',
          field: row => Number(row.startTime),
          format: (val, row) => `${this.formatDate(val, 'MMMM Do YYYY')}`,
          style: 'font-size: 85%;',
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'endTime',
          align: 'left',
          label: 'END TIME',
          sortable: true,
          field: row => Number(row.endTime),
          format: (val, row) => `${this.formatDate(val, 'MMMM Do YYYY')}`,
          style: 'font-size: 85%;',
          headerClasses: 'text-medium'
        },
        {
          name: 'progress',
          align: 'left',
          label: 'PROGRESS (%)',
          field: 'progress',
          headerClasses: 'text-medium'
        },
        {
          name: 'remainingCapacity',
          align: 'left',
          label: 'CAPACITY',
          field: row => Number(row.remainingCapacity),
          format: (val, row) => `${this.getFormatReward(val)}`,
          sortable: true,
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
      stakers: [],
      filter: '',
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
    this.stakers = this.curentValidators
  },
  computed: {
    ...mapGetters([
      'nodeID',
      'validators',
      'subnetID',
      'appTheme',
      'isDefaultSubnetID',
      'pendingValidators'
    ]),
    isYourNode: function (id) {
      return id === this.nodeID
    },
    curentValidators: function () {
      if (this.isActive) return this.validators
      return this.pendingValidators
    }
  },
  methods: {
    filterMethod () {
      if (this.curentValidators && this.curentValidators.length > 0) {
        return this.curentValidators
          .filter(row => row.nodeID.toLowerCase().includes(this.filter.toLowerCase()) ||
          row.name.toLowerCase().includes(this.filter.toLowerCase()) ||
          this.getRewardOwner(row.rewardOwner).toLowerCase().includes(this.filter.toLowerCase()))
      }
    },
    getDurationL (val) {
      if (!val) return
      return humanizeDuration(val, {
        units: ['d'],
        round: true
      })
    },
    getWeight (val) {
      const avax = getAvaFromnAva(val)
      return avax
    },
    customSort (rows, sortBy, descending) {
      const data = [...rows]
      if (!data) return
      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a
          const y = descending ? a : b
          if (sortBy === 'validator') {
            // string sort
            const first = x.name !== x.nodeID
            const second = y.name !== y.nodeID
            return first - second
          } else {
            // numeric sort
            return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
          }
        })
      }
      return data
    },
    getRewardOwner (val) {
      if (!val) return ''
      return val.addresses[0]
    },
    exportTable () {
      const content = [this.columns.map(col => wrapCsvValue(col.label))].concat(
        this.curentValidators.map(row => this.columns.map(col => wrapCsvValue(
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
            c !== 'progress' &&
            c !== 'uptime' &&
            c !== 'rank'
          )
      } else if (curentValidators.find(a => !a.weight)) {
        return columns.filter(
          c => c !== 'weight' &&
          c !== 'percent' &&
          c !== 'progress' &&
          c !== 'networkShare' &&
          c !== 'endTime'
        )
      } else if (curentValidators.find(a => a.weight)) {
        return columns.filter(c => c !== 'uptime' && c !== 'delegationFee' && c !== 'networkShare' && c !== 'percent')
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
        true: '#588da8',
        false: '#e8e8e8'
      }
      return temp[isMinimumAmountForStake && remainingCapacity > 25]
    },
    getUpTime (val) {
      if (!val) return 0
      return round(val * 100, 1000)
    },
    getColorUptime (val) {
      if (val >= 0.6) return 'positive'
      return 'negative'
    },
    getFormatReward (val) {
      if (!val) return 0

      const avax = getAvaFromnAva(val)
      return round(avax, 100)
        .toLocaleString()
    },
    getFormatSubstr (val) {
      if (!val) return
      return `${val.substr(0, 12)}...${val.substr(32)}`
    },
    getFormatValidator (val) {
      if (!val) return
      if (val.length > 20) return `${val.substr(0, 20)}...${val.substr(28)}`
      return val
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
#custom-td {
  padding-top: 0px!important;
  padding-bottom: 0px!important;
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

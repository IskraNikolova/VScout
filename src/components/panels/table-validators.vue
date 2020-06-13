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
    >
      <template v-slot:header-cell-delegate="props">
        <q-th :props="props">
          <q-icon name="img:statics/delegate.png" size="3.0em" />
        </q-th>
      </template>
      <template slot="top-left">
        <q-btn size="xs" flat icon="apps" @click="isGrid=true"/>
        <q-btn size="xs" flat icon="reorder" @click="isGrid=false"/>
        <select-network-dropdown />
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
        />
        <q-btn size="xs" outline label="Add Validator" icon="add" @click.native="onAddValidator" class="q-mr-md q-ml-md"/>
        <add-validator-dialog ref="addValidatorDialog" />
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
            style="padding: 0px!important;margin:0px!important;"
          >
            <div v-if="col.name === 'validator'" class="row q-pl-md">
            <!--<div :style="'border: solid 2px ' + border + ';border-radius: 50px;width: 24px;'">-->
              <q-avatar size="25px">
                <img :src="props.row.avatar" />
              </q-avatar>
              <div
                style="cursor:pointer;font-size: 90%;"
                class="q-pt-xs q-ml-md"
                @click="onClick(props)"
                @mouseover="props.expand = true"
                @mouseleave="props.expand = false">
                {{ props.row.name}}
              </div>
            </div>
            <div v-else-if="col.name === 'stake'" class="q-pl-md">
              <div>
                {{ col.value }}
                <small style="color: grey;">({{ getLocalString(props.row.stakenAva)}} nAva)</small>
              </div>
              <div v-if="props.row.cumulativeStake"><small style="color: grey;">{{ props.row.precent }} %</small></div>
            </div>
            <div v-else-if="col.name === 'precent'">
              <div class="container_row" v-if="props.row.cumulativeStake">
                <div class="layer1">
                  <q-linear-progress
                    size="50px"
                    :value="props.row.cumulativeStake / 100"
                    :buffer="props.row.cumulativeStake / 100"
                    color="accent"
                  >
                  </q-linear-progress>
                </div>
                <div class="layer2">
                  <q-linear-progress
                    size="50px"
                    :value="(props.row.cumulativeStake - props.row.precent) / 100"
                    :buffer="(props.row.cumulativeStake - props.row.precent) / 100"
                    color="blue-grey-5">
                    <div class="absolute-full text-black q-ml-xs" style="font-size: 15px;margin-top: 6%;">
                      {{props.row.cumulativeStake}} %
                    </div>
                  </q-linear-progress>
                </div>
              </div>
              <div v-else></div>
            </div>
            <div v-else-if="col.name === 'progress'">
              <progress-bar-validate-session
                v-bind:startTime="props.row.startTime"
                v-bind:endTime="props.row.endTime"
              />
            </div>
            <div v-else-if="col.name === 'startTime'" class="q-pl-md">
              {{ formatDate(col.value) }}
            </div>
            <div v-else-if="col.name === 'delegate'">
              <q-btn v-if="isDefaultSubnetID" no-caps flat @click="onDelegate(props.row)">
                <small class="text-orange">Delegate</small>
              </q-btn>
              <div v-else> - </div>
            </div>
            <div v-else>{{ col.value }}</div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <details-item
              v-bind:weight="props.row.weight ? props.row.weight : ''"
              v-bind:address="props.row.address ? props.row.address : ''"
              v-bind:identity="props.row.validator"
              v-bind:startTime="props.row.startTime"
              v-bind:endTime="props.row.endTime"
            />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="props.row.avatar">
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
                  {{ props.row.name }}
                  <small>
                    <q-icon
                      @click="copyToClipboard(props.row.validator)"
                      color="accent"
                      name="file_copy"
                    />
                  </small>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section horizontal>
              <q-card-section class="col-5 q-mb-xl">
                <div class="q-mb-md">Stake (AVA / nAva)</div>
                {{ props.row.stake > 1 ? getLocalString(props.row.stake) : props.row.stake }}
                <span class="text-accent">$AVA</span>
                <br />
                <small style="color: grey;">
                  ({{ getLocalString(props.row.stakenAva) }} nAva)
                </small>
              <div class="q-mb-md" >
                <small style="color: grey;">{{ props.row.precent }} %</small>
              </div>
              <q-separator class="q-mb-md"/>
              <div class="q-pl-xs">
                <div>Staked by</div>
                <div class="text-accent">
                  <small>{{ props.row.fromNowST }}</small>
                </div>
              </div>
              <div class="q-mt-md">
                <q-btn
                  outline
                  size="xs"
                  color="orange"
                  label="Delegate"
                  v-if="isDefaultSubnetID"
                  @click="onDelegate(props.row)"
                />
              </div>
              </q-card-section>
              <q-separator vertical />
              <q-card-section class="col-7">
                <cumulative-stake-chart
                  v-if="props.row.cumulativeStake"
                  v-bind:name="props.row.validator"
                  v-bind:percent="props.row.precent"
                  v-bind:percentAll="props.row.cumulativeStake ? props.row.cumulativeStake : NaN"
                /><div v-else> - </div>
              </q-card-section>

            </q-card-section>
            <q-card-section>
              <div class="text-grey">Progress (%)</div>
              <progress-bar-validate-session
                v-bind:startTime="props.row.startTime"
                v-bind:endTime="props.row.endTime"
              />
            </q-card-section>

            <q-separator />

            <q-card-section horizontal>
              <q-card-section class="col-6">
                <small>Start Time</small>
                <div>{{ formatDate(props.row.startTime) }}</div>
              </q-card-section>
              <q-separator vertical/>
              <q-card-section class="col-6">
                <small>End Time</small>
                <div>{{ formatDate(props.row.endTime) }}</div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
    <delegate-validator-dialog ref="delegateValidatorDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  copyToClipboard,
  openURL
} from 'quasar'

import { date } from './../../modules/time'
import { UPDATE_UI } from './../../store/ui/types'

import DetailsItem from './../details-item'
import AddValidatorDialog from './../add-validator-dialog'
import CumulativeStakeChart from './../cumulative-stake-chart'
import DelegateValidatorDialog from './../delegate-validator-dialog'
import ProgressBarValidateSession from './../progress-bar-validatе-session'
import SelectNetworkDropdown from './../items/select-network-dropdown'
// import AddIdentificationDialog from './../add-identification-dialog'

export default {
  name: 'TableItem',
  components: {
    DetailsItem,
    AddValidatorDialog,
    CumulativeStakeChart,
    SelectNetworkDropdown,
    DelegateValidatorDialog,
    // AddIdentificationDialog,
    ProgressBarValidateSession
  },
  data () {
    return {
      filter: '',
      type: 'active',
      type2: 'validators',
      isGrid: false,
      isActive: true,
      pagination: {
        rowsPerPage: 20
      },
      border: '#87C5D6',
      separator: 'cell',
      columns: [
        {
          name: 'rank',
          label: 'RANK',
          align: 'center',
          field: row => row.rank,
          sortable: true,
          style: 'width: 50px'
        },
        {
          name: 'validator',
          align: 'left',
          label: 'VALIDATOR (Node ID)',
          field: 'name'
        },
        {
          name: 'stake',
          align: 'left',
          label: 'STAKE (AVA / nAva)',
          field: row => row.stake > 1 ? row.stake.toLocaleString() : row.stake,
          sortable: true
        },
        {
          name: 'precent',
          align: 'left',
          label: 'CUMULATIVE STAKE (%)',
          field: 'cumulativeStake'
        },
        { name: 'startTime', align: 'left', label: 'START TIME', field: 'startTime', sortable: true },
        { name: 'progress', align: 'left', label: 'PROGRESS (%)', field: 'progress' },
        { name: 'delegate', align: 'center', label: 'DELEGATE', field: 'delegate' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'nodeID',
      'validators',
      'networkEndpoint',
      'pendingValidators',
      'isDefaultSubnetID'
    ]),
    curentValidators: {
      get: function () {
        if (this.isActive) return this.validators
        return this.pendingValidators
      }
    },
    visibleColumns: function () {
      const columns = this.columns.map(c => c.name)
      if (this.curentValidators.find(a => a.precent === 'NaN')) {
        return columns.filter(c => c !== 'precent')
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
    onDelegate (validator) {
      this.$refs
        .delegateValidatorDialog
        .openDelegate(validator)
    },
    getLocalString (val) {
      if (!val) return val
      return val.toLocaleString()
    },
    onAddValidator () {
      this.$refs.addValidatorDialog.open()
    },
    onAddIdentification () {
      this.$refs.addIdentificationRef.openAddId()
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
    onGetValidators () {
      const temp = {
        active: () => { this.isActive = true },
        pending: () => { this.isActive = false }
      }
      temp[this.type]()
      this.$emit('getValidators', this.type)
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

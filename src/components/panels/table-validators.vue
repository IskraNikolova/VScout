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
      <template slot="top-left">
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
        <!--<q-btn
          size="xs"
          outline
          icon="add"
          label="Add Validator"
          @click.native="onAddValidator"
          class="q-mr-md q-ml-md"
        />
        <add-validator-dialog ref="addValidatorDialog" />-->
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
      <template slot="top-right" v-if="!isGrid"  class="ch5">
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
              <q-avatar size="25px" @click="onClick(props.row.link)">
                <q-img :src="props.row.avatar">
                  <template v-slot:error>
                    <div class="bg-negative text-white">
                      ?
                    </div>
                </template>
                </q-img>
              </q-avatar>
              <div
                style="cursor:pointer;font-size: 90%;"
                class="q-pt-xs q-ml-md"
                @click="props.expand=!props.expand">
                {{ props.row.name}}
              </div>
              <q-tooltip>Node ID: {{props.row.validator}}</q-tooltip>
            </div>
            <div v-else-if="col.name === 'stake'">
              <div>
                <small class="text-grey">Total</small> {{ props.row.total > 1 ? props.row.total.toLocaleString() : props.row.total }}
                <small class="text-accent">
                  $AVAX
                </small>
              </div>
              <div>
                <small class="text-grey">Own</small> {{ col.value }}
                <small class="text-grey">Delegated</small> {{ props.row.delegateStake }}
              </div>
            </div>
            <div v-else-if="col.name === 'weight'">
              {{ col.value }}
              <q-tooltip>Weight is the validator’s weight used for sampling.</q-tooltip>
            </div>
            <div v-else-if="col.name === 'networkShare' && props.row.percent">
              {{ props.row.percent }} %
            </div>
            <div v-else-if="col.name === 'percent'">
              <div class="container_row" v-if="props.row.cumulativeStake">
                <div class="layer1">
                  <q-linear-progress
                    size="50px"
                    :value="props.row.cumulativeStake / 100"
                    :buffer="props.row.cumulativeStake / 100"
                    color="orange"
                  >
                  </q-linear-progress>
                </div>
                <div class="layer2">
                  <q-linear-progress
                    size="49px"
                    :value="(props.row.cumulativeStake - props.row.percent) / 100"
                    :buffer="(props.row.cumulativeStake - props.row.percent) / 100"
                    color="grey">
                    <div
                      class="absolute-full text-black q-ml-xs"
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
            <div v-else-if="col.name === 'startTime'">
              <small>{{ formatDate(col.value) }}</small>
            </div>
            <!--<div v-else-if="col.name === 'delegate'">
              <q-btn v-if="isDefaultSubnetID" no-caps flat @click="onDelegate(props.row)">
                <small class="text-orange">Delegate</small>
              </q-btn>
              <div v-else> - </div>
            </div>-->
            <div v-else>{{ col.value }}</div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <details-validator
              v-bind:link="props.row.link ? props.row.link : ''"
              v-bind:delegatorsCount="props.row.delegatorsCount ? props.row.delegatorsCount : NaN"
              v-bind:weight="props.row.weight ? props.row.weight : ''"
              v-bind:address="props.row.address ? props.row.address : ''"
              v-bind:identity="props.row.validator"
              v-bind:name="props.row.name"
              v-bind:startTime="props.row.startTime"
              v-bind:endTime="props.row.endTime"
              v-bind:avatar="props.row.avatar"
            />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:item="props">
        <div style="width: 300px;margin:auto;">
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar @click="onClick(props.row.link)">
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
                <q-item-label @click="onClick(props.row.link)">
                  {{ props.row.name }} <small v-if="props.row.name !== props.row.validator" class="text-grey">({{props.row.validator}})</small>
                  <small>
                    <q-icon
                      @click="copyToClipboard(props.row.validator)"
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
                <q-item-label v-else>
                  <small class="text-grey">
                    Weight: <span class="text-accent">{{ props.row.weight }}</span>
                  </small>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section horizontal>
              <q-card-section class="col-5 q-mb-xl">
                <div class="q-mb-md">Stake (AVAX)</div>
                {{ props.row.stake > 1 ? getLocalString(props.row.stake) : props.row.stake }}
                <small class="text-accent">$AVAX</small>
                <br />
                <small style="color: grey;">
                  ({{ getLocalString(props.row.stakenAva) }} nAvax)
                </small>
                <div>
                  <small class="text-orange" v-if="props.row.percent !== 'NaN'">
                    {{ props.row.percent }} %
                  </small>
                </div>
                <div>
                  <small class="text-grey">Delegated</small>
                  {{ props.row.delegateStake }}
                  <small class="text-accent">$AVAX</small>
                </div>
                <div>
                  <small class="text-grey">Total</small>
                  {{ props.row.total > 1 ? props.row.total.toLocaleString() : props.row.total }}
                  <small class="text-accent">$AVAX</small>
                </div>
                <q-separator class="q-mb-md"/>
                <div class="q-pl-xs">
                  <div>Staked by</div>
                  <div class="text-accent">
                    <small>{{ props.row.fromNowST }}</small>
                  </div>
                </div>
                <!--<div class="q-mt-md">
                  <q-btn
                    outline
                    size="xs"
                    class="orange"
                    label="Delegate"
                    v-if="isDefaultSubnetID"
                    @click="onDelegate(props.row)"
                  />
                </div>-->
              </q-card-section>
              <q-separator vertical />
              <q-card-section class="col-7">
                <cumulative-stake-chart
                  v-if="props.row.cumulativeStake"
                  v-bind:name="props.row.validator"
                  v-bind:percent="props.row.percent"
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
                <small class="text-grey">Start Time</small>
                <br />
                <small>{{ formatDate(props.row.startTime) }}</small>
              </q-card-section>
              <q-separator vertical/>
              <q-card-section class="col-6">
                <small class="text-grey">End Time</small>
                <br />
                <small>{{ formatDate(props.row.endTime) }}</small>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
    <!--<delegate-validator-dialog ref="delegateValidatorDialog" />-->
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
import DetailsValidator from './../details-validator'
import Settings from './settings'
import CumulativeStakeChart from './../cumulative-stake-chart'
// import AddValidatorDialog from './../dialogs/add-validator-dialog'
import ProgressBarValidateSession from './../progress-bar-validatе-session'
// import DelegateValidatorDialog from './../dialogs/delegate-validator-dialog'
import AddIdentificationDialog from './../dialogs/add-identification-dialog'

export default {
  name: 'TableItem',
  components: {
    Settings,
    DetailsValidator,
    // AddValidatorDialog,
    CumulativeStakeChart,
    // DelegateValidatorDialog,
    AddIdentificationDialog,
    ProgressBarValidateSession
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
      border: '#87C5D6',
      separator: 'cell'
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
      if (this.curentValidators.find(a => a.percent === 'NAN' || !a.percent)) {
        return columns.filter(c => c !== 'percent')
      } else if (this.curentValidators.find(a => a.weight < 1)) {
        return columns.filter(c => c !== 'weight')
      }

      return columns.filter(c => c !== 'stake')
    },
    columns: function () {
      return [
        {
          name: 'rank',
          label: 'RANK',
          align: 'center',
          field: row => row.rank,
          sortable: true,
          style: 'width: 50px',
          headerClasses: 'text-medium'
        },
        {
          name: 'validator',
          align: 'center',
          label: 'VALIDATOR',
          field: 'name',
          headerClasses: 'text-medium'
        },
        {
          name: 'stake',
          align: 'center',
          label: 'STAKE (AVAX)',
          field: row => row.stake > 1 ? row.stake.toLocaleString() : row.stake,
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'weight',
          align: 'center',
          label: 'WEIGHT',
          field: row => row.weight,
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'networkShare',
          align: 'center',
          label: 'NETWORK SHARE (%)',
          field: row => row.percent,
          sortable: true,
          headerClasses: 'text-medium'
        },
        {
          name: 'percent',
          align: 'center',
          label: 'CUMULATIVE STAKE (%)',
          field: 'cumulativeStake',
          headerClasses: 'text-medium'
        },
        { name: 'startTime', align: 'center', label: 'START TIME', field: 'startTime', sortable: true, headerClasses: 'text-medium' },
        { name: 'progress', align: 'left', label: 'PROGRESS (%)', field: 'progress', headerClasses: 'text-medium' }
        // { name: 'delegate', align: 'center', label: 'Delegate', field: 'delegate', headerClasses: 'ch5' }
      ]
    }
  },
  methods: {
    onClick (link) {
      if (!link) return
      try {
        openURL(link)
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

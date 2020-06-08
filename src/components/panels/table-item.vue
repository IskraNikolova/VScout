<template>
  <div class="q-mt-md">
    <q-table
      :data="curentVal"
      :columns="columns"
      row-key="rank"
      :separator="separator"
      :filter="filter"
      :pagination.sync="pagination"
      :grid="isGrid"
      class="light-background shadow-3"
      id="custom-table"
    >
      <template slot="top-left">
        <q-btn size="xs" flat icon="apps" @click="isGrid=true"/>
        <q-btn size="xs" flat icon="reorder" @click="isGrid=false"/>
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
        <q-btn size="xs" outline label="Add Validator" icon="add" @click.native="onAddValidator" class="q-mr-md"/>
        <add-validator-dialog ref="addValidatorDialog" />
        <!--<q-btn size="xs" outline label="Add Identification" icon="img:statics/id.svg" @click.native="onAddIdentification" />
        <add-identification-dialog ref="addIdentificationRef" />-->
      </template>
      <template slot="top-right">
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
              <div :style="'border: solid 2px ' + border + ';border-radius: 50px;'">
                <q-avatar size="24px" color="grey" class="column-2">
                  <img :src="props.row.avatar" />
                </q-avatar>
              </div>
              <div
                style="cursor:pointer;"
                class="col-9 q-pl-xl"
                @click="onClick(props)"
                @mouseover=" props.expand = true"
                @mouseleave=" props.expand = false">
                {{ props.row.name}}
              </div>
            </div>
            <div v-else-if="col.name === 'stake'" class="q-pl-md">
              <div>
                {{ col.value }}
                <small style="color: grey;">({{ getLocalString(props.row.stakenAva)}} nAva)</small>
              </div>
              <div><small style="color: grey;">{{ props.row.precent }} %</small></div>
            </div>
            <div v-else-if="col.name === 'precent'">
              <div class="container_row">
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
            <div v-else>{{ col.value }}</div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <details-item
              v-bind:img="props.row.monster"
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
                <div >Staked by</div>
                <div class="text-accent">
                  <small>{{ props.row.fromNowST }}</small>
                </div>
              </div>
              </q-card-section>
              <q-separator vertical />
              <q-card-section class="col-7">
                <cumulative-stake-chart
                  v-bind:name="props.row.validator"
                  v-bind:percent="props.row.precent"
                  v-bind:percentAll="props.row.cumulativeStake ? props.row.cumulativeStake : NaN"
                />
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { copyToClipboard, openURL } from 'quasar'

import { date } from './../../modules/time'

import DetailsItem from './../details-item'
// import AddIdentificationDialog from './../add-identification-dialog'
import AddValidatorDialog from './../add-validator-dialog'
import CumulativeStakeChart from './../cumulative-stake-chart'
import ProgressBarValidateSession from './../progress-bar-validatе-session'

export default {
  name: 'TableItem',
  components: {
    DetailsItem,
    // AddIdentificationDialog,
    AddValidatorDialog,
    CumulativeStakeChart,
    ProgressBarValidateSession
  },
  data () {
    return {
      type: 'active',
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
          label: 'VALIDATOR',
          field: 'name'
        },
        {
          name: 'stake',
          align: 'left',
          label: 'STAKE (AVA / nAva)',
          field: row => row.stake > 1 ? row.stake.toLocaleString() : row.stake,
          sortable: true
        },
        { name: 'precent', align: 'left', label: 'CUMULATIVE STAKE (%)', field: 'cumulativeStake' },
        { name: 'startTime', align: 'left', label: 'START TIME', field: 'startTime', sortable: true },
        { name: 'progress', align: 'left', label: 'PROGRESS (%)', field: 'progress' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'nodeID',
      'validators',
      'networkEndpoint',
      'pendingValidators'
    ]),
    curentVal: {
      get: function () {
        if (this.isActive) return this.validators
        return this.pendingValidators
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

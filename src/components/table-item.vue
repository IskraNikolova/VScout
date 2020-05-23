<template>
  <div class="q-mt-md">
    <q-table
      :data="curentVal"
      :columns="columns"
      row-key="rank"
      :separator="separator"
      :filter="filter"
      dark
      class="dark-background"
      :pagination.sync="pagination"
      :grid="isGrid"
      id="custom-table"
    >
      <template slot="top-left">
        <q-btn size="xs" color="white" flat icon="apps" @click="isGrid=true"/>
        <q-btn size="xs" color="white" flat icon="reorder" @click="isGrid=false"/>
        <q-btn size="xs" color="white" flat label="Active" @click.native="onGetValidators"/>
        <q-btn size="xs" color="white" flat label="Pending" @click.native="onGetValidators"/>
      </template>
      <template slot="top-right">
        <q-input @focus="true" dark borderless color="accent" stack-label label="Search validator..." clearable v-model="filter">
          <template v-slot:append>
            <q-icon name="search" color="accent" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" auto-width>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            style="padding: 0px!important;margin:0px!important;"
          >
            <div v-if="col.name === 'validator'" class="row q-pl-md">
              <div :style="'border: solid 2px ' + border + ';border-radius: 50px;'">
                <q-avatar size="24px" color="grey" class="column-2"><img :src="props.row.img" /></q-avatar>
              </div>
              <div
                style="cursor: pointer;"
                class="column q-pl-xl"
                @mouseover="props.expand = true"
                @mouseleave="props.expand = false">
                {{ col.value }}
              </div>
            </div>
            <div v-else-if="col.name === 'stake'" class="q-pl-md">
              <div>{{ col.value }} <small style="color: grey;"> ({{ props.row.stakenAva.toLocaleString() }} nAva)</small></div>
              <div><small style="color: grey;">{{ props.row.precent }} %</small></div>
            </div>
            <div v-else-if="col.name === 'precent'">
              <div class="container_row">
                <div class="layer1">
                  <q-linear-progress
                    dark
                    size="50px"
                    :value="cumulativeStake(props.row.rank) / 100"
                    :buffer="cumulativeStake(props.row.rank) / 100"
                    color="accent"
                  >
                  </q-linear-progress>
                </div>
                <div class="layer2">
                  <q-linear-progress
                    dark
                    size="50px"
                    :value="(cumulativeStake(props.row.rank) - props.row.precent) / 100"
                    :buffer="(cumulativeStake(props.row.rank) - props.row.precent) / 100"
                    color="grey">
                    <div class="absolute-full flex flex-left text-white q-ml-xs" style="font-size: 12px;margin-top: 10px;">
                      {{cumulativeStake(props.row.rank)}} %
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
              {{ startDate(col.value) }}
            </div>
            <div v-else>{{ col.value }}</div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <details-item
              v-bind:img="props.row.img2"
              v-bind:identity="props.row.identity"
              v-bind:startTime="props.row.startTime"
              v-bind:endTime="props.row.endTime"
            />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:item="props">
         <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
           <q-card dark flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="props.row.img2">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label ><small>Rank </small> <span class="text-accent">{{ props.row.rank }}</span></q-item-label>
                <q-item-label>
                  {{ props.row.identity }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator dark />

            <q-card-section horizontal>
              <q-card-section class="col-5">
                <div class="q-mb-md">Stake (AVA / nAva)</div>
                <br />
                {{ props.row.stake.toLocaleString() }} <span class="text-accent">$AVA</span>
                <br />
                <small style="color: grey;"> ({{ props.row.stakenAva.toLocaleString() }} nAva)</small>
                <br />
              <small style="color: grey;">{{ props.row.precent }} %</small>
              </q-card-section>
              <q-separator dark vertical />
              <q-card-section class="col-7">
               <cumulative-stake-chart
                 v-bind:name="props.row.identity"
                 v-bind:precent="props.row.precent"
                 v-bind:precentAll="cumulativeStake(props.row.rank)"
                />
              </q-card-section>

            </q-card-section>
            <q-card-section>
              Progress (%)
              <progress-bar-validate-session
                v-bind:startTime="props.row.startTime"
                v-bind:endTime="props.row.endTime"
              />
            </q-card-section>

            <q-separator dark />

            <q-card-section horizontal>
              <q-card-section class="col-6">
                <small>Start Time</small>
                <div>{{startDate(props.row.startTime)}}</div>
              </q-card-section>
              <q-separator dark vertical/>
              <q-card-section class="col-6">
                <small>End Time</small>
                <div>{{startDate(props.row.endTime)}}</div>
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
import { round } from './../utils/commons'
import { dateLL } from './../modules/time'

import DetailsItem from './details-item'
import CumulativeStakeChart from './cumulative-stake-chart'
import ProgressBarValidateSession from './progress-bar-validatе-session'

export default {
  name: 'TableItem',
  components: {
    DetailsItem,
    CumulativeStakeChart,
    ProgressBarValidateSession
  },
  data () {
    return {
      curentValidators: [],
      isGrid: false,
      isActive: true,
      filter: '',
      pagination: {
        rowsPerPage: 10
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
          field: 'validator'
        },
        {
          name: 'stake',
          align: 'left',
          label: 'STAKE (AVA / nAva)',
          field: row => row.stake > 1 ? row.stake.toLocaleString() : row.stake,
          sortable: true
        },
        { name: 'precent', align: 'left', label: 'CUMULATIVE STAKE (%)', field: 'cumulativeStake' },
        { name: 'startTime', align: 'left', label: 'START TIME', field: 'startTime' },
        { name: 'progress', align: 'left', label: 'PROGRESS (%)', field: 'progress' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'validators',
      'pendingValidators'
    ]),
    curentVal: {
      get: function () {
        return this.isActive ? this.validators : this.pendingValidators
      }
    }
  },
  created () {
    this.pagination = {
      rowsPerPage: this.curentVal.length
    }
  },
  methods: {
    onGetValidators (e) {
      const temp = {
        active: () => { this.isActive = true },
        pending: () => { this.isActive = false }
      }
      const type = e.target.innerText.toLowerCase()
      temp[type]()
      this.$emit('getValidators', type)
    },
    startDate (time) {
      return dateLL(time)
    },
    cumulativeStake (index) {
      return this.validators.reduce((result, item) => {
        if (item.rank <= index) {
          result += parseFloat(item.precent)
        }

        return round(result, 1000)
      }, 0)
    }
  }
}
</script>
<style scoped>
 #custom-table {
   border-left: 0.5px solid #474F52;
   border-right: 3px solid #87C5D6;
 }
 .container_row{
  display: grid;
}

.layer1, .layer2{
  grid-column: 1;
  grid-row: 1;
}

</style>

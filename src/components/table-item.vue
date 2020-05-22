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
        <q-input dark borderless color="accent" clearable v-model="filter">
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
          >
            <div v-if="col.name === 'validator'" class="row">
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
            <div v-else-if="col.name === 'stake'">
              {{ col.value }} <small style="color: grey;"> ({{ props.row.stakenAva.toLocaleString() }} nAva)</small>
              <br />
              <small style="color: grey;">{{ props.row.precent }} %</small>
            </div>
            <div
              v-else-if="col.name === 'precent'"
              :style="getStyle(cumulativeStake(props.row.rank), props.row.precent)">
              {{ cumulativeStake(props.row.rank) }} %
            </div>
            <div v-else-if="col.name === 'progress'">
              <progress-bar-validate-session
                v-bind:startTime="props.row.startTime"
                v-bind:endTime="props.row.endTime"
              />
            </div>
            <div v-else-if="col.name === 'startTime'">
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
                <q-item-label ><small>Rank</small> {{ props.row.rank }}</q-item-label>
                <q-item-label>
                  {{ props.row.identity }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator dark />

            <q-card-section horizontal>
              <q-card-section class="col-7">
                <small>Stake (AVA / nAva)</small>
                <br />
                {{ props.row.stake }} <small style="color: grey;"> ({{ props.row.stakenAva.toLocaleString() }} nAva)</small>
                <br />
              <small style="color: grey;">{{ props.row.precent }} %</small>
              </q-card-section>

              <q-separator vertical dark />

              <q-card-section class="col-5">
               <small>Cumulative stake (%)</small>
               <q-linear-progress
                 dark
                 size="40px" :value="cumulativeStake(props.row.rank) / 100"
                 color="accent"
                 style="padding:0px!important;">
               <div class="absolute-full flex flex-center">
                  <q-badge text-color="white" outline :label="cumulativeStake(props.row.rank) + '%'" />
                </div>
               </q-linear-progress>
              </q-card-section>

            </q-card-section>

            <q-separator dark />
              <q-card-section>
                <small>Progress (%)</small>
                <progress-bar-validate-session
                  v-bind:startTime="props.row.startTime"
                  v-bind:endTime="props.row.endTime"
                />
              </q-card-section>

              <q-separator dark />

              <q-card-section>
                <small>Start Time</small>
                <div>{{startDate(props.row.startTime)}}</div>
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
import { date2 } from './../modules/time'

import ProgressBarValidateSession from './progress-bar-validatе-session'
import DetailsItem from './details-item'

export default {
  name: 'TableItem',
  components: {
    ProgressBarValidateSession,
    DetailsItem
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
      return date2(time)
    },
    cumulativeStake (index) {
      return this.validators.reduce((result, item) => {
        if (item.rank <= index) {
          result += parseFloat(item.precent)
        }

        return round(result, 1000)
      }, 0)
    },
    getStyle (cumulativeStake, precent) {
      // todo see table quasar doc for styling
      return 'background-color: rgb(84, 93, 95);width: ' + (cumulativeStake * 1.17) + '%;border-right:' + (precent * 2.35) + 'px solid #87C5D6;text-align: right!important;height: 52px;margin:-8%;'
    }
  }
}
</script>
<style scoped>
 #custom-table {
   border-left: 0.5px solid #474F52;
   border-right: 3px solid #87C5D6;
 }
</style>

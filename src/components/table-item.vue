<template>
 <div class="q-mt-md">
    <q-table
      :data="validators"
      :columns="columns"
      row-key="rank"
      :separator="separator"
      :filter="filter"
      dark
      :pagination.sync="pagination"
      :grid="isGrid"
      id="custom-table"
    >
      <template slot="top-left">
        <q-btn size="xs" color="white" flat icon="apps" @click="isGrid=true"/>
        <q-btn size="xs" color="white" flat icon="reorder" @click="isGrid=false"/>
      </template>
      <template slot="top-right">
        <q-input dark hide-underline clearable v-model="filter">
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
            <div v-else>{{ col.value }}</div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              <details-item
                v-bind:img="props.row.img2"
                v-bind:identity="props.row.identity"
                v-bind:startTime="props.row.startTime"
                v-bind:endTime="props.row.endTime"
              />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
 </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ProgressBarValidateSession from './progress-bar-validatе-session'
import DetailsItem from './details-item'
import { round } from './../utils/commons'

export default {
  name: 'TableItem',
  components: {
    ProgressBarValidateSession,
    DetailsItem
  },
  props: {
    validators: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'lastBlock'
    ])
  },
  data () {
    return {
      isGrid: false,
      filter: '',
      pagination: {
        rowsPerPage: 20 // current rows per page being displayed
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
        { name: 'progress', align: 'left', label: 'PROGRESS (%)', field: 'progress' },
        { name: 'lastVote', align: 'left', label: 'LAST VOTE', field: 'lastVote' }
      ]
    }
  },
  methods: {
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
      return 'background-color: rgb(84, 93, 95);width: ' + (cumulativeStake * 1.17) + '%;border-right:' + (precent * 2.17) + 'px solid #87C5D6;text-align: right!important;height: 52px;margin:-9%;'
    }
  }
}
</script>
<style scoped>
 #custom-table {
   border-left: 0.5px solid #474F52;
   border-right: 2px solid #87C5D6;
   background: radial-gradient(circle, #344245 0%, #000709 70%);
   opacity:0.9;
 }
</style>

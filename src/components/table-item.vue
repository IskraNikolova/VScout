<template>
 <div class="q-mt-md">
    <q-btn size="xs" color="white" flat icon="apps" @click="isGrid=true"/>
    <q-btn size="xs" color="white" flat icon="reorder" @click="isGrid=false"/>
    <!--todo grid with v-for and card -->
    <span style="color: white;">{{ validators.length }}</span>
    <q-table
      :data="validators"
      :columns="columns"
      row-key="rank"
      :separator="separator"
      dark
      :grid="isGrid"
      id="custom-table"
    >
      <template v-slot:body="props">
        <q-tr :props="props" auto-width>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <div v-if="col.name === 'validator'" class="row">
              <div :style="'border: solid 2px ' + border + ';border-radius: 50px;'">
                <q-avatar size="24px" color="grey" class="column-2">{{ props.row.img }}</q-avatar>
              </div>
              <div @click="props.expand = !props.expand" class="column q-pl-xl">{{ col.value }}</div>
            </div>
            <div v-else-if="col.name === 'stake'">
              {{ col.value }} <small style="color: grey;"> ({{ props.row.stakenAva }} nAva)</small>
              <br />
              <small style="color: grey;">{{ props.row.precent }} %</small>
            </div>
            <div
              v-else-if="col.name === 'precent'"
              :style="getStyle(cumulativeStake(props.row.rank), props.row.precent)">
              {{ cumulativeStake(props.row.rank) }} %
            </div>
            <div v-else>{{ col.value }}</div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              Validator Identity: <span id="identity">{{ props.row.identity }}</span>
              {{ new Date(Number(props.row.startTime) * 1000).toISOString() }}
              {{ new Date(Number(props.row.endTime) * 1000).toISOString() }}
              <q-linear-progress dark stripe rounded size="20px" :value="progress(props.row.startTime, props.row.endTime)" color="red" :buffer="progress(props.row.startTime, props.row.endTime)" class="q-mt-sm" >
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="accent" :label="progress(props.row.startTime, props.row.endTime) * 100" />
                </div>
              </q-linear-progress>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
 </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TableItem',
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
        { name: 'validator', align: 'left', label: 'VALIDATOR', field: 'validator' },
        { name: 'stake', align: 'left', label: 'STAKE (AVA / nAva)', field: 'stake', sortable: true },
        { name: 'precent', align: 'left', label: 'CUMULATIVE STAKE (%)', field: 'cumulativeStake' },
        { name: 'lastVote', align: 'left', label: 'LAST VOTE', field: 'lastVote' }
      ]
    }
  },
  methods: {
    progress (startTime, endTime) {
      const allMinutes = this.getMinutesBetweenDates(startTime, endTime)
      const nowMinutes = this.getMinutesBetweenDates(startTime, this.getUnixTime())
      const result = (Number(nowMinutes) / Number(allMinutes))
      console.log(result)
      return this.round(result)
    },
    getUnixTime () { return Date.now() / 1000 | 0 },
    getMinutesBetweenDates (startDate, endDate) {
      startDate = new Date(Number(startDate) * 1000)
      endDate = new Date(Number(endDate) * 1000)
      var diff = endDate.getTime() - startDate.getTime()
      return Math.round(diff / 60000.0)
    },
    cumulativeStake (index) {
      return this.validators.reduce((result, item) => {
        if (item.rank <= index) {
          result += item.precent
        }

        return this.round(result)
      }, 0)
    },
    round (result) {
      const multiplier = Math.pow(1000, 1 || 0)
      const res = Math.round(result * multiplier) / multiplier
      return res
    },
    getStyle (cumulativeStake, precent) {
      return 'background-color: rgb(84, 93, 95);width: ' + (cumulativeStake * 500) + 'px;border-right:' + (precent * 500) + 'px solid #87C5D6;height: 50px;margin: -17px;text-align: right!important;'
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
 #identity {
   color: #87C5D6;
   font-size: 10px;
 }
</style>

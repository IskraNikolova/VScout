<template>
 <div class="q-mt-md">
    <q-btn size="xs" color="white" flat icon="apps" @click="isGrid=true"/>
    <q-btn size="xs" color="white" flat icon="reorder" @click="isGrid=false"/>
    <!--todo grid with v-for and card -->
    <q-table
      :data="data"
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
              {{ col.value.toLocaleString() }}
              <br />
              <small style="color: grey;">{{ props.row.precent }} %</small>
            </div>
            <div
              v-else-if="col.name === 'precent'"
              :style="getStyle(cumulativeStake(props.row.rank), props.row.precent)">
              {{ cumulativeStake(props.row.rank) }} %
            </div>
            <div v-else-if="col.name === 'lastVote'">
              {{ lastBlock.timestamp }}
            </div>
            <div v-else>{{ col.value }}</div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              Validator Identity: <span id="identity">{{ props.row.identity }}</span>
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
        { name: 'stake', align: 'left', label: 'STAKE (AVA)', field: 'stake' },
        { name: 'precent', align: 'left', label: 'CUMULATIVE STAKE (%)', field: 'cumulativeStake' },
        { name: 'lastVote', align: 'left', label: 'LAST VOTE', field: 'lastVote' }
      ],
      data: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // todo move to store
    getData () {
      let index = 1
      const vals = this.validators.map(val => {
        const rank = index++
        const validator = `${val.id.substr(0, 9)}...`
        const precent = this.getPrecent(val.stakeAmount)
        const identity = val.id
        const stake = Number(val.stakeAmount) / 10 ** 9
        const lastVote = 7644685475487
        const img = '?'
        return {
          rank,
          validator,
          precent,
          identity,
          stake,
          lastVote,
          img
        }
      })
      this.data = vals
    },
    getPrecent (v) {
      const result = ((Number(v) / 10 ** 9) / 360000000) * 100
      const multiplier = Math.pow(1000, 1 || 0)
      return Math.round(result * multiplier) / multiplier
    },
    cumulativeStake (index) {
      return this.data.reduce((result, item) => {
        if (item.rank <= index) {
          result += item.precent
        }
        const multiplier = Math.pow(1000, 1 || 0)
        return Math.round(result * multiplier) / multiplier
      }, 0)
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

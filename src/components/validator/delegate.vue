<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row">
        <div class="q-mb-md text-medium col-9 text-secondary">DELEGATE</div>
        <div class="col-auto">
          <span class="text-accent text-medium" v-if="getBorderIsDelegatable()">
            AVAILABLE
            <q-icon name="info">
              <tooltip-style v-bind:text="'The validator has available remaining capacity and enough remaining time for delegations. '" />
            </q-icon>
          </span>
          <span class="text-negative text-medium" v-else>
            UNAVAILABLE
            <q-icon name="info">
              <tooltip-style v-bind:text="'The validator has no available capacity and/or enough remaining time for delegation.'" />
            </q-icon>
          </span>
        </div>
      </div>
      <div>
        <span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATION FEE</small></span>
        <span class="on-right">{{ validator.delegationFee }}</span>
        <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">%</span>
      </div>
      <div>
        <span class="text-subtitle2"><small style="opacity: 0.8;">DELEGATION CAPACITY</small></span>
        <span class="on-right">{{ getFormatAva(remainingCapacity) }}</span>
        <span class="text-accent text-medium q-pl-xs" style="font-size: 12px;">AVAX</span>
      </div>

      <div class="text-subtitle2">
        <small style="opacity: 0.8;">REMAINING TIME </small>
        <span v-if="months > 0">
        {{ months }}
        <span class="text-accent"> Months </span>
        </span>
        {{ days }}
        <span class="text-accent"> Days </span>
        <span v-if="months < 1">
        {{ hours }}
        <span class="text-accent"> Hours</span>
        </span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { getAvaFromnAva } from './../../utils/avax.js'

export default {
  name: 'Delegate',
  props: {
    validator: {
      type: Object,
      required: true
    }
  },
  components: {
    TooltipStyle: () => import('components/tooltip-style')
  },
  computed: {
    remainingCapacity: function () {
      if (!this.validator.remainingCapacity) return 0
      return this.validator.remainingCapacity
    },
    delegationFee: function () {
      if (!this.validator.delegationFee) return 0
      return this.validator.delegationFee
    },
    dataArray: function () {
      if (!this.validator.remainingTime) return []
      return this.validator.remainingTime.split(':')
    },
    months: function () {
      return this.dataArray[0]
    },
    days: function () {
      return this.dataArray[1]
    },
    hours: function () {
      return this.dataArray[2]
    }
  },
  methods: {
    getBorderIsDelegatable () {
      if (!this.validator) return
      return this.validator.isMinimumAmountForStake &&
        this.validator.remainingCapacity > 25
    },
    getLocalString (val) {
      if (!val) return val
      return val.toLocaleString()
    },
    getFormatAva (val) {
      if (!val) return 0
      return this.getLocalString(getAvaFromnAva(val))
    }
  }
}
</script>

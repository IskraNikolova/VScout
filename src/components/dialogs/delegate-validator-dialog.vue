<template>
  <q-dialog
    v-model="ui.delegateValidatorDialog.isOpen"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="custom-card">
      <q-card-section class="row q-mr-xl">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="./../../statics/manage.svg" />
            </q-avatar>
            </q-item-section>
            <q-item-section>
            <q-item-label>
              Delegate a Validator to the Default Subnet
            </q-item-label>
            <q-item-label caption>
              A delegator stakes AVAX and specifies a validator (the delegatee) to validate on their behalf. The delegatee has an increased probability of being sampled by other validators (weight) in proportion to the stake delegated to them.
              The delegatee charges a fee to the delegator; the former receives a percentage of the delegator’s validation reward (if any.)
              The delegation period must be a subset of the perdiod that the delegatee validates the Default Subnet.
            </q-item-label>
            </q-item-section>
            <q-space />
            <q-btn size="xs" icon="close" flat round dense @click="onClose" />
        </q-item>
      </q-card-section>
      <div class="text-warning q-pl-md outlined" v-if="error">
        <q-icon name="report_problem" /> {{ error }}
      </div>
      <q-card-section class="q-pt-none">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
        >
          <div class="row">
            <div class="col-md-5 col-12 q-mr-xl q-pt-md q-pb-md">
              <q-input
                class="q-mb-md"
                color="accent"
                label-color="orange"
                v-model="nodeID"
                label="Node ID *"
                hint="The node ID of the delegatee"
                lazy-rules
                outlined clearable readonly
                :rules="[
                  val => val && val.length > 0 ||
                  'Please type your node ID!'
                ]"
              />
              <q-input
                class="q-mb-md q-pt-md"
                color="accent"
                outlined clearable
                label-color="orange"
                v-model="destination"
                label="Destination account *"
                hint="The address of the account the staked AVAX and validation reward (if applicable) are sent to at endTime."
                lazy-rules
                :rules="[
                  val => val !== null && val !== '' ||
                  'Please type your destination account!'
                ]"
              >
                <template v-slot:append>
                  <q-btn round dense @click="onCreatePAccount('destination')" flat no-caps color="accent" icon="person_add"/>
                  <p-create-account-dialog ref="pCreateAccount" />
                </template>
              </q-input>
              <q-input
                class="q-mb-md q-pt-md"
                color="accent"
                outlined clearable
                label-color="orange"
                v-model="payingAccount"
                label="Paying account *"
                hint="The account that is paying the transaction fee and providing the staked tokens."
                lazy-rules
                :rules="[
                  val => val !== null && val !== '' ||
                  'Please type your paying account!'
                ]"
              >
                <template v-slot:append>
                  <q-btn round dense @click="onCreatePAccount('paying')" flat no-caps color="accent" icon="person_add"/>
                  <p-create-account-dialog ref="pCreateAccount" />
                </template>
              </q-input>
            </div>
            <q-separator vertical class="q-mr-xl" />
            <div class="col-md-5 col-12 q-pr-xl q-pt-md">
              <q-input
                class="q-mb-md"
                color="accent"
                label-color="orange"
                v-model="stakeAmount"
                type="number"
                label="Stake Amount *"
                hint="The amount of nAVAX the delegator is staking."
                lazy-rules outlined
                :rules="[
                  val => val !== null && val !== '' ||
                  'Please type your stake amount'
                ]"
              />
              <q-input
                color="accent"
                class="q-pt-md"
                label-color="orange"
                label="Start Date"
                v-model="startDate"
                hint="The Unix time when the delegator starts delegating."
                lazy-rules outlined
                :rules="[
                  val => val !== null && val !== '' ||
                  'Please type your start date!',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="startDate" mask="YYYY-MM-DD HH:mm" color="accent"/>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="startDate" mask="YYYY-MM-DD HH:mm" format24h color="accent" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                color="accent"
                class="q-mb-md q-pt-md"
                label-color="orange"
                v-model="endDate"
                label="End Date"
                hint="The Unix time when the delegator stops delegating (and staked AVAX is returned)"
                lazy-rules outlined
                :rules="[
                  val => val !== null && val !== '' ||
                  'Please type your end date!',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="endDate" mask="YYYY-MM-DD HH:mm" color="accent"/>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="endDate" mask="YYYY-MM-DD HH:mm" format24h color="accent"/>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-pr-xl">
            <q-space />
            <q-btn size="md" label="Delegate" type="submit" color="accent"/>
            <q-btn size="md" label="Reset" type="reset" color="grey" flat class="q-ml-sm" />
          </div>
        </q-form>
        <sign-tx-dialog ref="signTxDialog" @txSend="closeDelegate"/>
        <create-user-dialog ref="createUserDialog"/>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'

import SignTxDialog from './sign-tx-dialog'
import CreateUserDialog from './create-user-dialog'
import PCreateAccountDialog from './p-create-account-dialog'

import {
  datePickerFormatStart,
  datePickerFormatEnd,
  toUnix
} from './../../modules/time'

import {
  DELEGATE_VALIDATOR
} from './../../store/app/types'

import {
  UPDATE_UI,
  OPEN_DELEGATE_VALIDATOR_DIALOG,
  CLOSE_DELEGATE_VALIDATOR_DIALOG
} from './../../store/ui/types'

export default {
  name: 'DelegateValidatorDialog',
  computed: {
    ...mapGetters([
      'ui',
      'currentBlockchain'
    ]),
    destination: {
      get: function () {
        return this.ui
          .formAccounts
          .destinationAccount
          .address
      },
      set: function (value) {
        this.$store.commit(UPDATE_UI, {
          formAccounts: {
            destinationAccount: {
              address: value
            }
          }
        })
      }
    },
    payingAccount: {
      get: function () {
        return this.ui
          .formAccounts
          .payingAccount
          .address
      },
      set: function (value) {
        this.$store.commit(UPDATE_UI, {
          formAccounts: {
            payingAccount: {
              address: value
            }
          }
        })
      }
    },
    startDate: {
      get: function () {
        let val
        if (!this.s) {
          val = this.ui.delegateValidatorDialog
          return datePickerFormatStart(val.validator.startTime)
        }
        return this.s
      },
      set: function (value) {
        this.s = value
      }
    },
    endDate: {
      get: function () {
        let val
        if (!this.e) {
          val = this.ui.delegateValidatorDialog
          return datePickerFormatEnd(val.validator.endTime)
        }
        return this.e
      },
      set: function (value) {
        this.e = value
      }
    },
    nodeID: {
      get: function () {
        const val = this.ui.delegateValidatorDialog
        if (!val) return ''
        return val.validator.validator
      }
    }
  },
  components: {
    SignTxDialog,
    CreateUserDialog,
    PCreateAccountDialog
  },
  data () {
    return {
      s: null,
      e: null,
      error: null,
      stakeAmount: null
    }
  },
  methods: {
    ...mapActions({
      openDelegate: OPEN_DELEGATE_VALIDATOR_DIALOG,
      addDefaultSubnetDelegator: DELEGATE_VALIDATOR,
      closeDelegate: CLOSE_DELEGATE_VALIDATOR_DIALOG
    }),
    onClose () {
      this.err = null
      this.closeDelegate()
    },
    onCreatePAccount (type) {
      this.$refs.pCreateAccount.openP({ type })
    },
    async onSubmit () {
      this.error = null

      const payingAccountBalance = this.ui
        .formAccounts
        .payingAccount
        .balance

      if (payingAccountBalance < this.stakeAmount) {
        this.error = 'Insufficient funds!'
        return
      }

      const params = {
        id: this.nodeID,
        destination: this.destination,
        startTime: toUnix(this.startDate),
        endTime: toUnix(this.endDate),
        stakeAmount: this.stakeAmount,
        payerNonce: 0
      }
      try {
        const unsignedTx = await this.addDefaultSubnetDelegator({
          params,
          signer: this.payingAccount
        })
        this.$refs.signTxDialog
          .openS({
            unsignedTx,
            signer: this.payingAccount
          })
      } catch (err) {
        this.error = err.message
      }
    },
    onReset () {
      this.error = null
      this.payingAccount = null
      this.destination = null
      this.stakeAmount = null
    }
  }
}
</script>

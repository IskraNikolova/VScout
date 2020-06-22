<template>
  <q-dialog
    v-model="ui.addValidatorDialog.isOpen"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="custom-card">
      <q-card-section class="row q-mr-xl">
        <div class="text-h6">
          Add a Validator to the Default Subnet
        </div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
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
                outlined clearable
                label-color="orange"
                v-model="nodeIDModel"
                label="Your node ID *"
                hint="Validators identify one another by their node IDs"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type your node ID!']"
              >
                <template v-slot:append>
                  <q-btn round dense @click="onGetNodeID" flat no-caps color="accent" icon="add"/>
                </template>
              </q-input>

              <q-input
                class="q-mb-md q-pt-md"
                color="accent"
                outlined clearable
                label-color="orange"
                v-model="destination"
                label="Destination account *"
                hint="The staked AVA tokens and rewards are sent to an account that is specified. The validation reward is also sent to the same account as the staked AVA."
                lazy-rules
                :rules="[
                  val => val !== null && val !== '' ||
                  'Please type your destination account!',
                  val => val.length === 33 ||
                  'Invalid account!'
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
                  'Please type your paying account!',
                  val => val.length === 33 ||
                  'Invalid account!'
                ]"
              >
                <template v-slot:append>
                  <q-btn round dense @click="onCreatePAccount('paying')" flat no-caps color="accent" icon="person_add"/>
                  <p-create-account-dialog ref="pCreateAccount" />
                </template>
              </q-input>
              <q-input
                color="accent"
                class="q-pt-md"
                label-color="orange"
                label="Start Date"
                v-model="startDate"
                hint="The start time must be in the future relative to the time the transaction is issued."
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
                hint="In order to validate the Default Subnet one must stake AVA tokens. The minimum amount that one can stake is 10 μAVA."
                lazy-rules outlined
                :rules="[
                  val => val !== null && val !== '' ||
                  'Please type your stake amount',
                  val => val > 10000 && val < 35000000000 ||
                  'Invalid amount!'
                ]"
              />
              <q-input
                color="accent"
                class="q-mb-md q-pt-md"
                clearable outlined
                type="number"
                label-color="orange"
                v-model="delegationFeeRate"
                label="Delegation Fee"
                hint="Percent fee this validator charges when others delegate stake to them, multiplied by 10,000."
              />
              <q-input
                color="accent"
                class="q-mb-md q-pt-md"
                label-color="orange"
                v-model="endDate"
                label="End Date"
                hint="The minimum duration that one can validate the Default Subnet is 24 hours, and the maximum duration is one year."
                lazy-rules outlined
                :rules="[
                  val => val !== null && val !== '' ||
                  'Please type your end date!',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="endDate" mask="YYYY-MM-DD HH:mm" color="accent" />
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="endDate" mask="YYYY-MM-DD HH:mm" format24h color="accent" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-pr-xl">
            <q-space />
            <q-btn size="md" label="Add Validator" type="submit" color="accent"/>
            <q-btn size="md" label="Reset" type="reset" color="grey" flat class="q-ml-sm" />
          </div>
        </q-form>
        <sign-tx-dialog ref="signTxDialog" />
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
import { datePickerFormat, toUnix } from './../../modules/time'

import {
  GET_NODE_ID, GET_ACCOUNT,
  ADD_VALIDATOR_TO_DEFAULT_SUBNET
} from './../../store/app/types'

import {
  UPDATE_UI,
  OPEN_ADD_VALIDATOR_DIALOG,
  CLOSE_ADD_VALIDATOR_DIALOG
} from './../../store/ui/types'

export default {
  name: 'AddValidatorDialog',
  computed: {
    ...mapGetters([
      'ui',
      'nodeID',
      'subnetID',
      'networkEndpoint',
      'currentBlockchain',
      'isDefaultSubnetID'
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
    }
  },
  components: {
    SignTxDialog,
    CreateUserDialog,
    PCreateAccountDialog
  },
  data () {
    return {
      error: null,
      endDate: null,
      startDate: null,
      stakeAmount: null,
      nodeIDModel: null,
      delegationFeeRate: null
    }
  },
  created () {
    this.setInitDates()
    this.error = null
  },
  methods: {
    ...mapActions({
      getNodeId: GET_NODE_ID,
      getAccount: GET_ACCOUNT,
      open: OPEN_ADD_VALIDATOR_DIALOG,
      close: CLOSE_ADD_VALIDATOR_DIALOG,
      addValidatorToDef: ADD_VALIDATOR_TO_DEFAULT_SUBNET
    }),
    setInitDates () {
      this.endDate = datePickerFormat({ value: 2, label: 'd' })
      this.startDate = datePickerFormat({ value: 10, label: 'm' })
    },
    onCreatePAccount (type) {
      this.$refs.pCreateAccount.openP({ type })
    },
    async onGetNodeID () {
      this.error = null
      await this.getNodeId()
      this.nodeIDModel = this.nodeID
    },
    async onSubmit () {
      this.error = null
      const destination = this.ui
        .formAccounts
        .destinationAccount
        .address

      const params = {
        id: this.nodeID,
        destination,
        startTime: toUnix(this.startDate),
        endTime: toUnix(this.endDate),
        stakeAmount: this.stakeAmount,
        payerNonce: 0
      }
      if (this.delegationFeeRate) {
        params.delegationFeeRate = this.delegationFeeRate
      }
      try {
        const unsignedTx = await this.addValidatorToDef({
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
      this.setInitDates()
      this.destination = null
      this.nodeIDModel = null
      this.stakeAmount = null
      this.delegationFeeRate = null
    }
  }
}
</script>

<template>
  <q-dialog
    v-model="ui.addValidatorDialog.isOpen"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card style="min-width: 500px!important;">
      <q-bar class="bg-white text-grey" bordered>
        <small><q-icon color="negative" name="router"/> {{ networkEndpoint }}</small>
        <q-space />
        <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
          <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">Minimize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
          <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">Maximize</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" @click="close">
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="text-h6">Add a Validator to the Default Subnet</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <q-input
            color="accent"
            outlined
            clearable
            label-color="negative"
            v-model="nodeID"
            label="Your node ID *"
            hint="Validators identify one another by their node IDs"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type your node ID!']"
          >
            <template v-if="networkEndpoint.includes('http://127.0.0.1:')" v-slot:append>
              <q-btn round dense @click="onGetNodeID" flat no-caps color="accent" icon="add"/>
            </template>
          </q-input>

          <q-input
            color="accent"
            outlined
            clearable
            label-color="negative"
            v-model="destination"
            label="Destination account *"
            hint="The staked AVA tokens and rewards are sent to an account that is specified. The validation reward is also sent to the same account as the staked AVA."
            lazy-rules
            :rules="[
              val => val !== null && val !== '' || 'Please type your destination account!',
              val => val.length === 33 || 'Invalid account!'
            ]"
          >
            <template v-if="networkEndpoint.includes('http://127.0.0.1:')" v-slot:append>
              <q-btn round dense @click="onCreatePAccount('destination')" flat no-caps color="accent" icon="person_add"/>
              <p-create-account-dialog ref="pCreateAccount" />
            </template>
          </q-input>
          <q-input
            class="q-pt-md"
            color="accent"
            outlined
            clearable
            label-color="negative"
            v-model="payingAccount"
            label="Paying account *"
            hint="The account that is paying the transaction fee and providing the staked tokens."
            lazy-rules
            :rules="[
              val => val !== null && val !== '' || 'Please type your paying account!',
              val => val.length === 33 || 'Invalid account!'
            ]"
          >
            <template v-if="networkEndpoint.includes('http://127.0.0.1:')" v-slot:append>
              <q-btn round dense @click="onCreatePAccount('paying')" flat no-caps color="accent" icon="person_add"/>
              <p-create-account-dialog ref="pCreateAccount" />
            </template>
          </q-input>
          <q-input
            class="q-pt-md"
            color="accent"
            outlined
            label-color="negative"
            label="Start Date"
            v-model="startDate"
            hint="The start time must be in the future relative to the time the transaction is issued."
            lazy-rules
            :rules="[
              val => val !== null && val !== '' || 'Please type your start date!',
              // val => val < Date.now() || 'Inavalid date!'
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
            class="q-pt-md"
            outlined
            label-color="negative"
            v-model="endDate"
            label="End Date"
            hint="The minimum duration that one can validate the Default Subnet is 24 hours, and the maximum duration is one year."
            lazy-rules
            :rules="[
              val => val !== null && val !== '' || 'Please type your end date!',
              // val => val < Date.now() || 'Inavalid date!'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="endDate" mask="YYYY-MM-DD HH:mm" />
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="endDate" mask="YYYY-MM-DD HH:mm" format24h />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            color="accent"
            class="q-pt-md"
            outlined
            label-color="negative"
            v-model="stakeAmount"
            type="number"
            label="Stake Amount *"
            hint="In order to validate the Default Subnet one must stake AVA tokens. The minimum amount that one can stake is 10 μAVA."
            lazy-rules
            :rules="[
              val => val !== null && val !== '' || 'Please type your stake amount',
              val => val > 0 && val < 35000000000 || 'Invalid amount!'
            ]"
          />
          <q-input
            color="accent"
            class="q-pt-md"
            clearable
            outlined
            type="number"
            label-color="negative"
            v-model="delegationFeeRate"
            label="Delegation Fee"
            hint="Percent fee this validator charges when others delegate stake to them, multiplied by 10,000."
          />
          <div class="q-pt-md">
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
import { mapActions, mapGetters } from 'vuex'
import { datePickerFormat, toUnix } from './../modules/time'

import PCreateAccountDialog from './p-create-account-dialog'
import SignTxDialog from './sign-tx-dialog'
import CreateUserDialog from './create-user-dialog'

import {
  GET_NODE_ID, GET_ACCOUNT,
  ADD_VALIDATOR_TO_DEFAULT_SUBNET
} from './../store/app/types'

import {
  OPEN_ADD_VALIDATOR_DIALOG,
  CLOSE_ADD_VALIDATOR_DIALOG,
  UPDATE_UI
} from './../store/ui/types'

export default {
  name: 'AddValidatorDialog',
  computed: {
    ...mapGetters([
      'ui',
      'currentBlockchain',
      'networkEndpoint'
    ]),
    destination: {
      get: function () {
        return this.ui.addValidatorDialog.destinationAccount.address
      },
      set: function (value) {
        this.$store.commit(UPDATE_UI, {
          addValidatorDialog: {
            isOpen: true,
            destinationAccount: {
              address: value
            },
            payingAccount: {
              address: this.payingAccount
            }
          }
        })
      }
    },
    payingAccount: {
      get: function () {
        return this.ui.addValidatorDialog.payingAccount.address
      },
      set: function (value) {
        this.$store.commit(UPDATE_UI, {
          addValidatorDialog: {
            isOpen: true,
            destinationAccount: {
              address: this.destination
            },
            payingAccount: {
              address: value
            }
          }
        })
      }
    }
  },
  components: {
    PCreateAccountDialog,
    CreateUserDialog,
    SignTxDialog
  },
  data () {
    return {
      maximizedToggle: false,
      nodeID: null,
      startDate: null,
      endDate: null,
      stakeAmount: null,
      delegationFeeRate: null
    }
  },
  created () {
    this.setInitDates()
  },
  methods: {
    ...mapActions({
      open: OPEN_ADD_VALIDATOR_DIALOG,
      close: CLOSE_ADD_VALIDATOR_DIALOG,
      getNodeId: GET_NODE_ID,
      getAccount: GET_ACCOUNT,
      addValidatorToDef: ADD_VALIDATOR_TO_DEFAULT_SUBNET
    }),
    setInitDates () {
      this.startDate = datePickerFormat({ value: 10, label: 'm' })
      this.endDate = datePickerFormat({ value: 2, label: 'd' })
    },
    onCreatePAccount (type) {
      this.$refs.pCreateAccount.openP({ type })
    },
    async onGetNodeID () {
      // todo check for errors
      const nodeID = await this.getNodeId()
      this.nodeID = nodeID
    },
    async onSubmit () {
      const destination = this.ui.addValidatorDialog.destinationAccount.address

      const params = {
        id: this.nodeID,
        destination,
        startTime: toUnix(this.startDate),
        endTime: toUnix(this.endDate),
        stakeAmount: this.stakeAmount,
        payerNonce: 0
      }
      if (this.delegationFeeRate) params.delegationFeeRate = this.delegationFeeRate
      try {
        const unsignedTx = await this.addValidatorToDef({ params, signer: this.payingAccount })
        this.$refs.signTxDialog.openS({ unsignedTx, signer: this.payingAccount })
      } catch (err) {
        alert(err.message)
      }
    },
    onReset () {
      this.nodeID = null
      this.setInitDates()
      this.stakeAmount = null
      this.delegationFeeRate = null
      this.destination = null
    }
  }
}
</script>

<template>
  <q-dialog
    no-focus
    v-model="ui.pCreate.isOpen"
    persistent
  >
    <q-card style="min-width: 500px!important;">
      <q-card-section class="row items-center">
        <div class="text-h7">Platform Account</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onClose" />
      </q-card-section>
      <div class="text-warning q-pl-md outlined" v-if="error">
        <q-icon name="report_problem" /> {{ error }}
      </div>
      <q-card-section>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
        >
          <q-input
            color="accent"
            class="q-mb-xs"
            outlined
            clearable
            label-color="orange"
            v-model="username"
            label="Username *"
            hint="Use exist user on this node."
            lazy-rules
            @focus="error=null"
            :rules="[ val => val && val.length > 0 || 'Please type your username!']"
          />
          <q-input
            color="accent"
            class="q-mb-xs"
            outlined
            clearable
            type="password"
            label-color="orange"
            v-model="password"
            @focus="error=null"
            label="Password *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type your password!']"
          />
          <div v-if="ui.pCreate.type === 'paying'" >
            <q-input
              v-if="dismissFund"
              color="accent"
              outlined
              clearable
              label-color="orange"
              v-model="fundAmount"
              suffix="$nAVA"
              label="Fund Amount *"
              hint="The minimum stake amount is 10,000 nAVA, so make sure you have at least this much AVA in your X-Chain addresses"
              lazy-rules
              :rules="[ val => val && val >= 10000 || 'Amount must be least 10,000 nAVA']"
            />
            <q-toggle
              class="q-pt-md"
              color="accent"
              v-model="dismissFund"
              label="Fund this P-Chain account with stake amount."
            />
          </div>
          <div>
            <q-btn
              label="Create"
              class="full-width"
              type="submit"
              size="10px"
              color="accent"
              :loading="progressCreate"
            >
              <template v-slot:loading>
                <q-spinner-ball class="on-left" />
                Connecting to the node
              </template>
            </q-btn>
            <div class="row q-pt-md q-pl-xl q-pr-xl">
              <div class="col-5">
                <q-separator class="q-mt-md"/>
              </div>
              <div style="margin-left: 20px;" class="col q-mt-xs q-ml-xs">
                <small>OR</small>
              </div>
              <div class="col-5">
                <q-separator class="q-mt-md"/>
              </div>
            </div>
            <q-btn
              label="Select"
              :loading="progressSelect"
              class="full-width q-mt-md"
              @click="onSelect"
              size="10px"
              color="accent"
            >
              <template v-slot:loading>
                <q-spinner-ball class="on-left" />
                Connecting to the node
              </template>
            </q-btn>
            <select-account ref="selectAccount" @select="onSelectItem"/>
          </div>
        </q-form>
        <q-separator class="q-mt-xl"/>
        <div class="flex flex-center q-pt-xs">
          <small class="text-grey">Don't have an account?</small>
          <q-btn @click="onOpenCreateUserD" size="xs" flat color="accent" label="Create" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import SelectAccount from './select-account'

import {
  CREATE_ACCOUNT,
  FUND_ACCOUNT,
  LIST_ACCOUNTS
} from './../store/app/types'

import {
  OPEN_P_CREATE,
  CLOSE_P_CREATE,
  OPEN_CREATE_USER,
  UPDATE_UI
} from './../store/ui/types'

export default {
  name: 'PCreateAccountDialog',
  components: {
    SelectAccount
  },
  computed: {
    ...mapGetters([
      'ui'
    ])
  },
  data () {
    return {
      username: null,
      password: null,
      fundAmount: null,
      dismissFund: false,
      error: null,
      progressSelect: false,
      progressCreate: false
    }
  },
  created () {
    this.error = null
  },
  methods: {
    ...mapActions({
      openP: OPEN_P_CREATE,
      closeP: CLOSE_P_CREATE,
      createAccount: CREATE_ACCOUNT,
      fundAccount: FUND_ACCOUNT,
      listAccounts: LIST_ACCOUNTS,
      openU: OPEN_CREATE_USER
    }),
    onOpenCreateUserD () {
      this.onClose()
      this.openU()
    },
    onClose () {
      this.error = null
      this.closeP()
    },
    async onSubmit () {
      this.progressCreate = true
      this.error = null
      try {
        await this.createAccount({
          username: this.username,
          password: this.password,
          type: this.ui.pCreate.type
        })

        if (this.dismissFund) {
          await this.fundAccount({
            to: this.ui.formAccounts.payingAccount.address,
            nonce: Number(this.ui.formAccounts.payingAccount.nonce),
            amount: this.fundAmount,
            username: this.username,
            password: this.password
          })
          this.dismissFund = false
        }
        this.progressCreate = false
        this.closeP()
      } catch (err) {
        this.progressCreate = false
        this.error = err.message
      }
    },
    async onSelect () {
      this.progressSelect = true
      this.error = null
      try {
        const { accounts } = await this.listAccounts({
          username: this.username,
          password: this.password
        })

        this.$refs.selectAccount.openSelectAccounts({ accounts })
        this.progressSelect = false
      } catch (err) {
        this.progressSelect = false
        this.error = err.message
      }
    },
    async onSelectItem (e) {
      const temp = {
        paying: () => {
          this.$store.commit(UPDATE_UI, {
            formAccounts: {
              payingAccount: e
            }
          })
        },
        destination: () => {
          this.$store.commit(UPDATE_UI, {
            formAccounts: {
              destinationAccount: e
            }
          })
        }
      }

      temp[this.ui.pCreate.type]()
      this.$refs.selectAccount.closeSelectAccounts()
      this.closeP()
      if (this.dismissFund) {
        try {
          await this.fundAccount({
            to: this.ui.formAccounts.payingAccount.address,
            nonce: Number(this.ui.formAccounts.payingAccount.nonce),
            amount: this.fundAmount,
            username: this.username,
            password: this.password
          })
          this.dismissFund = false
          this.closeP()
        } catch (err) {
          this.error = err.message
        }
      }
    }
  }
}
</script>

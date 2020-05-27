<template>
  <q-dialog
    no-focus
    v-model="ui.pCreate.isOpen"
    persistent
  >
    <q-card style="min-width: 280px!important;">
      <q-card-section class="row items-center">
        <div class="text-h7">Create Platform Account</div>
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
              label-color="negative"
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
              label-color="negative"
              v-model="password"
              @focus="error=null"
              label="Password *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type your password!']"
            />
            <div v-if="isFund" >
              <q-input
                v-if="dismissFund"
                color="accent"
                outlined
                clearable
                label-color="negative"
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
              <q-btn label="Create" class="full-width" type="submit" size="10px" color="accent"/>
            </div>
          </q-form>
          <q-separator class="q-mt-md"/>
          <div class="flex flex-center q-pt-xs">
            <small class="text-grey">Don't have an account?</small>
            <q-btn @click="onOpenCreateUserD" size="xs" flat color="accent" label="Sign Up" />
            <create-user-dialog ref="createUserDialog"/>
          </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import CreateUserDialog from './create-user-dialog'

import {
  CREATE_ACCOUNT,
  FUND_ACCOUNT
} from './../store/app/types'

import {
  OPEN_P_CREATE,
  CLOSE_P_CREATE
} from './../store/ui/types'

export default {
  name: 'PCreateAccountDialog',
  components: {
    CreateUserDialog
  },
  computed: {
    ...mapGetters([
      'ui'
    ]),
    isFund: function () {
      const temp = {
        paying: true
      }
      return temp[this.ui.pCreate.type]
    }
  },
  data () {
    return {
      username: null,
      password: null,
      fundAmount: null,
      dismissFund: true,
      error: null
    }
  },
  created () {
    this.error = null
    this.dismissFund = this.isFund
  },
  methods: {
    ...mapActions({
      openP: OPEN_P_CREATE,
      closeP: CLOSE_P_CREATE,
      createAccount: CREATE_ACCOUNT,
      fundAccount: FUND_ACCOUNT
    }),
    onOpenCreateUserD () {
      this.$refs.createUserDialog.openU()
    },
    onClose () {
      this.error = null
      this.closeP()
    },
    async onSubmit () {
      this.error = null
      try {
        await this.createAccount({
          username: this.username,
          password: this.password,
          type: this.ui.pCreate.type
        })
        if (this.dismissFund) {
          await this.fundAccount({
            amount: this.fundAmount,
            username: this.username,
            password: this.password
          })
          this.dismissFund = false
        }
        this.closeP()
      } catch (err) {
        this.error = err.message
      }
    }
  }
}
</script>

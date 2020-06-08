<template>
  <q-dialog
    no-focus
    v-model="ui.signTx.isOpen"
    persistent
  >
    <q-card style="min-width: 380px!important;">
      <q-card-section class="row items-center">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="~assets/sign.svg" />
            </q-avatar>
            </q-item-section>
            <q-item-section>
            <q-item-label>Sign the Transaction</q-item-label>
            <q-item-label caption>
              The provided user must control that account; provide your username and password to authenticate.
            </q-item-label>
            </q-item-section>
        </q-item>
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
              readonly
              autogrow
              color="accent"
              class="q-mb-xs"
              outlined
              label="Unsigned Tx"
              label-color="orange"
              v-model="ui.signTx.unsignedTx"
            />
            <q-input
              readonly
              color="accent"
              class="q-mb-xs"
              outlined
              label-color="orange"
              label="Signer"
              v-model="ui.signTx.signer"
              hint="The account providing the staked AVA and the fee."
            />
            <q-space />
            <q-input
              color="accent"
              class="q-mb-xs"
              outlined
              clearable
              label-color="orange"
              v-model="username"
              label="Username *"
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
            <div>
              <q-btn label="Sign" outline type="submit" color="accent"/>
              <q-btn label="Cancel" color="grey" flat class="q-ml-sm" @click="closeS"/>
            </div>
          </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import {
  SIGN_TX
} from './../store/app/types'

import {
  OPEN_SIGN_TX,
  CLOSE_SIGN_TX
} from './../store/ui/types'

export default {
  name: 'SignTxDialog',
  computed: {
    ...mapGetters([
      'ui'
    ])
  },
  data () {
    return {
      username: null,
      password: null,
      error: null
    }
  },
  created () {
    this.error = null
  },
  methods: {
    ...mapActions({
      openS: OPEN_SIGN_TX,
      closeS: CLOSE_SIGN_TX,
      signTx: SIGN_TX
    }),
    async onSubmit () {
      try {
        const signedTx = await this.signTx({
          transaction: this.ui.signTx.unsignedTx,
          signer: this.ui.signTx.signer,
          username: this.username,
          password: this.password
        })
        console.log(signedTx)
        this.closeS(signedTx)
      } catch (err) {
        console.log(err)
        this.error = err.message
      }
    }
  }
}
</script>

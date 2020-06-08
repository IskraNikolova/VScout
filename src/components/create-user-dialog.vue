<template>
  <q-dialog v-model="ui.uCreate.isOpen" persistent >
    <q-card style="max-width: 600px!important;min-height: 370px;">
      <q-card-section class="row">
        <q-card-section class="row items-center">
          <!--Header Panel -->
          <q-item>
            <q-item-section avatar>
              <img src="~assets/user.svg" style="width: 30px;"/>
            </q-item-section>
            <q-item-section style="max-width: 70%;">
              <q-item-label>Create User</q-item-label>
              <q-item-label caption>
                A user is a password-protected identity that a client can use when interacting with blockchains.
              </q-item-label>
              </q-item-section>
              <q-space />
            <q-btn icon="close" flat round dense @click="closeU" />
          </q-item>
          <div class="text-warning q-pl-md" v-if="error">
            <q-icon name="report_problem" /> {{ error }}
          </div>
        </q-card-section>
         <!--Form panel-->
          <q-card-section>
            <q-form
              @submit="onSubmit"
              @reset="onReset"
              class="q-gutter-md"
            >
              <div class="row">
                <div class="col-md-6 col-xs-12">
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
                </div>
                <!-- Create address, QR Code Panel -->
                <div class="col-md-6 col-xs-12">
                  <q-card-section>
                    <div v-if="!hasQr" class="qr"><small>QR Code</small></div>
                    <div v-else>
                      <div style="text-align: center;"><canvas id="qr-code"></canvas></div>
                      <div><small>{{ address }}</small></div>
                    </div>
                    <q-inner-loading :showing="visible">
                      <q-spinner-tail size="50px" color="orange" />
                    </q-inner-loading>
                    <div class="text-grey">
                      <q-checkbox keep-color color="accent" v-model="createAddress" label="Create a new address controlled by the given user." />
                    </div>
                  </q-card-section>
                </div>
              </div>
              <div class="q-pb-xs row">
                <q-space />
                <q-btn label="Create" type="submit" size="10px" color="accent"/>
                <q-btn label="Reset" type="reset" flat size="10px" color="accent"/>
              </div>
            </q-form>
          </q-card-section>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

var QRCode = require('qrcode')

import {
  CREATE_USER
} from './../store/app/types'

import {
  OPEN_CREATE_USER,
  CLOSE_CREATE_USER
} from './../store/ui/types'

export default {
  name: 'CreateUserDialog',
  computed: {
    ...mapGetters([
      'ui'
    ])
  },
  data () {
    return {
      username: null,
      password: null,
      error: null,
      createAddress: true,
      hasQr: false,
      visible: false,
      address: null
    }
  },
  mounted () {
    this.error = null
  },
  methods: {
    ...mapActions({
      openU: OPEN_CREATE_USER,
      closeU: CLOSE_CREATE_USER,
      createUser: CREATE_USER
    }),
    setQrCode (text) {
      if (!text) return
      QRCode.toCanvas(document.getElementById('qr-code'), text, function (error) {
        if (error) console.error(error)
      })
    },
    onClose () {
      this.error = null
      this.closeU()
    },
    async onSubmit () {
      this.error = null
      try {
        this.hasQr = this.createAddress
        this.visible = true
        const result = await this.createUser({
          username: this.username,
          password: this.password,
          withAddress: this.createAddress
        })
        this.visible = false
        this.setQrCode(result.address)
        this.address = result.address
      } catch (err) {
        this.hasQr = false
        this.visible = false
        this.error = err.message
      }
    },
    onReset () {
      this.username = null
      this.password = null
      this.createAddress = false
      this.error = null
      this.address = null
      this.hasQr = null
    }
  }
}
</script>

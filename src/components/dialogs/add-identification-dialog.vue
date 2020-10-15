<template>
  <q-dialog
    v-model="ui.addIdentification.isOpen"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-pl-xs q-pt-md q-pb-md iden-card">
      <q-card-section class="row">
        <q-item class="col-10">
          <q-item-section avatar>
            <q-avatar>
              <img src="~assets/id.svg" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">Add/Update Validator Identification</q-item-label>
            <q-item-label caption>
              Validators identification data is stored on a smart contract.
            </q-item-label>
          </q-item-section>
        </q-item>
        <div class="col-2"><q-btn icon="close" flat round dense  @click="onClose" /></div>
      </q-card-section>
      <div class="text-warning q-pl-md outlined" v-if="error">
        <q-icon name="report_problem" /> {{ error }}
      </div>
      <div class="text-positive q-pl-md outlined" v-if="notify">
        {{ notify }}
      </div>
      <q-card-section>
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md q-pt-xl"
        >
          <div class="row">
            <div class="col-md-5 col-12 q-mr-xl q-pb-md">
              <q-input
                color="accent"
                class="q-mb-md"
                outlined
                label-color="orange"
                v-model="nodeIDModel"
                label="Your node ID *"
                hint="The validator node ID."
              >
                <template v-slot:append>
                  <q-btn round dense @click="onGetNodeID" :loading="loading" flat no-caps color="accent" icon="add">
                    <template v-slot:loading>
                      <q-spinner-ball />
                    </template>
                  </q-btn>
                </template>
              </q-input>
              <q-input
                color="accent"
                class="q-mb-md"
                outlined
                clearable
                label-color="orange"
                v-model="name"
                label="Validator Name"
                hint="Validator's Name will be show on validator's list instead validator ID."
                :error="validateData.errors.name"
              />
              <q-input
                color="accent"
                class="q-mb-xs"
                outlined
                clearable
                label-color="orange"
                v-model="avatar"
                label="Avatar Url"
                hint="For avatar you must use url.(optional)"
                :error="validateData.errors.avatar"
              />
            </div>
            <q-separator vertical class="q-mr-xl" />
            <div class="col-md-5 col-12 q-pr-xl">
                <q-input
                  type="textarea"
                  color="accent"
                  class="q-mb-xs"
                  outlined
                  label-color="orange"
                  v-model="bio"
                  label="Bio "
                  hint="Bio (optional)"
                />
                <q-input
                  color="accent"
                  class="q-mb-xs"
                  outlined
                  label-color="orange"
                  v-model="website"
                  label="Website "
                  hint="Website (optional)"
                />
                <q-input
                  color="accent"
                  class="q-mb-xs"
                  outlined
                  clearable
                  label-color="orange"
                  v-model="link"
                  label="Link"
                  hint="Your business link or other.(optional)"
                  :error="validateData.errors.link"
                />
            </div>
          </div>
        <div class="row q-pr-xl">
          <div>
            <div class="row">
              <q-input
                size="xs"
                outlined
                color="accent"
                label-color="orange"
                v-model="vCode"
                clearable
                label="Verification Code"
                hint="Your verifaction code."
              />
            </div>
            <q-btn flat size="xs" color="negative" label="No code?" @click="onVerify"/>
          </div>
          <q-space />
          <q-btn label="Add To Contract" flat outline type="submit" color="accent"/>
          <q-btn size="xs" label="Reset" type="reset" color="grey" flat class="q-ml-sm" />
        </div>
        </q-form>
      </q-card-section>
    </q-card>
    <q-dialog v-model="dialog">
        <q-card flat class="q-pb-md">
          <q-card-section class="row items-center bg-secondary">
            <q-img
              style="width: 30vw;max-width: 30px;margin: auto;"
              src="https://wallet.avax.network/img/diamond-primary.6818c3c7.svg"
            />
            <q-btn icon="close" class="text-white" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section style="min-height: 125px;">
            <div class="text-subtitle2">
              <p id="label">
                <p>Send 0.1 <span class="text-medium text-accent"><small> AVAX</small></span></p>
                <p>
                  To:
                  <span
                    style="font-size: 15px;cursor: pointer;"
                    @click="copyToClipboard(admin)"
                    class="text-secondary text-medium"
                  >
                    {{ admin }}
                  </span>
                </p>
                <p>Supplies the fees required to make an ID record in the smart contract!</p>
            </div>
          </q-card-section>

          <q-card-actions class="q-mt-md" v-if="!isPaidSuccess">
            <q-input
              class="col-8"
              size="xs"
              outlined
              color="grey"
              v-model="txID"
              clearable
              label="Tx ID..."
            />
            <q-card-actions align="right" class="col-4">
              <q-btn flat no-caps label="Confirm" @click="check"/>
            </q-card-actions>
          </q-card-actions>
        </q-card>
      </q-dialog>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DOMPurify from 'dompurify'

import {
  SET_CODE
} from './../../store/access/types.js'

import {
  getDurationByMinutesCount
} from './../../modules/time.js'

import {
  _getTxApi
} from './../../modules/network.js'

import {
  copyToClipboard
} from 'quasar'

import {
  _setValidatorInfo,
  _isValidCode
} from './../../modules/networkCChain.js'

const {
  network
} = require('./../../modules/config.js')
  .default

import {
  GET_NODE_ID
} from './../../store/app/types'

import {
  UPDATE_UI,
  OPEN_ADD_IDENTIFICATION,
  CLOSE_ADD_IDENTIFICATION
} from './../../store/ui/types'

export default {
  name: 'AddIdentificationDialog',
  data () {
    return {
      txID: '',
      website: '',
      isValidCode: false,
      isPaidSuccess: false,
      vCode: '',
      loading: null,
      name: '',
      link: '',
      bio: '',
      error: null,
      avatar: '',
      notify: '',
      nodeIDModel: '',
      dialog: false,
      admin: ''
    }
  },
  created () {
    this.admin = network.admin
  },
  computed: {
    ...mapGetters([
      'nodeID',
      'code',
      'ui',
      'validatorById',
      'networkEndpoint'
    ]),
    validateData () {
      const inputAvatar = `<img src="${this.avatar}">`
      const inputLink = `<a href="${this.link}"></a>`
      return {
        errors: {
          name: (DOMPurify.sanitize(this.name) !== this.name) && this.name,
          bio: (DOMPurify.sanitize(this.bio) !== this.bio) && this.bio,
          link: DOMPurify.sanitize(inputLink) !== inputLink,
          avatar: DOMPurify.sanitize(inputAvatar) !== inputAvatar
        }
      }
    }
  },
  methods: {
    ...mapActions({
      getNodeId: GET_NODE_ID,
      openAddId: OPEN_ADD_IDENTIFICATION,
      closeAddId: CLOSE_ADD_IDENTIFICATION
    }),
    async check () {
      const tx = await _getTxApi(this.txID.trim())
      const { outputs, timestamp } = tx
      if (!outputs) {
        this.$q.notify({
          message: 'Something Wrong!',
          color: 'white',
          textColor: 'black',
          position: 'center',
          timeout: 1000
        })
        return
      }
      const minutes = getDurationByMinutesCount(timestamp)
      if (minutes > 120) {
        this.$q.notify({
          message: 'Verification Transaction Failed! Expired Transaction.',
          color: 'white',
          textColor: 'black',
          position: 'center',
          timeout: 1000
        })
        return
      }
      if (this.searchToAddress(outputs)) {
        this.onSubmit()
        this.dialog = false
        this.isPaidSuccess = true
      } else {
        this.$q.notify({
          message: 'Verification Transaction Failed!',
          color: 'white',
          textColor: 'black',
          position: 'center',
          timeout: 1000
        })
      }
    },
    searchToAddress (outputs) {
      let result = false
      let amount = 0
      for (let i = 0; i < outputs.length; i++) {
        const output = outputs[i]
        const isIncl = output
          .addresses
          .includes(this.admin.substr(2))
        if (isIncl) {
          result = isIncl
          amount = Number(output.amount)
        }
      }
      return result && amount >= 100000000
    },
    copyToClipboard (id) {
      if (!id) return

      copyToClipboard(id)
      this.$q.notify({
        message: 'Copied to clipboard!',
        color: 'white',
        textColor: 'black',
        position: 'center',
        timeout: 1000
      })
    },
    onClose () {
      this.closeAddId()
      this.onReset()
    },
    async onSubmit () {
      if (!this.link && !this.name && !this.avatar && !this.bio) {
        this.error = 'Empty fields!'
        return
      }
      this.isValidCode = await _isValidCode(this.vCode, this.nodeIDModel)
      if (!this.vCode || !this.isValidCode) {
        this.error = 'Invalid code!'
        return
      }

      if (!this.code && !this.isPaidSuccess) {
        this.dialog = true
        return
      }

      try {
        const txHash = await _setValidatorInfo({
          link: this.link,
          name: this.name,
          website: this.website,
          bio: this.bio,
          avatar: this.avatar,
          nodeID: this.nodeIDModel,
          code: this.vCode
        })
        this.$q.notify({
          timeout: 5000,
          color: 'white',
          position: 'center',
          message: `Transaction hash is ${txHash}.Your transaction is being broadcasted to the blockchain! Please hold on!`
        })
        this.$store.commit(SET_CODE, { code: null })
        this.isPaidSuccess = false
        this.closeAddId()
      } catch (err) {
        this.error = err.message
      }
    },
    onGetNodeID () {
      this.loading = true
      this.nodeIDModel = this.nodeID
      const validator = this.validatorById(this.nodeIDModel)
      if (!validator) {
        this.loading = null
        this.error = 'Something Wrong! Check if your connection endpoint is healthy and synced with the network OR non-existent validator!'
      } else if (validator && this.networkEndpoint.url.startsWith('http://127.0.0.1')) {
        this.loading = null
        this.$store.commit(UPDATE_UI, { addIdentification: { isAuth: true } })
      }
    },
    onReset () {
      this.name = ''
      this.link = ''
      this.bio = ''
      this.error = ''
      this.notify = ''
      this.avatar = ''
      this.nodeIDModel = ''
    },
    onVerify () {
      const validator = this.validatorById(this.nodeIDModel)
      if (!this.nodeIDModel || !validator) {
        this.error = 'Node ID is invalid!'
        return
      }
      this.closeAddId()
      this.$router.push('/verify/' + this.nodeIDModel)
    }
  }
}
</script>
<style scoped>
 #logo-s {
  width: 28vw;
  max-width: 28px;
 }
 #logo {
  width: 200vw;
  max-width: 200px;
  margin-left: 20%;
  margin-right: 20%;
 }
</style>

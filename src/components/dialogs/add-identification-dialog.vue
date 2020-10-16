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
            <q-icon name="perm_identity" size="xl" class="q-pt-xs" color="secondary"/>
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
          class="q-gutter-md q-pt-sm"
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
                  <q-btn
                    round dense
                    @click="onGetNodeID"
                    :loading="loading"
                    flat no-caps
                    color="accent"
                    icon="add"
                  >
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
          <q-btn flat size="sm" color="negative" label="No code?" @click="onVerifyNodeID"/>
          <q-space />
          <q-btn label="Add To Contract" flat type="submit" color="secondary"/>
          <q-btn size="xs" label="Reset" type="reset" color="grey" flat class="q-mr-sm" />
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

import {
  copyToClipboard
} from 'quasar'

import DOMPurify from 'dompurify'

import {
  getDurationByMinutesCount
} from './../../modules/time.js'

import {
  errorNodeID,
  successTxHash
} from './../../utils/constants.js'

import {
  _isValidCode
} from './../../modules/networkCChain.js'

import {
  _verifyReceiveFundsTx
} from './../../modules/transactions.js'

const {
  network
} = require('./../../modules/config.js')
  .default

import {
  GET_NODE_ID
} from './../../store/app/types.js'

import {
  GET_TX_AVM,
  SET_VALIDATOR_INFO
} from './../../store/access/types.js'

import {
  UPDATE_UI,
  OPEN_ADD_IDENTIFICATION,
  CLOSE_ADD_IDENTIFICATION
} from './../../store/ui/types.js'

export default {
  name: 'AddIdentificationDialog',
  data () {
    return {
      name: '',
      link: '',
      bio: '',
      txID: '',
      vCode: '',
      admin: '',
      avatar: '',
      notify: '',
      website: '',
      nodeIDModel: '',
      error: null,
      loading: null,
      dialog: false,
      isValidCode: false,
      isPaidSuccess: false
    }
  },
  created () {
    this.admin = network.admin
  },
  computed: {
    ...mapGetters([
      'ui',
      'code',
      'txAVM',
      'txHash',
      'nodeID',
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
      getTxAVM: GET_TX_AVM,
      getNodeId: GET_NODE_ID,
      openAddId: OPEN_ADD_IDENTIFICATION,
      closeAddId: CLOSE_ADD_IDENTIFICATION,
      setValidatorInfo: SET_VALIDATOR_INFO
    }),
    async check () {
      try {
        await this.getTxAVM({ txID: this.txID })
        const { outputs, timestamp } = this.txAVM
        if (!outputs) {
          this.onFailed('Something Wrong! Try again.')
          return
        }
        const minutes = getDurationByMinutesCount(timestamp)
        if (minutes > 230) {
          this.onFailed('Verification Transaction Failed! Expired Transaction.')
          return
        }
        const isReceiveFunds = _verifyReceiveFundsTx(
          { admin: this.admin, outputs }
        )
        if (isReceiveFunds) {
          this.onSubmit()
          this.dialog = false
          this.isPaidSuccess = true
        } else {
          this.onFailed('Verification Transaction Failed!')
        }
      } catch (err) {
        this.onFailed(`Something Wrong! ${err.message}`)
      }
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
        this.setValidatorInfo({
          link: this.link,
          name: this.name,
          website: this.website,
          bio: this.bio,
          avatar: this.avatar,
          nodeID: this.nodeIDModel
        })

        this.$q.notify({
          timeout: 5000,
          color: 'white',
          position: 'center',
          textColor: 'orange',
          message: successTxHash(this.txHash)
        })

        this.isPaidSuccess = false
        this.closeAddId()
      } catch (err) {
        this.error = err.message
      }
    },
    onFailed (msg) {
      this.$q.notify({
        message: msg,
        color: 'white',
        textColor: 'black',
        position: 'center',
        timeout: 2000
      })
    },
    onClose () {
      this.closeAddId()
      this.onReset()
    },
    onGetNodeID () {
      this.loading = true
      this.nodeIDModel = this.nodeID
      const validator = this.validatorById(this.nodeIDModel)
      if (!validator) {
        this.loading = null
        this.error = errorNodeID
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
    onVerifyNodeID () {
      const validator = this.validatorById(this.nodeIDModel)
      if (!this.nodeIDModel || !validator) {
        this.error = 'Node ID is invalid!'
        return
      }
      this.closeAddId()
      this.$router.push('/verify/' + this.nodeIDModel)
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

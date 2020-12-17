<template>
  <q-dialog
    v-model="ui.addIdentification.isOpen"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-pl-xs q-pt-md q-pb-md iden-card panel">
      <q-card-section class="row">
        <q-item class="col-10">
          <q-item-section avatar>
            <q-icon name="perm_identity" size="xl" class="q-pt-xs" color="panel"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">Add/Update Validator Identification</q-item-label>
            <q-item-label caption class="text-panel">
              Validators identification data is stored on a smart contract.
            </q-item-label>
          </q-item-section>
        </q-item>
        <div class="col-2"><q-btn icon="close" flat round dense  @click="onClose" /></div>
      </q-card-section>
      <div class="text-negative q-pl-md outlined" v-if="error">
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
                :dark="appTheme==='dark'"
                color="accent"
                class="q-mb-md"
                outlined
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
                :dark="appTheme==='dark'"
                color="accent"
                class="q-mb-md"
                outlined
                clearable
                v-model="name"
                label="Validator Name"
                hint="Validator's Name will be show on validator's list instead validator ID."
                :rules="[val => val.length <= 32 || 'Name must be less than or equal to 32 characters']"
                :error="validateData.errors.name"
              />
              <q-input
                :dark="appTheme==='dark'"
                color="accent"
                class="q-mb-xs"
                outlined
                clearable
                v-model="avatar"
                label="Avatar Url"
                hint="For avatar you must use url."
                :rules="[val => !val.startsWith('http:') || 'Content should be loaded over HTTPS!']"
                :error="validateData.errors.avatar"
              />
            </div>
            <div class="col-md-5 col-12 q-pr-xl">
                <q-input
                  :dark="appTheme==='dark'"
                  type="textarea"
                  color="accent"
                  class="q-mb-sm"
                  outlined
                  v-model="bio"
                  label="Bio "
                />
                <q-input
                  :dark="appTheme==='dark'"
                  color="accent"
                  class="q-mb-sm"
                  outlined
                  v-model="website"
                  placeholder="VScout"
                  label="Hypertext (website name)"
                  :rules="[val => val.length <= 32 || 'Website name must be less than or equal to 32 characters']"
                  hint="Name of your website/business link or other."
                />
                <q-input
                  :dark="appTheme==='dark'"
                  color="accent"
                  class="q-mb-xs"
                  outlined
                  clearable
                  v-model="link"
                  placeholder="https://www.vscout.io"
                  label="Hyperlink (link)"
                  hint="Your website/business link or other hyperlink target."
                  :rules="[val => !val.startsWith('http:') || 'Content should be loaded over HTTPS!']"
                  :error="validateData.errors.link"
                />
            </div>
          </div>
        <div class="row q-pr-xl">
          <div class="row">
            <q-input
              :dark="appTheme==='dark'"
              size="xs"
              outlined
              color="accent"
              v-model="vCode"
              clearable
              label="Verification Code"
              hint="Your verifaction code."
            />
          </div>
          <q-btn flat size="sm" color="negative" label="No code?" @click="onVerifyNodeID" style="height: 35px;" class="q-ml-sm"/>
          <q-space />
          <q-btn label="Preview Your Page" no-caps rounded @click="prev" color="secondary" style="height: 35px;margin-top: 23px;margin-right: 5px;"/>
          <q-btn label="Add To Contract" no-caps rounded outline type="submit" color="panel" style="height: 35px;margin-top: 23px;"/>
          <q-btn size="xs" label="Reset" type="reset" flat class="q-mr-sm" />
        </div>
        </q-form>
      </q-card-section>
    </q-card>
    <q-dialog v-model="preview" full-width>
      <q-card class="panel">
        <q-btn flat v-close-popup>
          <q-icon name="close" />
        </q-btn>
        <validator-details
          v-bind:id="nodeIDModel"
          v-bind:name="name"
          v-bind:bio="bio"
          v-bind:avatarUrl="avatar"
          v-bind:link="link"
          v-bind:website="website"
        />
        </q-card>
      </q-dialog>
    <q-dialog v-model="dialog">
      <q-card flat class="q-pb-md panel">
        <q-card-section class="row items-center">
          <q-img
            style="width: 45vw;max-width: 45px;margin: auto;"
            src="https://wallet.avax.network/img/diamond-primary.6818c3c7.svg"
          />
          <q-btn icon="close" class="text-white" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section style="min-height: 125px;">
          <div class="text-subtitle2">
            <p id="label">
              <p><span class="text-panel">Send</span> 0.1 <span class="text-medium text-accent"><small> AVAX</small></span></p>
              <p>
                <span class="text-panel">To:</span>
                <span
                  style="font-size: 15px;cursor: pointer;"
                  @click="copyToClipboard(admin)"
                >
                  {{ admin }}
                </span>
              </p>
              <p class="text-panel">Supplies the fees required to make an ID record in the smart contract!</p>
          </div>
        </q-card-section>

        <q-card-actions class="q-mt-md" v-if="!isPaidSuccess">
          <q-input
            class="col-8"
            size="xs"
            outlined
            v-model="txID"
            clearable
            :dark="appTheme==='dark'"
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
      preview: false,
      isValidCode: false,
      getPreview: false,
      isPaidSuccess: false
    }
  },
  components: {
    ValidatorDetails: () => import('components/search/validator-details.vue')
  },
  created () {
    this.admin = network.admin
  },
  computed: {
    ...mapGetters([
      'ui',
      'code',
      'appTheme',
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
          name: ((DOMPurify.sanitize(this.name) !== this.name) && this.name) || this.name.length > 32,
          website: this.website.length > 32,
          bio: (DOMPurify.sanitize(this.bio) !== this.bio) && this.bio,
          link: DOMPurify.sanitize(inputLink) !== inputLink || this.link.startsWith('http:'),
          avatar: DOMPurify.sanitize(inputAvatar) !== inputAvatar || this.avatar.startsWith('http:')
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
    prev () {
      if (!this.nodeIDModel) {
        this.$q.notify({
          timeout: 5000,
          color: 'white',
          position: 'center',
          textColor: 'orange',
          message: 'The field with Node ID is empty!'
        })
        return
      }
      this.nodeIDModel = this.nodeIDModel.trim()
      this.preview = true
    },
    async check () {
      try {
        await this.getTxAVM({ txID: this.txID.trim() })
        const { outputs, timestamp } = this.txAVM
        if (!outputs) {
          this.onFailed('Something Wrong! Try again.')
          return
        }
        const minutes = getDurationByMinutesCount(timestamp)

        if (minutes > 120) {
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
      if (!this.link && !this.name && !this.avatar && !this.bio && !this.website) {
        this.error = 'Empty fields!'
        return
      }

      if (this.validateData.errors.name ||
          this.validateData.errors.bio ||
          this.validateData.errors.link ||
          this.validateData.errors.website ||
          this.validateData.errors.avatar) {
        return
      }

      this.isValidCode = await _isValidCode(this.vCode, this.nodeIDModel.trim())
      if (!this.vCode || !this.isValidCode) {
        this.error = 'Invalid code!'
        return
      }

      if (!this.code && !this.isPaidSuccess) {
        this.dialog = true
        return
      }

      try {
        await this.setValidatorInfo({
          nodeID: this.nodeIDModel,
          name: this.name,
          website: this.website,
          avatar: this.avatar,
          bio: this.bio,
          link: this.link
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
        this.error = errorNodeID
      } else if (validator && this.networkEndpoint.url.startsWith('http://127.0.0.1')) {
        this.$store.commit(UPDATE_UI, { addIdentification: { isAuth: true } })
      } else if (validator.nodeID === 'NodeID-2KfgS6P7vf9L55fMRTbHPgS4ugVSDW3nj') {
        this.error = errorNodeID
      }

      this.loading = null
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
      const validator = this.validatorById(this.nodeIDModel.trim())
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

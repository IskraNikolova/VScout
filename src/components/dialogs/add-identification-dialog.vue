<template>
  <q-dialog
    v-model="ui.addIdentification.isOpen"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-pl-xl q-pt-md q-pb-md iden-card">
      <q-card-section class="row items-center">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="~assets/id.svg" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">Add/Update Identification For Your Validator</q-item-label>
            <q-item-label caption>
              You can add some bio for your validator (node).
              <br/>Data will be stored in smart contract, for this reason you need <a href="https://metamask.io/">MetaMask</a> and C-Chain address <a href="https://medium.com/avalabs/deploy-a-smart-contract-on-ava-using-remix-and-metamask-98933a93f436">see</a> <br /> with minimum amount of C-AVAX.
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-btn icon="close" flat round dense @click="onClose" />
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
                readonly
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
                class="q-mb-xs"
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
                hint="For avatar you must use url."
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
                  clearable
                  label-color="orange"
                  v-model="link"
                  label="Link"
                  hint="Your business link or other."
                  :error="validateData.errors.link"
                />
            </div>
          </div>
        <div class="row q-pr-xl" v-if="ui.addIdentification.isAuth">
          <q-space />
          <q-btn label="Add To Contract" type="submit" size="10px" color="accent"/>
          <!--<q-btn size="md" label="Reset" type="reset" color="grey" flat class="q-ml-sm" />-->
        </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DOMPurify from 'dompurify'

import { _setValidatorInfo } from './../../modules/networkRpc'

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
      loading: null,
      name: null,
      link: null,
      bio: null,
      error: null,
      avatar: null,
      notify: null,
      nodeIDModel: null
    }
  },
  computed: {
    ...mapGetters([
      'ui',
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
      getNodeId: GET_NODE_ID,
      openAddId: OPEN_ADD_IDENTIFICATION,
      closeAddId: CLOSE_ADD_IDENTIFICATION
    }),
    onClose () {
      this.closeAddId()
      this.onReset()
    },
    async onSubmit () {
      if (!this.link && !this.name && !this.avatar && !this.bio) {
        this.error = 'Empty fields!'
        return
      }
      try {
        const txHash = await _setValidatorInfo({
          link: this.link,
          name: this.name,
          bio: this.bio,
          avatar: this.avatar,
          id: this.nodeIDModel
        })
        this.$q.notify({
          timeout: 3000,
          position: 'center',
          color: 'radial-gradient(circle, #FFFFFF 0%, #000709 70%)',
          message: `Transaction hash is ${txHash}.Your transaction is being broadcasted to the blockchain! Please hold on!`
        })
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
        this.error = 'Something Wrong! Check if your connection endpoint is healthy and synced with the network'
      } else {
        this.loading = null
        this.$store.commit(UPDATE_UI, { addIdentification: { isAuth: true } })
      }
    },
    onReset () {
      this.name = null
      this.link = null
      this.bio = null
      this.error = null
      this.notify = null
      this.avatar = null
      this.nodeIDModel = null
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

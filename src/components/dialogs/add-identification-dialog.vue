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
              You must provide your username and password to authenticate it.
             <br/>Data will be store to contract, for this reason, to make this recording you must have a <a href="https://metamask.io/">MetaMask</a> installed
              and a C-Chain address <a href="https://medium.com/avalabs/deploy-a-smart-contract-on-ava-using-remix-and-metamask-98933a93f436">see</a> <br />with a minimum amount of C-AVA for contract write.
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
          class="q-gutter-md"
        >
          <div class="row">
            <div class="col-md-5 col-12 q-mr-xl q-pt-md q-pb-md">
            <q-input
              class="q-mb-md"
              color="accent"
              outlined
              clearable
              label-color="orange"
              v-model="nodeIDModel"
              label="Your node ID *"
              hint="Enter validator ID or load it from '+' button if you use it for network connection."
              lazy-rules
              :rules="[
                val => val && val.length > 0 ||
                'Please type your node ID!'
              ]"
            >
              <template v-slot:append>
                <q-btn round dense @click="onGetNodeID" flat no-caps color="accent" icon="add"/>
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
          <q-separator vertical class="q-mr-xl" />
          <div class="col-md-5 col-12 q-pr-xl">
            <q-card-section class="row">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-h6">Proof Of Authentication</q-item-label>
                  <q-item-label v-if="!ui.addIdentification.isAuth" caption>
                    First add your node ID. Also need to connect to your local node!
                  </q-item-label>
                  <q-item-label v-else caption class="text-positive">
                    Success!
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
            <div v-if="!ui.addIdentification.isAuth">
              <q-input
                readonly
                color="accent"
                class="q-mb-xs"
                outlined
                label-color="orange"
                v-model="address"
                label="P-Chain address "
                hint="The account providing the staked AVA. Are You?"
              />
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
                :rules="[
                  val => val && val.length > 0 ||
                  'Please type your username!'
                ]"
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
                :rules="[
                  val => val && val.length > 0 ||
                  'Please type your password!'
                ]"
              />
              <div class="row q-pr-xl">
                <q-space />
                <q-btn label="Authorization"  @click="onAuth()" size="10px" color="accent"/>
                <q-btn label="Cancel" flat @click="onClose()" size="10px" color="accent"/>
              </div>
            </div>
            <div v-else>
              <q-img basic src="~assets/success.png" id="logo"/>
            </div>
          </div>
        </div>
        <div class="row q-pr-xl" v-if="ui.addIdentification.isAuth">
          <q-space />
          <q-btn label="Add To Contract" type="submit" size="10px" color="accent"/>
          <q-btn size="md" label="Reset" type="reset" color="grey" flat class="q-ml-sm" />
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
  GET_NODE_ID,
  LIST_ACCOUNTS
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
      username: null,
      password: null,
      name: null,
      avatar: null,
      link: null,
      nodeIDModel: null,
      error: null,
      notify: null
    }
  },
  computed: {
    ...mapGetters([
      'ui',
      'nodeID',
      'networkEndpoint',
      'validatorById'
    ]),
    address: function () {
      const validator = this.validatorById(this.nodeIDModel)
      if (!validator) return
      return validator.address
    },
    validateData () {
      const inputAvatar = `<img src="${this.avatar}">`
      const inputLink = `<a href="${this.link}">`
      return {
        errors: {
          name: DOMPurify.sanitize(this.name) !== this.name,
          avatar: DOMPurify.sanitize(inputAvatar) !== inputAvatar,
          link: DOMPurify.sanitize(inputLink) !== inputLink
        }
      }
    }
  },
  methods: {
    ...mapActions({
      openAddId: OPEN_ADD_IDENTIFICATION,
      closeAddId: CLOSE_ADD_IDENTIFICATION,
      listAccounts: LIST_ACCOUNTS,
      getNodeId: GET_NODE_ID
    }),
    onClose () {
      this.closeAddId()
    },
    async onAuth () {
      try {
        const res = await this.listAccounts({
          username: this.username,
          password: this.password
        })
        if (!res) return

        const accounts = res.accounts
        const isAuth = accounts.find(a => a.address === this.address)
        this.$store.commit(UPDATE_UI, { addIdentification: { isAuth } })

        if (!isAuth) {
          this.error = 'Authorization Failed!'
        }
      } catch (err) {
        this.error = err.message
      }
    },
    async onSubmit () {
      try {
        const txHash = await _setValidatorInfo({
          id: this.nodeIDModel,
          name: this.name,
          avatar: this.avatar,
          link: this.link
        })
        this.$q.notify({
          message: `Transaction hash is ${txHash}.Your transaction is being broadcasted to the blockchain! Please hold on!`,
          color: 'radial-gradient(circle, #FFFFFF 0%, #000709 70%)',
          position: 'center',
          timeout: 3000
        })
        this.closeAddId()
      } catch (err) {
        this.error = err.message
      }
    },
    onGetNodeID () {
      this.nodeIDModel = this.nodeID
      this.error = null
    },
    onReset () {
      this.name = null
      this.link = null
      this.avatar = null
      this.error = null
      this.notify = null
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

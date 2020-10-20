<template>
  <q-page>
    <div style="padding: 1% 3% 0% 3%">
      <q-card
        id="custom-card"
      >
        <q-btn
          class="lt-sm"
          @click="$router.go(-1)"
          icon="arrow_back"
          no-caps
          color="accent"
          flat
        />
        <div style="text-align: center;padding-top: 60px;">
          <p class="text-h6">Verify</p>
          <div class="text-subtitle q-pl-md">Validator <span class="text-medium text-orange">
            {{ $route.params.nodeID }}
          </span></div>
          <div class="text-subtitle q-pl-md">Owner  <span class="text-medium text-orange text-h6">{{ rewardOwner }}</span></div>
        </div>
        <div class="row q-mt-xl q-pb-xl">
          <div class="col-2"></div>
          <q-card id="verify-card" class="col-4 q-mr-md" style="min-height: 370px;" @click="dialog1=true">
            <q-card-section>
              <q-img style="width: 100vw;max-width: 100px;margin: auto;" src="~assets/node1.svg" />
              <div class="q-mt-md" style="cursor: pointer;">
                Connect to a Local Node
              </div>
            </q-card-section>
            <q-card-section style="min-height: 125px;">
              <div class="text-subtitle2 q-pb-md">
                <small id="label"> Switch to Localhost endpoint from the top right menu & claim your verification code by clicking the "Verify" button!
                Note: For this option you need to have a node running on localhost.</small>
              </div>
              <div class="text-subtitle2">
                <small id="label"> Send 0.1 AVAX to <span style="cursor: pointer;font-size: 13px;" class="text-secondary text-bold" @click="copyToClipboard(admin)">{{ admin }}</span> for smart contract writing fees!</small>
              </div>
            </q-card-section>
          </q-card>
          <q-card id="verify-card2" class="col-4" style="min-height: 370px;" @click="dialog2=true">
            <q-card-section>
              <q-img
                style="width: 100vw;max-width: 100px;margin: auto;"
                src="https://wallet.avax.network/img/diamond-primary.6818c3c7.svg"
              />
              <div class="q-mt-md">
                <a href="https://wallet.avax.network/">Avalanche Wallet</a>
              </div>
            </q-card-section>
            <q-card-section style="min-height: 125px;">
              <div class="text-subtitle2">
                <small>Send 0.1 AVAX to <span style="font-size: 13px;cursor: pointer;" @click="copyToClipboard(admin)" class="text-secondary text-bold">{{ admin }}</span> <br />for owner address verification & smart contract writing fees!</small>
              </div>
            </q-card-section>
          </q-card>
          <div class="col-2"></div>
        </div>
      </q-card>
      <q-dialog v-model="dialog1">
        <q-card flat class="q-pb-md">
          <q-card-section class="row items-center bg-secondary">
            <q-img style="width: 30vw;max-width: 30px;margin: auto;" src="~assets/node-white.svg" />
            <div class="text-h6 text-white q-pl-xs">Local Node Verification</div>
            <q-space />
            <q-btn icon="close" class="text-white" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section v-if="!isSuccessSend">
            <div class="text-subtitle2 q-pb-md q-mt-md" v-if="!isSuccessConnect">
              <div id="label">
               Switch to Localhost endpoint from the top right menu & claim your verification code by clicking the "Verify" button!
              </div>
              <q-img style="width: 350vw;max-width: 350px;margin-left: 10%;margin-top: 10%;" src="~assets/instruction1.png" />
            </div>
            <div class="text-subtitle2" v-else>
              <p id="label">
                Send 0.1 AVAX  <br />to <span style="cursor: pointer;font-size: 15px;" class="text-secondary text-bold" @click="copyToClipboard(admin)">{{ admin }}</span> for smart contract writing fees!
              </p>
              <p>
                Grab your TXID, paste it in the field below and click "Send" to obtain your verification code!
                <br /><q-icon name="info" color="secondary" />Backup your verification code, you will need it to Add and Update your node's identification info!
              </p>
            </div>
          </q-card-section>
          <q-card-section v-if="isSuccessSend && isSuccessConnect">
            <div class="q-mb-xl text-h6">Sending Succesfully!</div>
            <div @click="copyToClipboard(code)">
              <p>Your ID Verification Code: <span class="text-secondary text-medium" style="cursor: pointer;">{{ code }}</span></p>
              <q-icon name="info" color="secondary" /> Backup your verification code, you will need it to Add and Update your node's identification info!
            </div>
          </q-card-section>
          <q-card-actions class="q-mt-md" align="right" v-else-if="!isSuccessConnect">
            <q-btn outline no-caps label="Verify" color="secondary" style="margin-top: 9px;" @click="checkEndpoint"/>
          </q-card-actions>
          <q-card-actions class="q-mt-md" v-else>
            <q-input
              class="col-8"
              size="xs"
              outlined
              color="grey"
              v-model="txID2"
              clearable
              label="Tx ID..."
            />
            <q-card-actions  align="right" class="col-4">
              <q-btn no-caps color="secondary" label="Send" @click="sendTx(txID2)"/>
            </q-card-actions>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="dialog2">
        <q-card flat class="q-pb-md">
          <q-card-section class="row items-center bg-secondary">
            <q-img
              style="width: 30vw;max-width: 30px;margin: auto;"
              src="https://wallet.avax.network/img/diamond-primary.6818c3c7.svg"
            />
            <div class="text-h6 text-white q-pl-xs">Wallet Verification</div>
            <q-space />
            <q-btn icon="close" class="text-white" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section style="min-height: 125px;" v-if="!isSearchSuccess">
            <div class="text-subtitle2">
              <p id="label">
                <p>Send 0.1 <span class="text-medium text-accent"><small> AVAX</small></span></p>
                <p>
                  From:
                  <span
                    style="font-size: 15px;cursor: pointer;"
                    @click="copyToClipboard(admin)"
                    class="text-secondary text-medium"
                  >
                  {{ getXAddress(rewardOwner) }}
                  </span>
                </p>
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
                <p>
                  Memo:
                  <span
                    class="text-secondary text-medium"
                  >
                    {{ validator.nodeID }}
                  </span>
                </p>
                <p>The transaction authorizes your ownership and supplies the fees required to make an ID record in the smart contract!</p>
            </div>
            <div class="text-subtitle2">
              <p><q-icon name="info" color="secondary" /> Please make sure you are sending the transaction from the Validator Node owner wallet!</p>
            </div>
          </q-card-section>
          <q-card-section v-else>
            <div class="q-mb-xl text-h6">Successful Verification!</div>
            <p>Your ID Verification Code: <span @click="copyToClipboard(code)" class="text-secondary text-medium" style="cursor: pointer;">{{ code }}</span>
            <p><q-icon name="info" color="secondary" /> Backup your verification code, you will need it to Add and Update your node's identification info!</p>
          </q-card-section>

          <q-card-actions class="q-mt-md" v-if="!isSearchSuccess">
            <q-input
              class="col-8"
              size="xs"
              outlined
              color="grey"
              v-model="txID1"
              clearable
              label="Tx ID..."
            />
            <q-card-actions align="right" class="col-4">
              <q-btn flat no-caps label="Verify" @click="firstSearch(txID1)"/>
            </q-card-actions>
          </q-card-actions>
          <q-inner-loading :showing="visible">
            <q-spinner-ball size="50px" color="orange" />
          </q-inner-loading>
        </q-card>
      </q-dialog>
      <div class="flex flex-center q-pt-xl">
        <img src="~assets/vscoutlogo5.svg" id="logo">
      </div>
      <div class="flex flex-center q-mt-xl text-white q-pb-xl">
        Made with ❤️ for builders everywhere.
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
const crypto = require('crypto')

import {
  _outputSearch,
  _verifyReceiveFundsTx
} from './../modules/transactions.js'

import {
  GET_TX_AVM,
  VERIFY_OWNER,
  SET_VERIFY_CODE
} from './../store/access/types.js'

const {
  network
} = require('./../modules/config.js')
  .default

import {
  copyToClipboard
} from 'quasar'

import { getDurationByMinutesCount } from './../modules/time.js'

export default {
  name: 'PageVerifyValidator',
  data () {
    return {
      admin: '',
      txID1: '',
      txID2: '',
      code: '',
      txStatus: '',
      readMore: false,
      dialog1: false,
      dialog2: false,
      visible: false,
      isSearchSuccess: false,
      isFailed: false,
      isSuccessSend: false,
      isSuccessConnect: false
    }
  },
  created () {
    this.admin = network.admin
  },
  computed: {
    ...mapGetters([
      'txAVM',
      'validatorById',
      'networkEndpoint',
      'nodeID'
    ]),
    validator: function () {
      const validator = this.validatorById(this.$route.params.nodeID)
      if (!validator) return {}
      return validator
    },
    rewardOwner: function () {
      if (!this.validator || !this.validator.rewardOwner) return
      return this.validator.rewardOwner.addresses[0]
    }
  },
  methods: {
    ...mapActions({
      getTxAVM: GET_TX_AVM,
      verifyOwner: VERIFY_OWNER,
      setVerifyCode: SET_VERIFY_CODE
    }),
    // async test () {
    //   this.code = this.getRandom()
    //   console.log(this.code)
    //   await this.setVerifyCode({
    //     code: this.code,
    //     nodeID: this.validator.nodeID
    //   })
    //   this.isSuccessSend = true
    // },
    async sendTx (txID) {
      try {
        const isSuccess = await this.check(txID)
        if (isSuccess) {
          this.code = this.getRandom()
          await this.setVerifyCode({
            code: this.code,
            nodeID: this.validator.nodeID
          })

          this.isSuccessSend = true
        }
      } catch (err) {
        this.onFailed('Verification Failed!' + err.message)
      }
    },
    async check (txID) {
      await this.getTxAVM({ txID })
      const { outputs, timestamp } = this.txAVM
      if (!outputs) return
      const minutes = getDurationByMinutesCount(timestamp)
      if (minutes > 120) {
        this.onFailed('Verification Failed! Expired Transaction.')
        return
      }
      return _verifyReceiveFundsTx({
        outputs,
        admin: this.admin
      })
    },
    async firstSearch (txID) {
      this.visible = true
      try {
        await this.getTxAVM({ txID })
        const { outputs, timestamp } = this.txAVM
        const minutes = getDurationByMinutesCount(timestamp)
        if (minutes > 120) {
          this.onFailed('Verification Failed! Expired Transaction.')
          return
        }
        const isSuccess = _verifyReceiveFundsTx({
          outputs,
          admin: this.admin
        })
        if (!isSuccess) {
          this.visible = false
          this.onFailed('Verification Failed!')
          return
        }
        await this.searchAddress(txID, 1)
      } catch (err) {
        this.onFailed('Verification Failed! ' + err.message)
      }
    },
    async searchAddress (txID, index) {
      if (this.isFailed) return
      if (index > 100) {
        this.onFailed('Verification Failed!')
        return
      }
      try {
        await this.getTxAVM({ txID })
        const inputs = this.txAVM.inputs
        if (!inputs) {
          if (this.isSearchSuccess) return
          const searchResult = _outputSearch(
            this.txAVM,
            this.rewardOwner
          )
          if (searchResult) {
            await this.onSuccess()
          } else {
            const outputs = this.txAVM.outputs
            if (!outputs) return
            for (let i = 0; i < outputs.length; i++) {
              const addresses = outputs[i].addresses
              if (addresses) {
                for (let j = 0; j < addresses.length; j++) {
                  if (addresses[j] === this.rewardOwner.substr(2)) {
                    await this.onSuccess()
                    return
                  }
                }
              }
              await this.searchAddress(outputs[i].redeemingTransactionID, index++)
            }
          }
        } else {
          if (this.isSearchSuccess) return
          for (let i = 0; i < inputs.length; i++) {
            const output = inputs[i].output
            const addresses = output.addresses
            for (let i = 0; i < addresses.length; i++) {
              const address = addresses[i]
              if (address === this.rewardOwner.substr(2)) {
                await this.onSuccess()
                return
              }
            }

            await this.searchAddress(output.transactionID, index++)
          }
        }
      } catch (err) {
        console.log(err)
        // todo check for status 400 uknown transaction message
        this.onFailed('Verification Failed!' + err.message)
      }
    },
    async onSuccess () {
      this.visible = false
      this.isSearchSuccess = true
      this.code = this.getRandom()
      try {
        await this.setVerifyCode({
          code: this.code,
          nodeID: this.validator.nodeID
        })
      } catch (err) {
        console.log(err)
        this.$q.notify({
          message: 'Something Wrong! Try again!',
          color: 'white',
          textColor: 'black',
          position: 'center',
          timeout: 1000
        })
      }
    },
    onFailed (message) {
      this.visible = false
      this.isFailed = true
      this.$q.notify({
        message,
        color: 'white',
        textColor: 'black',
        position: 'center',
        timeout: 20000
      })
    },
    getRandom () {
      const id = crypto
        .randomBytes(5)
        .toString('hex')
      return id
    },
    getXAddress (val) {
      if (!val) return
      return `X-${val.substr(2)}`
    },
    checkEndpoint () {
      if (!this.validator) return
      const isLocal = this.networkEndpoint
        .url
        .startsWith('http://127.0.0.1')
      const isNode = this.nodeID === this.validator.nodeID
      this.isSuccessConnect = isLocal && isNode
      if (this.isSuccessConnect) {
        this.$q.notify({
          message: 'Successful Verification!',
          color: 'white',
          textColor: 'black',
          position: 'center',
          timeout: 1000
        })
      } else {
        this.$q.notify({
          message: 'Verification Failed!',
          color: 'white',
          textColor: 'black',
          position: 'center',
          timeout: 1000
        })
      }
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
  },
  beforeDestroy () {
    this.txID1 = ''
    this.txID2 = ''
    this.code = ''
    this.txStatus = ''
    this.visible = false
    this.isSearchSuccess = false
    this.isSuccessSend = false
    this.isSuccessConnect = false
  }
}
</script>
<style scoped>
 #logo {
  width: 190vw;
  max-width: 190px;
 }
 #verify-card:hover {
   background: #aa7dc9;
   color: white;
 }
  #verify-card2:hover {
   background:#aa7dc9;
   color: white!important;
 }
</style>

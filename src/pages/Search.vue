<template>
  <q-page class="q-pr-xl q-pl-xl">
    <q-card
      class="q-mt-md q-pt-md q-pl-xl q-pb-md"
      id="custom-card"
      style="padding-top: 3%;min-height: 400px;"
    >
    <q-btn
      @click="back"
      icon="arrow_back"
      label="Back"
      no-caps
      color="accent"
      flat
    />
    <div v-if="validator()">
      <div class="q-pr-md">
        <div class="text-bold q-pa-md">VALIDATOR</div>
          <q-card flat>
            <q-item>
              <q-item-section avatar @click="onClick(validator().link)">
                <q-avatar>
                  <q-img :src="validator().avatar">
                    <template v-slot:error>
                      <div>
                        ?
                      </div>
                    </template>
                  </q-img>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label >
                  <small>Rank </small>
                  <span class="text-accent">
                    {{ validator().rank }}
                  </span>
                </q-item-label>
                <q-item-label @click="onClick(validator().link)">
                  {{ validator().name }} <small v-if="validator().name !== validator().validator" class="text-grey">({{ validator().validator }})</small>
                  <small>
                    <q-icon
                      @click="copyToClipboard(validator().validator)"
                      color="grey"
                      name="file_copy"
                    />
                  </small>
                </q-item-label>
                <q-item-label v-if="validator().address">
                  <small class="text-grey">
                    Owner ({{ validator().address.substr(0, 12)}} ... {{ validator().address.substr(22) }})
                    <q-icon
                      @click="copyToClipboard(validator().address)"
                      color="grey"
                      name="file_copy"
                    />
                  </small>
                </q-item-label>
                <q-item-label v-else>
                  <small class="text-grey">
                    Weight: <span class="text-accent">{{ validator().weight }}</span>
                  </small>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section horizontal>
              <q-card-section class="col-7 q-mb-xl">
                <div class="q-mb-md">Stake (AVAX)</div>
                {{ validator().stake > 1 ? getLocalString(validator().stake) : validator().stake }}
                <small class="text-accent">$AVAX</small>
                <br />
                <small style="color: grey;">
                  ({{ getLocalString(validator().stakenAva) }} nAvax)
                </small>
                <div>
                <small class="text-orange" v-if="validator().percent !== 'NaN'">
                  {{validator().percent }} %
                </small>
              </div>
              <div>
                <small class="text-grey">Delegated</small>
                {{ validator().delegateStake }}
                <small class="text-accent">$AVAX</small>
              </div>
              <div>
                <small class="text-grey">Total</small>
                {{ validator().total > 1 ? validator().total.toLocaleString() : validator().total }}
                <small class="text-accent">$AVAX</small>
              </div>
              <q-separator class="q-mb-md"/>
              <div class="q-pl-xs">
                <div>Staked by</div>
                <div class="text-accent">
                  <small>{{ validator().fromNowST }}</small>
                </div>
              </div>
              <div class="text-grey q-pt-xl">Progress (%)</div>
              <progress-bar-validate-session
                v-bind:startTime="validator().startTime"
                v-bind:endTime="validator().endTime"
              />
              </q-card-section>
              <q-separator vertical />
              <q-card-section class="col-5">
                <cumulative-stake-chart
                  v-if="validator().cumulativeStake"
                  v-bind:name="validator().validator"
                  v-bind:percent="validator().percent"
                  v-bind:percentAll="validator().cumulativeStake ? validator().cumulativeStake : NaN"
                /><div v-else> - </div>
              </q-card-section>
            </q-card-section>
            <q-separator />

            <q-card-section horizontal>
              <q-card-section class="col-6">
                <small class="text-grey">Start Time</small>
                <br />
                <small>{{ formatDate(validator().startTime) }}</small>
              </q-card-section>
              <q-separator vertical/>
              <q-card-section class="col-6">
                <small class="text-grey">End Time</small>
                <br />
                <small>{{ formatDate(validator().endTime) }}</small>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
    </div>
    <div v-else-if="blockchain()">
      <div class="q-pa-md">
        <div class="text-bold">BLOCKCHAIN ID</div>
        <div class="text-regular text-orange q-pl-xs q-pt-md">{{ blockchain().id }}</div>
        <div class="row q-pt-xl">
          <div class="col-6">
            <span class="text-light text-h7">NAME:</span> <div class="text-medium">{{ blockchain().name }}</div>
            <br />
            <span class="text-light text-h7">VM (Virtual Machine):</span>
            <div class="q-pl-xs"><small class="text-grey">ID: </small> <span class="text-medium">{{ blockchain().vmID }}</span></div>
            <div class="q-pl-xs"><small class="text-grey">NAME: </small> <span class="text-medium">{{ blockchain().vmName }}</span></div>
          </div>
          <div class="col-6">
            <span class="text-light text-h7">SUBNET ID:</span> <div class="text-medium">{{ blockchain().subnetID }}</div>
            <br />
            <span class="text-light text-h7">STATUS:</span> <div class="text-medium">CREATED</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="subnet()">
      <div class="text-bold q-pa-md">SUBNET ID</div>
      <div class="text-regular text-orange q-pl-xs q-pt-md">{{ subnet().id }}</div>
      <div class="row q-pt-xl">
        <div class="col-6">
          <span class="text-light text-h7">BLOCKCHAINS:</span>
          <div class="text-medium q-pl-xs" v-for="id in subnet().blockchainsId" v-bind:key="id">
            <br />
            <small class="text-grey">NAME: </small>{{ blockchainByID(id).name }}
            <br />
            <small class="text-grey">ID: </small><span class="text-light">{{ blockchainByID(id).id }}</span>
            <br />
            <small class="text-grey">VM ID: </small><span class="text-light">{{ blockchainByID(id).vmID }}</span>
            <q-separator />
            <br />
          </div>
        </div>
        <div class="col-6">
          <span class="text-light text-h7">THRESHOLD:</span> <div class="text-medium q-pl-xs">{{ subnet().threshold }}</div>
          <br />
          <span class="text-light text-h7">CONTROL KEYS:</span> <div class="text-medium q-pl-xs" v-for="key in subnet().controlKeys" v-bind:key="key">{{ key }}</div>
          <br />
        </div>
      </div>
    </div>
    <div v-else class="fixed-center">
      <p>
        <!--<img
          src="~assets/notfound.svg"
          style="width:30vw;max-width:150px;"
        >-->
      </p>
      <p class="text-bold text-h6">
        Looks like we don't have any matches for "{{ this.$route.params.id }}"
      </p>
      <p class="text-faded">
        - Check for typos
      </p>
      <p class="text-faded">
        - Check if your connection endpoint is healthy and synced with the network
      </p>
      <p class="text-faded">
        - Everything is correct, but you are not getting the expected result? <a href="https://chat.avax.network/">Tag us in Avalanche discord!</a>
      </p>
    </div>
    </q-card>
  </q-page>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

import {
  copyToClipboard,
  openURL
} from 'quasar'

import { date } from './../modules/time'

import CumulativeStakeChart from './../components/cumulative-stake-chart'
import ProgressBarValidateSession from './../components/progress-bar-validatе-session'

import {
  GET_VALIDATORS,
  SET_CURRENT_SUBNET,
  GET_PENDING_VALIDATORS,
  SET_CURRENT_BLOCKCHAIN,
  GET_ASSETS_BY_BLOCKCHAINS
} from './../store/app/types'

export default {
  name: 'PageSearch',
  components: {
    CumulativeStakeChart,
    ProgressBarValidateSession
  },
  computed: {
    ...mapGetters([
      'validatorById',
      'blockchainByID',
      'blockchainByName',
      'networkEndpoint',
      'subnetByID'
    ])
  },
  methods: {
    ...mapActions({
      getValidators: GET_VALIDATORS,
      getAssets: GET_ASSETS_BY_BLOCKCHAINS,
      getPendingValidators: GET_PENDING_VALIDATORS
    }),
    validator () {
      const validator = this.validatorById(this.$route.params.id)
      if (!validator) return

      return validator
    },
    blockchain () {
      let blockchain = this.blockchainByID(this.$route.params.id)
      if (!blockchain) {
        blockchain = this.blockchainByName(this.$route.params.id)
      }

      if (!blockchain) return

      return blockchain
    },
    back () {
      if (this.blockchain()) this.onSelectBlockchain(this.blockchain())
      else if (this.subnet()) this.onSelectSubnet(this.subnet())
      this.$router.push('/')
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
    subnet () {
      const subnet = this.subnetByID(this.$route.params.id)
      if (!subnet) return

      return subnet
    },
    getLocalString (val) {
      if (!val) return val
      return val.toLocaleString()
    },
    formatDate (time) {
      if (!time) return
      return date(time)
    },
    onClick (link) {
      if (!link) return
      try {
        openURL(link)
      } catch (err) {
      }
    },
    async onSelectBlockchain (blockchain) {
      this.$store.commit(SET_CURRENT_BLOCKCHAIN, { blockchain })
      await Promise.all([
        this.getAssets(),
        this.setData(blockchain.subnetID)
      ])
    },
    async onSelectSubnet (subnet) {
      this.$store.commit(SET_CURRENT_SUBNET, { subnet })
      await this.setData(subnet.id)
    },
    async setData (id) {
      await this.getValidators({
        subnetID: id,
        endpoint: this.networkEndpoint
      })
      this.getPendingValidators({
        subnetID: id
      })
    }
  }
}
</script>

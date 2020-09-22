<template>
  <q-page class="q-pr-md q-pl-md">
    <q-card
      class="q-mt-md q-pt-md q-pb-md"
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
    <div v-if="getSubnet($route.params.id)">
      <div class="q-pa-md gt-xs">
        <div class="q-pl-md text-bold">SUBNET ID</div>
        <div class="text-regular text-orange q-pl-md q-pb-md">{{ subnet.id }}</div>
        <span class="q-pl-md text-light text-h7">BLOCKCHAINS:</span>
        <div class="row q-pl-md">
          <div class="col text-medium" v-for="id in subnet.blockchainsId" v-bind:key="id">
            <br />
            <small class="text-grey">NAME: </small>{{ blockchainByID(id).name }}
            <br />
            <small class="text-grey">ID: </small><span class="text-light">{{ blockchainByID(id).id }}</span>
            <br />
            <small class="text-grey">VM ID: </small><span class="text-light">{{ blockchainByID(id).vmID }}</span>
          </div>
        </div>
        <q-separator class="q-mt-md q-mb-md"/>
        <div class="q-pl-md">
          <span class="text-light text-h7">THRESHOLD:</span> <span class="text-medium q-pl-xs">{{ subnet.threshold }}</span>
          <br />
          <span class="text-light text-h7">CONTROL KEYS:</span> <div class="text-medium q-pl-xs" v-for="key in subnet.controlKeys" v-bind:key="key">{{ key }}</div>
          <br />
        </div>
      </div>
      <div class="q-pa-md lt-sm">
        <div class="text-bold">SUBNET ID</div>
        <div class="text-regular text-orange q-pb-md">{{ subnet.id }}</div>
        <span class="text-light text-h7">BLOCKCHAINS:</span>
        <div class="text-medium" v-for="id in subnet.blockchainsId" v-bind:key="id">
          <br />
          <small class="text-grey">NAME: </small>{{ blockchainByID(id).name }}
          <br />
          <small class="text-grey">ID: </small><span class="text-light">{{ blockchainByID(id).id }}</span>
          <br />
          <small class="text-grey">VM ID: </small><span class="text-light">{{ blockchainByID(id).vmID }}</span>
          <q-separator class="q-mt-md q-mb-md"/>
        </div>
        <div>
          <span class="text-light text-h7">THRESHOLD:</span> <span class="text-medium q-pl-xs">{{ subnet.threshold }}</span>
          <br />
          <span class="text-light text-h7">CONTROL KEYS:</span> <div class="text-medium q-pl-xs" v-for="key in subnet.controlKeys" v-bind:key="key">{{ key }}</div>
          <br />
        </div>
      </div>
    </div>
    <div v-else-if="getValidator($route.params.id)">
      <div class="text-bold q-pl-xl">VALIDATOR</div>
      <q-card flat class="gt-xs q-pa-xl">
        <q-item>
          <q-item-section avatar style="cursor:pointer;" @click="onClick(validator.link)">
            <div :style="'border: solid 1px ' + border(validator.connected) + ';border-radius: 50px;width: 100%;'">
              <q-avatar>
                <q-img :src="validator.avatar">
                  <template v-slot:error>
                    <div>
                      ?
                    </div>
                  </template>
                </q-img>
              </q-avatar>
            </div>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <small class="text-medium">Rank </small>
              <span class="text-accent">
                {{ validator.rank }}
              </span>
            </q-item-label>
            <q-item-label>
              <span  style="cursor:pointer;" @click="onClick(validator.link)">{{ validator.name }} </span> <small v-if="validator.name !== validator.nodeID" class="text-grey">({{ validator.nodeID }})</small>
              <small>
                <q-icon
                  @click="copyToClipboard(validator.nodeID)"
                  color="grey"
                  name="file_copy"
                />
              </small>
            </q-item-label>
            <q-item-label v-if="rewardOwner">
              <small class="text-grey">
                <span class="text-medium">Owner</span> ({{ getFormatOwner(rewardOwner)}})
                <q-icon
                  @click="copyToClipboard(rewardOwner)"
                  color="grey"
                  name="file_copy"
                />
              </small>
            </q-item-label>
            <q-item-label v-if="validator.weight">
              <small class="text-grey">
                Weight: <span class="text-accent">{{ validator.weight }}</span>
              </small>
            </q-item-label>
          </q-item-section>
          <q-item-section avatar right>
            <span>
              <span class="q-mr-xs q-mt-xl">Up Time</span>
              <q-badge :color="getColorUptime(validator.uptime)">
                {{ getUpTime(validator.uptime) }} %
              </q-badge>
            </span>
          </q-item-section>
        </q-item>

        <q-separator class="q-mb-xl"/>

        <q-card-section horizontal>
          <q-card-section class="col-7 q-mb-xl">
            <div class="q-mb-md text-medium">Stake (AVAX)</div>
            <small class="text-grey">Own</small>
            {{ getLocalString(validator.stake) }}
            <small class="text-accent">AVAX</small>
            <small style="color: grey;">
              ({{ getLocalString(validator.stakenAva) }} nAvax)
            </small>
            <div>
            </div>
            <div>
              <small class="text-grey">Delegated</small>
              {{ validator.delegateStake }}
              <small class="text-accent">AVAX</small>
            </div>
            <div>
              <small class="text-grey">Total</small>
              {{ getLocalString(validator.total) }}
              <small class="text-accent">AVAX</small>
            </div>
            <q-separator class="q-pa-xs q-mb-md q-mt-md"/>
            <div class="text-medium q-mt-md">Network Share (%) </div>
            <span class="text-orange q-pl-xs" v-if="validator.percent !== 'NaN'">
              {{validator.percent }} %
            </span>
            <q-separator class="q-pa-xs q-mb-md q-mt-md" />
            <div class="text-medium q-mt-md">Potential Reward</div>
            <span>
              {{ getFormatAva(validator.potentialReward) }} <span class="text-accent">AVAX</span>
            </span>
            <q-separator class="q-pa-xs q-mb-md q-mt-md" />
            <div class="q-pl-xs q-mt-md">
              <div class="text-medium">
                Delegations: <span class="text-accent">{{ validator.delegatorsCount}}</span>
              </div>
              <div class="text-medium">
                Delegation Fee: <span class="text-accent">{{ validator.delegationFee }} %</span>
              </div>
            </div>
            <q-separator class="q-pa-xs q-mb-md q-mt-md" />
            <div class="q-pl-xs q-mt-md">
              <div class="text-medium">Staked By</div>
              <div class="text-accent">
                <small>{{ validator.fromNowST }}</small>
              </div>
            </div>
            <q-card-section>
              <div class="text-grey q-pt-xl">Progress (%)</div>
              <progress-bar-validate-session
                v-bind:startTime="validator.startTime"
                v-bind:endTime="validator.endTime"
              />
            </q-card-section>
          </q-card-section>
          <q-separator vertical />
          <q-card-section class="col-5">
            <cumulative-stake-chart
              v-if="validator.cumulativeStake"
              v-bind:name="validator.nodeID"
              v-bind:percent="validator.percent"
              v-bind:percentAll="validator.cumulativeStake ? validator.cumulativeStake : NaN"
            /><div v-else> - </div>
          </q-card-section>
        </q-card-section>
        <q-separator />

        <q-card-section horizontal>
          <q-card-section class="col-6">
            <small class="text-grey text-bold">Start Time</small>
            <br />
            <small>{{ formatDate(validator.startTime) }}</small>
          </q-card-section>
          <q-separator vertical/>
          <q-card-section class="col-6">
            <small class="text-grey text-bold">End Time</small>
            <br />
            <small>{{ formatDate(validator.endTime) }}</small>
          </q-card-section>
        </q-card-section>
      </q-card>
      <q-card flat class="lt-sm">
        <q-item>
          <q-item-section avatar style="cursor:pointer;" @click="onClick(validator.link)">
            <q-avatar>
              <q-img :src="validator.avatar">
                <template v-slot:error>
                  <div>
                    ?
                  </div>
                </template>
              </q-img>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <small class="text-medium">Rank </small>
              <span class="text-accent">
                {{ validator.rank }}
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>
              <span  style="cursor:pointer;" @click="onClick(validator.link)">{{ validator.name }} </span>
              <small v-if="validator.name !== validator.nodeID" class="text-grey">({{ validator.nodeID }})</small>
              <small>
                <q-icon
                  @click="copyToClipboard(validator.nodeID)"
                  color="grey"
                  name="file_copy"
                />
              </small>
            </q-item-label>
            <q-item-label v-if="rewardOwner">
              <small class="text-grey">
                <span class="text-medium">Owner</span> ({{ getFormatOwner(rewardOwner)}})
                <q-icon
                  @click="copyToClipboard(rewardOwner)"
                  color="grey"
                  name="file_copy"
                />
              </small>
            </q-item-label>
            <q-item-label v-if="validator.weight">
              <small class="text-grey">
                Weight: <span class="text-accent">{{ validator.weight }}</span>
              </small>
            </q-item-label>
            <q-item-label>
              <span>
                <span class="q-mr-xs q-mt-xl">Up Time</span>
                <q-badge :color="getColorUptime(validator.uptime)">
                  {{ getUpTime(validator.uptime) }} %
                </q-badge>
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator class="q-mb-xl"/>

        <q-card-section>
          <q-card-section class="col-7 q-mb-xl">
            <div class="q-mb-md text-medium">Stake (AVAX)</div>
            <small class="text-grey">Own</small>
            {{ getLocalString(validator.stake) }}
            <small class="text-accent">AVAX</small>
            <br />
            <small style="color: grey;">
              ({{ getLocalString(validator.stakenAva) }} nAvax)
            </small>
            <div>
            </div>
            <div>
              <small class="text-grey">Delegated</small>
              {{ validator.delegateStake }}
              <small class="text-accent">AVAX</small>
            </div>
            <div>
              <small class="text-grey">Total</small>
              {{ getLocalString(validator.total)}}
              <small class="text-accent">AVAX</small>
            </div>
            <q-separator class="q-pa-xs q-mb-md q-mt-md"/>
            <div class="text-medium q-mt-md">Network Share (%) </div>
            <span class="text-orange q-pl-xs" v-if="validator.percent !== 'NaN'">
              {{validator.percent }} %
            </span>
            <q-separator class="q-pa-xs q-mb-md q-mt-md" />
              <cumulative-stake-chart
                v-bind:name="validator.nodeID + 2"
                v-bind:percent="validator.percent"
                v-bind:percentAll="validator.cumulativeStake ? validator.cumulativeStake : NaN"
              />
            <div class="q-pl-xs q-mt-md">
              <div class="text-medium q-mt-md">Potential Reward</div>
            <span>
              {{ getFormatAva(validator.potentialReward) }} <span class="text-accent">AVAX</span>
            </span>
            </div>
            <q-separator class="q-pa-xs q-mb-md q-mt-md" />
            <div class="q-pl-xs q-mt-md">
              <div class="text-medium">
                Delegations: <span class="text-accent">{{ validator.delegatorsCount}}</span>
              </div>
              <div class="text-medium">
                Delegation Fee: <span class="text-accent">{{ validator.delegationFee }} %</span>
              </div>
            </div>
            <q-separator class="q-pa-xs q-mb-md q-mt-md" />
            <div class="text-medium">Staked By</div>
            <div class="text-accent">
              <small>{{ validator.fromNowST }}</small>
            </div>
            <q-card-section>
              <div class="text-grey q-pt-xl">Progress (%)</div>
              <progress-bar-validate-session
                v-bind:startTime="validator.startTime"
                v-bind:endTime="validator.endTime"
              />
            </q-card-section>
          </q-card-section>
        </q-card-section>
        <q-separator />

        <q-card-section horizontal>
          <q-card-section class="col-6">
            <small class="text-grey text-bold">Start Time</small>
            <br />
            <small>{{ formatDate(validator.startTime) }}</small>
          </q-card-section>
          <q-separator vertical/>
          <q-card-section class="col-6">
            <small class="text-grey text-bold">End Time</small>
            <br />
            <small>{{ formatDate(validator.endTime) }}</small>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
    <div v-else-if="getBlockchain($route.params.id)">
      <div class="q-pa-md gt-xs">
        <div class="text-bold q-pl-md">BLOCKCHAIN ID</div>
        <div class="text-regular text-orange q-pl-md q-pt-md">{{ blockchain.id }}</div>
        <div class="row q-pt-xl q-pl-md">
          <div class="col-6">
            <span class="text-light text-h7">NAME:</span> <div class="text-medium">{{ blockchain.name }}</div>
            <br />
            <span class="text-light text-h7">VM (Virtual Machine):</span>
            <div class="q-pl-xs"><small class="text-grey">ID: </small> <span class="text-medium">{{ blockchain.vmID }}</span></div>
            <div class="q-pl-xs"><small class="text-grey">NAME: </small> <span class="text-medium">{{ blockchain.vmName }}</span></div>
          </div>
          <div class="col-6">
            <span class="text-light text-h7">SUBNET ID:</span> <div class="text-medium">{{ blockchain.subnetID }}</div>
            <br />
            <span class="text-light text-h7">STATUS:</span>
            <div :class="'text-medium text-' + getColor(blockchain.status)">
              {{ blockchain.status }}
              <q-tooltip>{{ getStatusInfo(blockchain.status )}}</q-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="q-pa-md lt-sm">
        <div class="text-bold">BLOCKCHAIN ID</div>
        <div class="text-regular text-orange q-pl-xs q-pt-md">{{ blockchain.id }}</div>
        <div class="row q-pt-xl">
          <div class="col-6">
            <span class="text-light text-h7">NAME:</span> <div class="text-medium">{{ blockchain.name }}</div>
            <br />
            <span class="text-light text-h7">VM (Virtual Machine):</span>
            <div class="q-pl-xs"><small class="text-grey">ID: </small> <span class="text-medium">{{ blockchain.vmID }}</span></div>
            <div class="q-pl-xs"><small class="text-grey">NAME: </small> <span class="text-medium">{{ blockchain.vmName }}</span></div>
          </div>
          <div class="col-6">
            <span class="text-light text-h7">SUBNET ID:</span> <div class="text-medium">{{ blockchain.subnetID }}</div>
            <br />
            <span class="text-light text-h7">STATUS:</span>
            <div :class="'text-medium text-' + getColor(blockchain.status)">
              {{ blockchain.status }}
              <q-tooltip>{{ getStatusInfo(blockchain.status )}}</q-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="fixed-center">
      <p class="flex flex-center q-pt-xl">
        <img
          src="~assets/notfound.svg"
          style="width:30vw;max-width:150px;"
        >
      </p>
      <p class="text-bold text-h6">
        Looks like we don't have any matches for "{{ $route.params.id }}"
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

import { date } from './../modules/time.js'
import { round } from './../utils/commons.js'
import { getAvaFromnAva } from './../utils/avax.js'

const colors = {
  Validating: 'accent',
  Created: 'green',
  Preferred: 'grey',
  Unknown: 'negative'
}

const statusInfo = {
  Validating: 'The blockchain is being validated by this node.',
  Created: 'The blockchain exists but isn’t being validated by this node.',
  Preferred: 'The blockchain was proposed to be created and is likely to be created but the transaction isn’t yet accepted.',
  Unknown: 'The blockchain either wasn’t proposed or the proposal to create it isn’t preferred. The proposal may be resubmitted.'
}

import {
  GET_VALIDATORS,
  GET_PENDING_VALIDATORS
} from './../store/app/types'

import {
  SET_CURRENT_SUBNET,
  SET_CURRENT_BLOCKCHAIN
} from './../store/memory/types'

export default {
  name: 'PageSearch',
  components: {
    CumulativeStakeChart: () => import('components/cumulative-stake-chart'),
    ProgressBarValidateSession: () => import('components/progress-bar-validatе-session')
  },
  computed: {
    ...mapGetters([
      'validatorById',
      'blockchainByID',
      'blockchainByName',
      'networkEndpoint',
      'subnetByID'
    ]),
    validator: function () {
      return this.getValidator(this.$route.params.id)
    },
    rewardOwner: function () {
      const result = this.validator.rewardOwner.addresses
      if (result) return result[0]
      return ''
    },
    subnet: function () {
      return this.getSubnet(this.$route.params.id)
    },
    blockchain: function () {
      return this.getBlockchain(this.$route.params.id)
    }
  },
  methods: {
    ...mapActions({
      getValidators: GET_VALIDATORS,
      getPendingValidators: GET_PENDING_VALIDATORS
    }),
    getFormatOwner (val) {
      if (!val) return
      return `${val.substr(0, 12)}...${val.substr(22)}`
    },
    border (isConnected) {
      if (isConnected) return '#588da8'
      else return '#d8345f'
    },
    getValidator (param) {
      const validator = this.validatorById(param)
      if (!validator) return

      return validator
    },
    getUpTime (val) {
      if (!val) return 0
      return round(val * 100, 100)
    },
    getColorUptime (val) {
      if (val >= 0.6) return 'green'
      return 'negative'
    },
    getBlockchain (param) {
      let blockchain = this.blockchainByID(param)
      if (!blockchain) {
        blockchain = this.blockchainByName(param)
      }

      if (!blockchain) return

      return blockchain
    },
    getSubnet (param) {
      const subnet = this.subnetByID(param)
      if (!subnet) return

      return subnet
    },
    back () {
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
    getLocalString (val) {
      if (!val) return val
      return val.toLocaleString()
    },
    getFormatAva (val) {
      if (!val) return
      return this.getLocalString(getAvaFromnAva(val))
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
        endpoint: this.networkEndpoint.url
      })
      this.getPendingValidators({
        subnetID: id
      })
    },
    getColor (status) {
      return colors[status]
    },
    getStatusInfo (status) {
      return statusInfo[status]
    }
  }
}
</script>

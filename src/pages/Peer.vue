<template>
  <q-page>
    <div style="padding: 1%;">
      <!--gt-xs-->
      <q-card flat class="gt-xs q-pa-xl panel" v-if="peer">
        <div class="row">
          <q-item class="col-9">
            <avatar v-bind:avatar="getAvatarM(peer)" style="cursor:pointer;" />
            <q-item-section>
              <name v-bind:name="'Peer'" v-bind:nodeID="nodeID" v-bind:link="''" />
            </q-item-section>
          </q-item>
        </div>
        <div class="row">
          <div class="col-12">
          <info
            class="q-mt-md my-card dark-panel"
            style="border-radius: 10px;"
            v-bind:role="'NON-VALIDATOR'"
            v-bind:version="version"
            v-bind:country="country"
            v-bind:continent="continent"
            v-bind:countryCode="countryCode"
            v-bind:lastReceived="lastReceived"
            v-bind:lastSent="lastSent"
          />
          </div>
        </div>
      </q-card>
      <!--lt-sm-->
      <q-card flat class="lt-sm panel2" v-if="peer">
          <q-item>
            <avatar v-bind:avatar="getAvatarM(peer)" style="cursor:pointer;" />
          </q-item>
          <q-item>
            <q-item-section>
              <name v-bind:name="'Peer'" v-bind:nodeID="nodeID" v-bind:link="''" />
            </q-item-section>
          </q-item>
        <div class="row">
          <div class="col-12">
          <info
            class="q-mt-md my-card dark-panel"
            style="border-radius: 10px;"
            v-bind:role="'NON-VALIDATOR'"
            v-bind:version="version"
            v-bind:country="country"
            v-bind:continent="continent"
            v-bind:countryCode="countryCode"
            v-bind:lastReceived="lastReceived"
            v-bind:lastSent="lastSent"
          />
          </div>
        </div>
      </q-card>
      <div v-if="!peer">
        <q-inner-loading :showing="visible">
          <q-spinner-gears size="100px" color="purple" />
        </q-inner-loading>
      </div>
      <div class="flex flex-center">
        <img src="~assets/vscoutlogo5.svg" id="logo">
      </div>
      <div class="flex flex-center q-mt-xl text-white">
        Made with ❤️ for builders everywhere.
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { getAvatar } from './../utils/commons.js'

export default {
  name: 'PagePeer',
  data () {
    return {
      peer: null,
      visible: true
    }
  },
  created () {
    this.peer = this.peerById(this.$route.params.id)
    if (this.peer) this.visible = false
  },
  computed: {
    ...mapGetters([
      'peerById',
      'peers'
    ]),
    country: function () {
      if (!this.peer) return ''
      return this.peer.country
    },
    version: function () {
      if (!this.peer) return ''
      return this.peer.version
    },
    countryCode: function () {
      if (!this.peer) return ''
      return this.peer.countryCode
    },
    continent: function () {
      if (!this.peer) return ''
      return this.peer.continent
    },
    lastReceived: function () {
      if (!this.peer) return ''
      return this.peer.lastReceived
    },
    lastSent: function () {
      if (!this.peer) return ''
      return this.peer.lastSent
    },
    nodeID: function () {
      if (!this.peer) return ''
      return this.peer.nodeID
    }
  },
  watch: {
    peers: {
      handler: function (v) {
        this.peer = this.peerById(this.$route.params.id)
        if (this.peer) this.visible = false
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    Avatar: () => import('components/validator/avatar.vue'),
    Name: () => import('components/validator/name.vue'),
    Info: () => import('components/validator/info.vue')
  },
  methods: {
    ...mapActions({
    }),
    getAvatarM (peer) {
      if (!peer) return ''
      return getAvatar(peer.nodeID).monster
    },
    getCode () {
      if (this.countryCode) return this.countryCode.toLowerCase()
      return null
    }
  }
}
</script>
<style scoped>
 #logo {
  width: 190vw;
  max-width: 190px;
 }
</style>

<template>
  <span>
    <q-btn flat size="sm" color="purple" v-if="notificationNode.nodeID">
    <img :src="notificationNode.avatar" class="avatar2" />
    <q-menu
        v-model="removeNotification"
        transition-show="scale"
        transition-hide="scale"
        :dark="appTheme==='dark'"
    >
        <q-card class="panel2" style="border-left: 0.1px solid #9c929c;">
        <q-card-section>
            <q-input readonly bottom-slots v-model="notificationNode.nodeID" :dark="appTheme==='dark'">
            <template v-slot:before>
            <q-avatar>
                <q-icon name="notifications_off" />
            </q-avatar>
            </template>

            <template v-slot:hint>
              Turn Off Notifications
            </template>

            <template v-slot:after>
            <q-btn round dense flat icon="send" @click="turnOffNotification"/>
            </template>
        </q-input>
        </q-card-section>

        <q-separator :dark="appTheme==='dark'" />
        <p class="row q-ml-md q-mt-md text-panel">Countdown</p>
        <countdown
            style="width: 90%;"
            class="row q-ml-md"
            v-bind:color="appTheme === 'dark' ? 'white' : 'grey'"
            v-bind:countdown="notificationNode.remainingTime"
        />
        <q-card-section>
            <q-list v-for="(notification, i) in notificationsReverse" v-bind:key="i">
            <q-item :dark="appTheme === 'dark'">
                <q-item-section>
                    <q-item-label>{{ notification.title }}</q-item-label>
                <q-item-label caption lines="2">{{ notification.message }}</q-item-label>
                </q-item-section>

                <q-item-section side top>
                <q-item-label caption>{{ getTimeFromNow(notification.date) }}</q-item-label>
                <q-icon :name="notification.icon" :color="notification.type ? 'positive' : 'negative'" />
                </q-item-section>
            </q-item>
            <q-separator />
            </q-list>
            <span class="text-panel" v-if="notifications.length < 1">No Notifications</span>
        </q-card-section>
        </q-card>
    </q-menu>
    <q-badge color="purple" v-if="notifications.length > 0" floating>{{ notifications.length }}</q-badge>
    </q-btn>
    <q-btn flat size="sm" color="text-panel" icon="notifications" v-else>
    <q-menu
        v-model="addNotification"
        transition-show="scale"
        transition-hide="scale"
        :dark="appTheme==='dark'"
    >
    <q-card class="panel2" style="border-left: 0.1px solid #9c929c;">
        <q-card-section>
          <q-item>
            <q-input autofocus bottom-slots v-model="nodeIDN" label="NodeID-..." :dark="appTheme==='dark'" @input="filterFn" >
                <template v-slot:before>
                <q-avatar>
                  <q-icon name="notifications" />
                </q-avatar>
                </template>

                <template v-slot:append>
                <q-icon v-if="nodeIDN !== ''" name="close" @click="nodeIDN = ''" class="cursor-pointer" />
                </template>

                <template v-slot:hint>
                Turn On Notifications
                </template>

                <template v-slot:after>
                <q-btn round dense flat icon="send" @click="addNodeIdNotification"/>
                </template>
            </q-input>
          </q-item>
          <q-separator />
          <q-list style="min-width: 250px;" v-for="(c, i) in nodes" v-bind:key="i">
            <q-item :dark="appTheme==='dark'">
              <q-item-section>
                <q-item-label><small>{{ c }}</small></q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-icon size="xs" name="check_box" v-if="c === nodeIDN" />
                <q-icon size="xs" name="check_box_outline_blank" v-else @click="nodeIDN=c"/>
              </q-item-section>
             </q-item>
          </q-list>
        </q-card-section>
    </q-card>
    </q-menu>
    </q-btn>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  SET_NOTIFICATION_NODE,
  CLEAR_NOTIFICATIONS_LIST
} from './../store/app/types'

export default {
  name: 'NotifyBtn',
  data () {
    return {
      removeNotification: false,
      addNotification: false,
      nodeIDN: '',
      nodes: [],
      stringOptions: []
    }
  },
  components: {
    Countdown: () => import('components/items/countdown.vue')
  },
  watch: {
    removeNotification (val) {
      if (!val) this.$store.commit(CLEAR_NOTIFICATIONS_LIST)
    }
  },
  computed: {
    ...mapGetters([
      'notificationNode',
      'notifications',
      'appTheme',
      'validatorById',
      'defaultValidators'
    ]),
    notificationsReverse: function () {
      // todo
      // const result = this.notifications
      return this.notifications // result.reverse()
    }
  },
  created () {
    this.nodes = this.defaultValidators
      .map(v => v.nodeID)
    if (!this.nodes) return
    this.stringOptions = this.nodes
  },
  methods: {
    turnOffNotification () {
      this.$store.commit(SET_NOTIFICATION_NODE, { node: {} })
      this.$store.commit(CLEAR_NOTIFICATIONS_LIST)
    },
    addNodeIdNotification () {
      // todo search from list
      const node = this.validatorById(this.nodeIDN.trim())
      if (node) {
        this.$store.commit(SET_NOTIFICATION_NODE, { node })
      } else {
        this.$q.notify({
          timeout: 5000,
          color: 'white',
          position: 'center',
          textColor: 'orange',
          message: 'Incorrect Node ID!'
        })
      }
    },
    filterFn (update) {
      if (this.nodeIDN === '') {
        this.nodes = this.stringOptions
        return
      }
      const needle = this.nodeIDN.toLowerCase()
      this.nodes = this.stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
    }
  }
}
</script>

<template>
  <q-dialog v-model="ui.selectAccounts.isOpen" persistent>
    <q-card style="min-width: 500px!important;max-height: 500px;">
      <q-card-section class="row items-center">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="~assets/choose.svg" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>Platform Accounts</q-item-label>
            <q-item-label caption>
              The accounts controlled by this user.
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-space />
        <q-btn
           class="q-ml-xl"
           icon="close"
           flat round dense
           @click="closeSelectAccounts"
         />
      </q-card-section>
      <q-list bordered>
        <q-item
            v-for="account in ui.selectAccounts.accounts"
            :key="account.address"
            class="q-my-sm"
            @click.native="onSelectClick(account)"
            clickable
            v-ripple
        >
            <q-item-section avatar>
            <q-avatar color="accent" text-color="white">
                {{ account.address.substr(0, 1) }}
            </q-avatar>
            </q-item-section>

            <q-item-section>
            <q-item-label>{{ account.address }}</q-item-label>
            <q-item-label caption lines="1">Balance: {{ account.balance }}</q-item-label>
            </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import {
  OPEN_SELECT_ACCOUNTS,
  CLOSE_SELECT_ACCOUNTS
} from './../store/ui/types'

export default {
  name: 'SelectAccount',
  computed: {
    ...mapGetters([
      'ui'
    ])
  },
  methods: {
    ...mapActions({
      openSelectAccounts: OPEN_SELECT_ACCOUNTS,
      closeSelectAccounts: CLOSE_SELECT_ACCOUNTS
    }),
    onSelectClick (account) {
      this.$emit('select', account)
    }
  }
}
</script>

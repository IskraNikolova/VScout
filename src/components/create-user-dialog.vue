<template>
  <q-dialog v-model="ui.uCreate.isOpen" persistent >
    <q-card style="max-width: 500px!important;min-height: 370px;">
      <q-card-section class="row items-center">
        <q-item>
          <q-item-section avatar>
            <img src="~assets/user.svg" style="width: 30px;"/>
          </q-item-section>
          <q-item-section style="max-width: 70%;">
            <q-item-label>Create User</q-item-label>
            <q-item-label caption>
              A user is a password-protected identity that a client can use when interacting with blockchains.
            </q-item-label>
          </q-item-section>
          <q-space />
         <q-btn icon="close" flat round dense @click="closeU" />
        </q-item>
      </q-card-section>
      <div class="text-warning q-pl-md outlined" v-if="error">
        <q-icon name="report_problem" /> {{ error }}
      </div>
      <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
          >
            <q-input
              color="accent"
              class="q-mb-xs"
              outlined
              clearable
              label-color="negative"
              v-model="username"
              label="Username *"
              lazy-rules
              @focus="error=null"
              :rules="[ val => val && val.length > 0 || 'Please type your username!']"
            />
            <q-input
              color="accent"
              class="q-mb-xs"
              outlined
              clearable
              type="password"
              label-color="negative"
              v-model="password"
              @focus="error=null"
              label="Password *"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Please type your password!']"
            />
            <div class="q-pb-xl">
              <q-btn label="Create" class="full-width" type="submit" size="10px" color="accent"/>
            </div>
          </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import {
  CREATE_USER
} from './../store/app/types'

import {
  OPEN_CREATE_USER,
  CLOSE_CREATE_USER
} from './../store/ui/types'

export default {
  name: 'CreateUserDialog',
  computed: {
    ...mapGetters([
      'ui'
    ])
  },
  data () {
    return {
      username: null,
      password: null,
      error: null
    }
  },
  created () {
    this.error = null
  },
  methods: {
    ...mapActions({
      openU: OPEN_CREATE_USER,
      closeU: CLOSE_CREATE_USER,
      createUser: CREATE_USER
    }),
    onClose () {
      this.error = null
      this.closeU()
    },
    async onSubmit () {
      this.error = null
      try {
        await this.createUser({
          username: this.username,
          password: this.password
        })
        this.closeU()
      } catch (err) {
        this.error = err.message
      }
    }
  }
}
</script>

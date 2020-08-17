<template>
  <q-btn
    size="xs"
    flat
    icon="img:statics/settings.svg"
  >
    <q-menu>
      <q-list dense style="min-width: 100px">
        <q-item clickable>
          <q-item-section> Blockchains </q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
          <q-menu anchor="top right" self="top left">
            <div class="q-pa-md text-grey">
              Blockchains
            </div>
            <q-separator color="orange" />
            <list-blockchains />
          </q-menu>
        </q-item>
        <q-item clickable>
          <q-item-section> Subnets </q-item-section>
            <q-item-section side>
            <q-icon name="keyboard_arrow_right" />
          </q-item-section>
          <q-menu anchor="top right" self="top left">
            <div class="q-pa-md text-grey">
              Subnets
            </div>
            <q-separator color="orange"/>
            <list-subnets />
          </q-menu>
        </q-item>
        <q-separator />
        <q-item clickable>
          <q-item-section>
            Network Endpoints
          </q-item-section>
          <q-menu anchor="top right" self="top left">
            <div class="q-pa-md text-grey">
              <q-icon name="img:statics/node.svg" />
              Switch To Endpoint
            </div>
            <q-separator color="orange" />
            <switch-endpoint />
          </q-menu>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>

import ListSubnets from './../list-subnets'
import SwitchEndpoint from './../switch-endpoint'
import ListBlockchains from './../list-blockchains'

export default {
  name: 'Settings',
  components: {
    ListSubnets,
    SwitchEndpoint,
    ListBlockchains
  }
}
</script>

<template>
  <div>
    <div id="f-size12" class="q-pb-md text-medium">SUBNETWORK</div>
    <div>
      <div class="text-h6 q-pb-md text-orange" style="cursor: pointer;" v-if="isDefaultSubnetID" @click="$router.push(`/search/${currentSubnet.id}`)">
        Default Subnet
      </div>
      <div v-else class="q-pb-md q-pt-xs text-orange" style="font-size: 19px;cursor: pointer;" @click="$router.push(`/search/${currentSubnet.id}`)">
        <small>{{ currentSubnet.id }}</small>
      </div>
    </div>
    <div class="row">
      <div class="col-4 q-mt-xs" id="f-size12">
        Threshold:
        <span class="text-h7 text-grey"> {{ currentSubnet.threshold }}</span>
      </div>
      <div class="col">
        <q-btn-dropdown
         flat color="accent"
         v-if="currentSubnet.threshold > 0"
         size="xs" no-caps
         label="Control Keys"
        >
          <q-list v-for="key in currentSubnet.controlKeys" v-bind:key="key">
            <q-item>
              <q-item-section>
                <span>{{ key }}</span>
              </q-item-section>
              <q-item-section side>
              <q-icon size="xs" name="img:statics/key.svg" color="grey" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Subnetwork',
  computed: {
    ...mapGetters([
      'currentSubnet',
      'isDefaultSubnetID'
    ])
  }
}
</script>

<template>
  <div>
    <div class="flex flex-center text-h2 q-pt-xl text-white">FAQ</div>
    <div class="flex flex-center q-pl-xl text-h7 q-pt-xl q-mb-xl text-white">
      Let's answer some questions you may have.
      <q-btn no-caps flat v-if="!visible" @click="visible=!visible" icon="expand_more"/>
      <q-btn no-caps flat v-else @click="visible=!visible" icon="expand_less"/>
    </div>
    <q-slide-transition>
      <div v-show="visible">
        <q-card class="q-mt-md q-pt-xl q-pl-xl q-pb-md q-mb-xl">
            <div v-for="(question, i) in questions"
              v-bind:key="i">
              <q-slide-transition>
                <div v-show="visible">
                  <div class="text-h3 text-orange">. <span class="text-h6 text-grey">{{question.title}}</span></div>
                  <q-separator spaced style="width: 50%;" class="q-pt-xs"/>
                  <div v-html="question.content" style="font-size: 14px;padding-right: 20%;margin-bottom: 50px;"></div>
              </div>
              </q-slide-transition>
            </div>
        </q-card>
      </div>
    </q-slide-transition>
  </div>
</template>

<script>

export default {
  name: 'Faqs',
  data () {
    return {
      visible: true,
      innerVisible: true,
      questions: [
        {
          title: 'Who can be an Avalanche validator?',
          content: 'Anyone who covers the minimum hardware and staking amount requirements can become a validator on Avalanche.'
        },
        {
          title: 'What are the requirements for running a validator node on Avalanche?',
          content: 'Avalanche is an incredibly lightweight protocol, so the minimum computer requirements are quite modest. <br /> Hardware: CPU > 2 GHz, RAM > 4 GB, Storage > 10 GB free space.<br />The minimum stake requirement for Avalanche Mainnet is 2000 AVAX.'
        },
        {
          title: 'Do I need to trust the validator to transfer my delegation rewards?',
          content: 'No, rewards are handled on protocol level.'
        },
        {
          title: 'Do I earn less as a delegator?',
          content: 'You will earn the same as validators minus the delegation fee set by the validator you choose to delegate to.'
        },
        {
          title: 'Do I need to keep my private keys on my validator?',
          content: 'No, you don’t need to keep your private keys on your validator. And we strongly advise you not to.'
        },
        {
          title: 'Can I add more stake to my validator while the staking period is in progress?',
          content: 'Yes. You can use delegation to delegate stake to your own validator, this will effectively increase your stake.'
        },
        {
          title: 'Can I stop my validator and unstake?',
          content: 'No. Your stake is locked for the pre-defined staking period, your stake is automatically returned to your address upon completion, together with the accumulated staking rewards.'
        },
        {
          title: 'Can I stake coins that are not yet unlocked by my vesting schedule?',
          content: 'Yes. Locked coins can be staked on your own validator or delegated to an existing one.'
        },
        {
          title: 'When should I receive my rewards for running a validator?',
          content: 'All validation/delegation rewards are credited in your selected destination address upon completion of the staking period determined in the process of adding a validator.'
        },
        {
          title: 'Is my validating node uptime important?',
          content: 'Yes, the reward is directly correlated to your uptime.'
        },
        {
          title: 'How can I check if my node is healthy and operational?',
          content: 'Simply select your node as an endpoint in <b>VScout</b>. Once you are connected to your node you can perform health checks through our UI'
        },
        {
          title: 'I need help, where can I receive technical support?',
          content: 'Avalanche Discord is the place to be for all technical questions, join at <a style="text-decoration: none;" class="text-orange" href="http://chat.avax.network">chat.avax.network</a>.'
        }
      ]
    }
  }
}
</script>

<template>
  <div>
    <div class="flex flex-center text-h2 q-pt-xl text-white">FAQs</div>
    <div class="q-pl-xl text-h7 q-pt-xl q-mb-xl text-white">
      Let's answer some questions you may have.
      <q-btn no-caps flat v-if="!visible" @click="visible=!visible" icon="expand_more"/>
      <q-btn no-caps flat v-else @click="visible=!visible" icon="expand_less"/>
    </div>
    <!--<q-slide-transition>
      <div v-show="visible">
        <q-card
          class="q-pa-md q-pl-xl q-pt-xl"
        >
            <div class="row absolute-top-right">
              <q-btn no-caps flat v-if="!innerVisible" @click="innerVisible=!innerVisible" icon="expand_more"/>
              <q-btn no-caps flat v-else @click="innerVisible=!innerVisible" icon="expand_less"/>
            </div>
            <div v-for="(question, i) in questions"
              v-bind:key="i" class="q-mb-xl">
              <q-slide-transition>
                <div v-show="visible">
                  <div class="text-h6">{{question.title}}</div>
                  <q-separator spaced style="width: 70%;"/>
                  <q-slide-transition>
                    <div v-show="innerVisible">
                      <div v-html="question.content" style="color: grey;font-size: 13px;"></div>
                    </div>
                  </q-slide-transition>
              </div>
              </q-slide-transition>
            </div>
        </q-card>
      </div>
    </q-slide-transition>-->
  </div>
</template>

<script>

export default {
  name: 'Faqs',
  data () {
    return {
      visible: false,
      innerVisible: true,
      questions: [
        {
          title: 'What are subnetworks?',
          content: `Other blockchain architectures are monolithic. This means that they implement a single blockchain, which consists of a single set of validators and a single execution environment. AVA is designed to be a build-your-own-blockchain platform. You can define your own set of validators, and import your own functionality (e.g. import the Ethereum virtual machine, or EVM).
           This is where subnetworks come in: they allow you to deploy sandboxed blockchains that are part of the larger AVA network. They can operate entirely privately or interoperate freely with the rest of the network. An example of such a subnetwork is Athereum.`
        },
        {
          title: 'What is the native token used for?',
          content: 'In short, the AVA token is crucial for securing the network, paying for expensive operations in the network, and enabling atomic swaps of assets (between subnetworks). The AVA token has similar functionality to “gas” in Ethereum, although it has additional utility.'
        },
        {
          title: 'How long will transactions take?',
          content: 'Usually transactions should finalize in about a second.'
        },
        {
          title: 'Who is building AVA?',
          content: 'The initial AVA team consists of distributed systems and finance experts, with deep domain expertise in building blockchains and financial products. As we open-source our technology, development will be global.'
        },
        {
          title: 'How many tps does AVA handle?',
          content: 'Each subnetwork on AVA supports over 6000 transactions per second and has the potential to achieve over 20,000 transactions per second with additional optimizations.'
        },
        {
          title: 'What does AVA solve?',
          content: 'AVA provides a platform for the development of compliant and interoperable public and private blockchains, thus enabling -- for the first time -- the right architectural foundations for democratizing capital flows. Leveraging the platform\'s high level of performance and flexibility, AVA enables new forms of marketplaces for assets.'
        },
        {
          title: 'What is AVA\'s governance model?',
          content: 'We understand that in order to have a truly decentralized platform we will need involvement from the holders of the tokens themselves. To that end, AVA enables dynamic parameter optimization through token holders. The key governable parameters are the contentious ones, such as minting rate, and minimum stake amount.'
        },
        {
          title: 'Is there any available airdrop or bounty program?',
          content: 'We have a bug bounty program. See <a href="https://www.avalabs.org/avalanche-x">here</a>.'
        },
        {
          title: 'What kind of assets can I create on AVA?',
          content: 'Any kind you can imagine! In AVA, you can deploy sub-networks of any kind and trade assets with any covenants and rulesets that suit your needs.'
        },
        {
          title: 'Why do you call AVA a construction kit / LEGO?',
          content: 'AVA takes an interesting approach to its design: everything is a modular component. In other words, everything that you need to build highly performant, decentralized ledgers are available to you as building blocks, hence the "LEGO" analogy.'
        },
        {
          title: 'What does a "heterogeneous network" mean?',
          content: 'It simply means that each subnetwork can implement vastly different functionalities, thus creating a highly "heterogeneous" set of subnetworks.'
        },
        {
          title: 'Where can I check out the code?',
          content: 'The main client is open sourced on Github. Check it out <a href="https://github.com/ava-labs/gecko">here</a>.'
        },
        {
          title: 'Is there a difference between the AVA Platform and Avalanche?',
          content: `Avalanche is one of the two types of consensus protocols underlying AVA Platform. Avalanche is suited for partially ordered, high throughput applications such as payments or asset transfers. The Snowman protocol, on the other hand, builds a linear chain, and is suited for smart contracts.

AVA platform is where everything runs. The AVA platform makes use of either Avalanche or Snowman.`
        },
        {
          title: 'Is the AVA platform permissionless?',
          content: 'Creation of new subnetworks and validation into permissionless subnetworks is -- of course -- entirely permissionless. Anyone can use the AVA token and boot up a new subnetwork or validate existing permissionless ones. However, the private deployments on AVA will remained permissioned. The hybrid architecture is what enables AVA to bridge all forms of blockchains so seamlessly.'
        },
        {
          title: 'Will there be developer documentation?',
          content: 'Yes, see <a href="https://docs.avax.network/">here</a>.'
        },
        {
          title: 'Does Avalanche only support payments?',
          content: 'Avalanche achieves partial ordering. This is by construction, since the performance of partially ordered databases is higher than their totally-ordered cousins. However, Avalanche can be made to support linear chains. The linear implementation of Avalanche is called Snowman, and they both run within the AVA network.'
        },
        {
          title: 'How does AVA achieve Sybil resistance?',
          content: 'Staking.'
        },
        {
          title: 'What kind of smart contracts are available on AVA?',
          content: 'For now, full EVM support, and thus all Ethereum smart contracts. We hope to also support WASM soon.'
        }
      ]
    }
  }
}
</script>

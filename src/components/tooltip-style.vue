<template>
  <q-tooltip content-class="bg-white text-grey" content-style="font-size: 13.5px;border-style: solid;border-width: 0.1px;max-width: 300px!important;">
    <q-icon v-if="icon" :name="icon" class="q-pb-xs" /> <div v-html="formatText"></div>
  </q-tooltip>
</template>
<script>
export default {
  name: 'TooltipStyle',
  props: {
    text: {
      type: String,
      required: true
    },
    bold: {
      type: Array,
      required: false
    },
    brandColoring: {
      type: Array,
      required: false
    },
    icon: {
      type: String,
      required: false
    }
  },
  computed: {
    formatText: function () {
      if (!this.bold && !this.brandColoring) return this.text

      let res = this.text
      if (this.bold) {
        const boldWords = this.bold.join('|')
        const regex = new RegExp(boldWords, 'gi')
        res = res.replace(regex, function (a, b) {
          return '<span class="text-medium">' + a + '</span>'
        })
      }

      if (this.brandColoring) {
        const brandWords = this.brandColoring.join('|')
        const regex2 = new RegExp(brandWords, 'gi')
        res = res.replace(regex2, function (a, b) {
          return '<span class="text-orange text-medium">' + a + '</span>'
        })
      }

      return res
    }
  }
}
</script>

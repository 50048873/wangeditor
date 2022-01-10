<template>
  <a-modal
    title="新增公式"
    width="600px"
    :visible="visible"
    @ok="ok"
    @cancel="cancel"
  >
    <iframe name="mathIframe" width="100%" height="440" src="/math/index.html" frameborder="0"></iframe>
  </a-modal>
</template>

<script>
export default {
  name: 'FormulaPop',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ok () {
      const mathIframe = window.frames['mathIframe']
      const math = mathIframe.answer.mathquill('html')
      let values = {}
      values.parameterValue = '<span contenteditable="false" class="mathquill-rendered-math" style="font-size:20px;">' + math + '</span>'
      this.$emit('ok', values)
      this.$emit('update:visible', false)
    },
    cancel () {
      this.$emit('update:visible', false)
    }
  }
}
</script>


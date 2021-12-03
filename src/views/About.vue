<template>
    <div>
      <div ref="editor"></div>
      <button type="button" id="btn1" @click="getHtml">获取html</button>
      <button type="button" id="btn2" @click="setHtml">设置html</button>
      <div ref="newHtml" class="newHtml"></div>
    </div>
</template>

<script>
/* eslint-disable */
import E from 'wangeditor'
import { wangEditorTableExtend } from '@/assets/tool'
export default {
  name: 'about',
  mixins: [wangEditorTableExtend],
  mounted () {
    this.initEditor()
  },
  methods: {
    getHtml () {
        this.newHtml = this.editor.txt.html()
        this.$refs.newHtml.innerHTML = this.newHtml
    },
    setHtml () {
        // this.newHtml = ``
        this.editor.txt.html(this.newHtml)
        // this.initTableInteraction()
    },
    initEditor () {
        this.editor = new E(this.$refs.editor)

        /*this.editor.config.onchange = (newHtml) => {
            console.log("change 之后最新的 newHtml", newHtml)
        };*/
        this.editor.config.onchangeTimeout = 200; // 修改为 500ms
        this.editor.create()
    },
  },
}
</script>

<style>
    .newHtml {
        border-collapse: collapse;
    }
    .newHtml th, .newHtml td {
        height: 30px;
        border: 1px solid #eee;
    }
    .w-e-text-container {
        height: 330px!important;
    }
</style>
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
import TableMergeCell from '@/assets/tableMergeCell'
import '@/assets/tableMergeCell.css'
export default {
  name: 'home',
  mounted () {
    this.initEditor()
    this.tableObserve()
  },
  methods: {
    initTableMergeCell () {
        if (!this.$refs.editor) return
        const tables = this.$refs.editor.querySelectorAll('.w-e-text > table')
        tables.forEach(table => {
            this.instance = new TableMergeCell(table)
        })
    },
    getHtml () {
        this.newHtml = this.editor.txt.html()
        this.$refs.newHtml.innerHTML = this.newHtml
    },
    setHtml () {
        this.editor.txt.html(this.newHtml)
    },
    initEditor () {
        this.editor = new E(this.$refs.editor)

        this.editor.config.onchange = (newHtml) => {
            // console.log("change 之后最新的 newHtml", newHtml)
            // this.initTableMergeCell()
        };
        this.editor.config.onchangeTimeout = 200; // 修改为 500ms
        this.editor.create()
    },
    tableObserve () {
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                const {target, addedNodes} = mutation
                const [addedNode] = addedNodes
                if (target.className.includes('w-e-text') && addedNode && addedNode.tagName === 'TABLE') {
                    this.initTableMergeCell()
                }
            }
        }
        const observer = new MutationObserver(callback)
        const ele = this.$refs.editor.querySelector('.w-e-text-container')
        observer.observe(ele, {
            childList: true,
            subtree: true,
        })
    },
  }
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
    .w-e-tooltip {
        display: none!important;
    }
</style>
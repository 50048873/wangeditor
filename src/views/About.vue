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
import '@/assets/tableMergeCell.scss'
// import ColumnResizer from 'column-resizer'
import ColumnResizer from '@/assets/columnResizer'
import '@/assets/columnResizer.scss'
export default {
  name: 'home',
  mounted () {
    this.initEditor()
    this.tableObserve()
  },
  methods: {
    initTableInteraction () {
        if (!this.$refs.editor) return
        const tables = this.$refs.editor.querySelectorAll('.w-e-text > table')
        tables.forEach(table => {
            new TableMergeCell(table, {
                onAddCol: () => {
                    this.resizer.reset()
                },
            })
            this.resizer = new ColumnResizer(table, {
                // resizeMode: 'overflow',
            })
        })
    },
    getHtml () {
        this.newHtml = this.editor.txt.html()
        this.$refs.newHtml.innerHTML = this.newHtml
    },
    setHtml () {
        // this.newHtml = ``
        this.editor.txt.html(this.newHtml)
        this.initTableInteraction()
    },
    initEditor () {
        this.editor = new E(this.$refs.editor)

        this.editor.config.onchange = (newHtml) => {
            // console.log("change 之后最新的 newHtml", newHtml)
        };
        this.editor.config.onchangeTimeout = 200; // 修改为 500ms
        this.editor.create()
    },
    tableObserve () {
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                const {target, addedNodes, removedNodes} = mutation
                const [addedNode] = addedNodes
                const [removednodes] = removedNodes
                if (target.className.includes('w-e-text') && addedNode && addedNode.tagName === 'TABLE') {
                    this.initTableInteraction()
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
    .w-e-text-container {
        height: 330px!important;
    }
</style>
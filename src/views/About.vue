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
import ColumnResizer from '@/assets/columnResizer'
import '@/assets/columnResizer.scss'
export default {
  name: 'about',
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
                    table.columnResizer.reset()
                },
            })
            new ColumnResizer(table, {
                // resizeMode: 'overflow',
            })
        })
    },
    getHtml () {
        this.newHtml = this.editor.txt.html()
        this.$refs.newHtml.innerHTML = this.newHtml
    },
    setHtml () {
        this.newHtml = `<table border="0" width="100%" cellpadding="0" cellspacing="0" class="tableMergeCell" style="text-align: center; overflow: initial;"><tbody><tr><th>   <i data-col="0" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="1" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="2" contenteditable="false" class="tableMergeCell-handshank"></i></th><th style="width: 50px;">   <i data-col="3" contenteditable="false" class="tableMergeCell-handshank" style="transform: none;"></i></th><th>   <i data-col="4" contenteditable="false" class="tableMergeCell-handshank"></i></th><th style="width: 99.6094px;">   <i data-col="5" contenteditable="false" class="tableMergeCell-handshank" style="transform: translateX(-72px);"></i></th><th>   <i data-col="6" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="7" contenteditable="false" class="tableMergeCell-handshank" style="transform: translateX(75px);"></i></th><th>   <i data-col="8" contenteditable="false" class="tableMergeCell-handshank" style="transform: translateX(58px);"></i></th><th>   <i data-col="9" contenteditable="false" class="tableMergeCell-handshank" style="transform: translateX(166px);"></i></th><th>   <i data-col="10" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="11" contenteditable="false" class="tableMergeCell-handshank"></i></th><th style="width: 64px;">   <i data-col="12" contenteditable="false" class="tableMergeCell-handshank" style="transform: translateX(-305px);"></i></th><th>   <i data-col="13" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="14" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="15" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="16" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="17" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="18" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="19" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="20" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="21" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="22" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="23" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="24" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="25" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="26" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="27" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="28" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="29" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="30" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="31" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="32" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="33" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="34" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="35" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="36" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="37" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="38" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="39" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="40" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="41" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="42" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="43" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="44" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="45" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="46" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="47" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="48" contenteditable="false" class="tableMergeCell-handshank"></i></th><th>   <i data-col="49" contenteditable="false" class="tableMergeCell-handshank"></i></th></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td rowspan="2" colspan="2"></td><td style="display: none;"></td><td></td><td></td><td>1</td><td style="display: table-cell;"><br></td><td>3</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td><table border="0" width="100%" cellpadding="0" cellspacing="0"><tbody><tr><th></th><th></th><th></th><th></th><th></th></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table><p data-we-empty-p=""><br></p></td><td></td><td></td><td rowspan="1" colspan="2"><table border="0" width="100%" cellpadding="0" cellspacing="0"><tbody><tr><th></th><th></th><th></th><th></th><th></th></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table><p data-we-empty-p=""><br></p></td><td style="display: none;"></td><td></td><td style="display: none;"></td><td style="display: none;"></td><td></td><td></td><td style="display: table-cell;"><br></td><td style="display: table-cell;"></td><td></td><td></td><td class="selected"><span style="background-color: rgb(194, 79, 74);">1</span></td><td></td><td></td><td></td><td>12r332</td><td></td><td><b>1​</b></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><b>​</b></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>`
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
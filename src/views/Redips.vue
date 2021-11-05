<template>
  <div>
    <div ref="editor"></div>
    <button type="button" id="btn1">获取html</button>
    <button type="button" id="btn2">设置html</button>
    <button type="button" id="btn3" @click="redips.merge()">Merge</button>
    <button type="button" id="btn4" @click="redips.split('h') && redips.split('v')">split</button>
    <div ref="newHtml" class="newHtml"></div>
  </div>
</template>

<script>
/* eslint-disable */
import E from 'wangeditor'
export default {
  name: 'Redips',
  created () {
    this.redips = {}
  },
  mounted () {
    this.initEditor()
    this.tableObserve()
  },
  methods: {
    initRedips () {
        if (!this.$refs.editor) return
        const table = this.$refs.editor.querySelector('table')
        table.setAttribute('id', 'mainTable')


        // REDIPS.table initialization
        this.redips.init = function () {
            // define reference to the REDIPS.table object
            var rt = REDIPS.table;
            // activate onmousedown event listener on cells within table with id="mainTable"
            rt.onMouseDown('mainTable', true);
            // show cellIndex (it is nice for debugging)
            rt.cellIndex(true);
            // define background color for marked cell
            rt.color.cell = '#9BB3DA';
        };


        // function merges table cells
        this.redips.merge = function () {
            // first merge cells horizontally and leave cells marked
            REDIPS.table.merge('h', false);
            // and then merge cells vertically and clear cells (second parameter is true by default)
            REDIPS.table.merge('v');
        };


        // function splits table cells if colspan/rowspan is greater then 1
        // mode is 'h' or 'v' (cells should be marked before)
        this.redips.split = function (mode) {
            REDIPS.table.split(mode);
        };


        // insert/delete table row
        this.redips.row = function (type) {
            REDIPS.table.row('mainTable', type);
        };


        // insert/delete table column
        this.redips.column = function (type) {
            REDIPS.table.column('mainTable', type);
        };

        this.redips.init()
    },
    initEditor () {
        const editor = new E(this.$refs.editor)

        editor.config.onchange = (newHtml) => {
            // console.log("change 之后最新的 newHtml", newHtml)
        };
        editor.config.onchangeTimeout = 200; // 修改为 500ms
        editor.create()

        const getHtml = () => {
            this.newHtml = editor.txt.html()
            this.$refs.newHtml.innerHTML = this.newHtml
        }
        const setHtml = () => {
            editor.txt.html(this.newHtml)
        }
        const btn1 = document.querySelector('#btn1')
        const btn2 = document.querySelector('#btn2')
        btn1.addEventListener('click', getHtml, false)
        btn2.addEventListener('click', setHtml, false)
    },
    tableObserve () {
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                const {target, addedNodes} = mutation
                const [addedNode] = addedNodes
                if (target.className.includes('w-e-text') && addedNode && addedNode.tagName === 'TABLE') {
                    this.initRedips()
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
    .TableMergeCell {
        table-layout: fixed;
    }
    .TableMergeCell .selected {
        background-color: #e6efff;
    }
</style>

<style>
    .newHtml {
        border-collapse: collapse;
    }
    .newHtml th, .newHtml td {
        height: 30px;
        border: 1px solid #eee;
    }
</style>
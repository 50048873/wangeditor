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
        this.newHtml = `<table border="0" width="100%" cellpadding="0" cellspacing="0" class="tableMergeCell"><tbody><tr><th>0-0</th><th>0-1</th><th>0-2</th><th>0-3</th><th>0-4</th><th>0-5</th><th>0-6</th><th>0-7</th><th>0-8</th><th>0-9</th></tr><tr><td rowspan="" colspan="">1-0</td><td style="">1-1</td><td style="" rowspan="2" colspan="3">1-2</td><td style="display: none;">1-3</td><td style="display: none;">1-4</td><td>1-5</td><td>1-6</td><td>1-7</td><td>1-8</td><td>1-9</td></tr><tr><td>2-0</td><td rowspan="" colspan="">2-1</td><td style="display: none;">2-2</td><td style="display: none;">2-3</td><td style="display: none;">2-4</td><td>2-5</td><td>2-6</td><td>2-7</td><td>2-8</td><td>2-9</td></tr><tr><td rowspan="1" colspan="4">3-0</td><td style="display: none;">3-1</td><td style="display: none;">3-2</td><td style="display: none;">3-3</td><td>3-4</td><td>3-5</td><td>3-6</td><td>3-7</td><td>3-8</td><td>3-9</td></tr><tr><td>4-0</td><td>4-1</td><td>4-2</td><td rowspan="1" colspan="4">4-3</td><td style="display: none;">4-4</td><td style="display: none;">4-5</td><td style="display: none;">4-6</td><td>4-7</td><td>4-8</td><td>4-9</td></tr><tr><td>5-0</td><td rowspan="1" colspan="2">5-1</td><td style="display: none;">5-2</td><td>5-3</td><td>5-4</td><td>5-5</td><td>5-6</td><td>5-7</td><td>5-8</td><td>5-9</td></tr><tr><td>6-0</td><td>6-1</td><td>6-2</td><td rowspan="1" colspan="3">6-3</td><td style="display: none;">6-4</td><td style="display: none;">6-5</td><td>6-6</td><td>6-7</td><td>6-8</td><td>6-9</td></tr><tr><td rowspan="1" colspan="2">7-0</td><td style="display: none;">7-1</td><td rowspan="1" colspan="2">7-2</td><td style="display: none;">7-3</td><td rowspan="1" colspan="2">7-4</td><td style="display: none;">7-5</td><td>7-6</td><td>7-7</td><td>7-8</td><td>7-9</td></tr><tr><td>8-0</td><td rowspan="1" colspan="2">8-1</td><td style="display: none;">8-2</td><td>8-3</td><td rowspan="1" colspan="2">8-4</td><td style="display: none;">8-5</td><td>8-6</td><td>8-7</td><td>8-8</td><td>8-9</td></tr><tr><td>9-0</td><td>9-1</td><td rowspan="1" colspan="2">9-2</td><td style="display: none;">9-3</td><td>9-4</td><td rowspan="1" colspan="2">9-5</td><td style="display: none;">9-6</td><td>9-7</td><td>9-8</td><td>9-9</td></tr></tbody></table>`
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
    .w-e-text-container {
        height: 330px!important;
    }
</style>
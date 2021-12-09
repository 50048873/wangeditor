<template>
    <div>
        <div ref="editor">
            <div v-html="backendHTML"></div>
        </div>
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
    data () {
        return {
            backendHTML: '',
        }
    },
    /*created () {
        setTimeout(() => {
            this.backendHTML = '<table border="0" width="1882.953125px" cellpadding="0" cellspacing="0" class="tableMergeCell"><tbody><tr><th style="width: 376.4px;">0-0 <i data-col="0" contenteditable="false" class="tableMergeCell-handshank"></i></th><th style="width: 376.4px;">0-1 <i data-col="1" contenteditable="false" class="tableMergeCell-handshank"></i></th><th style="width: 376.4px;">0-2 <i data-col="2" contenteditable="false" class="tableMergeCell-handshank"></i></th><th style="width: 376.4px;">0-3 <i data-col="3" contenteditable="false" class="tableMergeCell-handshank"></i></th><th style="width: 376.4px;">0-4 <i data-col="4" contenteditable="false" class="tableMergeCell-handshank"></i></th></tr><tr><td rowspan="2" colspan="1">1-0</td><td style="background-color: rgb(240, 178, 178); text-align: center;">1-1</td><td>1-2</td><td>1-3</td><td>1-4</td></tr><tr><td style="display: none;">2-0</td><td style="background-color: rgb(240, 178, 178); text-align: center;">2-1</td><td>2-2</td><td>2-3</td><td>2-4</td></tr><tr><td>3-0</td><td>3-1</td><td>3-2</td><td>3-3</td><td>3-4</td></tr><tr><td>4-0</td><td>4-1</td><td>4-2</td><td>4-3</td><td>4-4</td></tr></tbody></table>'
        }, 3000)
    },*/
    mounted() {
        this.initEditor()
    },
    methods: {
        getHtml() {
            this.newHtml = this.editor.txt.html()
            this.$refs.newHtml.innerHTML = this.newHtml
        },
        setHtml() {
            // this.newHtml = ``
            this.editor.txt.html(this.newHtml)
        },
        initEditor() {
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

.newHtml th,
.newHtml td {
    height: 30px;
    border: 1px solid #eee;
}

.w-e-text-container {
    height: 330px !important;
}
</style>
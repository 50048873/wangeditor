<template>
    <div>
        <div ref="editor">
            <div v-html="value"></div>
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
            value: '',
        }
    },
    /*created () {
        setTimeout(() => {
            this.value = '<div></div><table border="0" width="1900px" cellpadding="0" cellspacing="0" class="tableMergeCell"><colgroup><col style="width: 380px;"><col style="width: 380px;"><col style="width: 380px;"><col style="width: 380px;"><col style="width: 380px;"></colgroup><thead><tr class="tableMergeCell-handshank-container"><th><i data-col="0" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="1" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="2" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="3" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="4" contenteditable="false" class="tableMergeCell-handshank"></i></th></tr></thead><tbody><tr><th></th><th></th><th></th><th></th><th></th></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table><table border="0" width="1880px" cellpadding="0" cellspacing="0" class="tableMergeCell"><colgroup><col style="width: 376px;"><col style="width: 376px;"><col style="width: 376px;"><col style="width: 376px;"><col style="width: 376px;"></colgroup><thead><tr class="tableMergeCell-handshank-container"><th><i data-col="0" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="1" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="2" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="3" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="4" contenteditable="false" class="tableMergeCell-handshank"></i></th></tr></thead><tbody><tr><th></th><th></th><th></th><th></th><th></th></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>'
        }, 2000)
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
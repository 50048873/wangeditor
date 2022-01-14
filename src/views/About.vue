<template>
    <div>
        <div ref="editor">
            <div v-html="value"></div>
        </div>
       <!--  <button type="button" id="btn1" @click="getHtml">获取html</button>
        <button type="button" id="btn2" @click="setHtml">设置html</button>
        <div ref="newHtml" class="newHtml"></div> -->
        <formula-pop 
            :visible.sync="visible" 
            :type='type'
            :latex="latex"
            @confirm="confirm" 
        />
        <div @click="editMath">\sqrt{2}</div>
    </div>
</template>
<script>
/* eslint-disable */
import FormulaPop from '@/components/FormulaPop2'
import E from 'wangeditor'
import { wangEditorTableExtend } from '@/assets/tool'
import { FormulaMenu } from '@/assets/wangEditorMenuExtention'
export default {
    name: 'about',
    mixins: [wangEditorTableExtend],
    components: {
        FormulaPop,
    },
    data () {
        return {
            value: '',
            visible: false,
            latex: '',
            type: 'add',
        }
    },
    /*created () {
        setTimeout(() => {
            this.value = '<table border="0" cellpadding="0" cellspacing="0" class="tableMergeCell" style="width: 1900px;"><colgroup><col style="width: 380px;"><col style="width: 380px;"><col style="width: 380px;"><col style="width: 380px;"><col style="width: 380px;"></colgroup><thead><tr class="tableMergeCell-handshank-container"><th><i data-col="0" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="1" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="2" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="3" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="4" contenteditable="false" class="tableMergeCell-handshank"></i></th></tr></thead><tbody><tr><th></th><th></th><th></th><th></th><th></th></tr><tr><td><img src="http://localhost:8080/big.jpg" alt="tu" style="max-width:100%;" contenteditable="false"></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>'
        }, 2000)
    },*/
    mounted() {
        this.initEditor()
        this.listenMenuClick()
    },
    beforeDestroy () {
        window.removeEventListener('addFormula', this.addMath, true)
    },
    methods: {
        addMath () {
            this.type = 'add'
            this.latex = ''
            this.visible = true
        },
        editMath () {
            this.type = 'edit'
            this.latex = '\\frac{1}{2}'
            this.visible = true
        },
        confirm (value) {
            let html = window.$("<span></span>").mathquill('editable').mathquill('write', value).mathquill('html')
            html = `<span contenteditable="false" class="mathquill-rendered-math">${html}</span>`
            this.editor.cmd.do('insertHTML', html)
        },
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
            const alertMenuFormulaKey = 'alertMenuFormulaKey'
            this.editor.menus.extend(alertMenuFormulaKey, FormulaMenu)
            this.editor.config.menus = this.editor.config.menus.concat(alertMenuFormulaKey)
            this.editor.config.onchangeTimeout = 200; // 修改为 500ms
            this.editor.config.zIndex = 9
            this.editor.create()
        },
        listenMenuClick () {
            window.addEventListener('addFormula', this.addMath, true)
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
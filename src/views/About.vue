<template>
    <div>
        <div ref="editor">
            <div v-html="value"></div>
        </div>

        <button type="button" id="btn1" @click="getHtml">获取html</button>
        <button type="button" id="btn2" @click="setHtml">设置html</button>
        <div ref="newHtml" class="newHtml"></div>

        <formula-pop 
            :visible.sync="visible" 
            :type='type'
            :latex="latex"
            @confirm="confirm" 
        />

        <!-- <table class="testTable">
            <tr>
                <th>公式</th>
                <th>操作</th>
            </tr>
            <tr v-for="(item, index) in latexArray" :key="index">
                <td v-html="latexToHtml(item.latex)"></td>
                <td @click="editMath(item.latex, index)">编辑</td>
            </tr>
        </table> -->
    </div>
</template>
<script>
/* eslint-disable */
import FormulaPop from '@/components/FormulaPop'
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
    created () {
        setTimeout(() => {
            this.value = `
                <table border="0" cellpadding="0" cellspacing="0" class="tableMergeCell" style="width: 1770px;"><colgroup><col style="width: 177px;"><col style="width: 177px;"><col style="width: 177px;"><col style="width: 177px;"><col style="width: 177px;"><col style="width: 177px;"><col style="width: 177px;"><col style="width: 177px;"><col style="width: 177px;"><col style="width: 177px;"></colgroup><thead><tr class="tableMergeCell-handshank-container"><th><i data-col="0" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="1" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="2" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="3" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="4" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="5" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="6" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="7" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="8" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="9" contenteditable="false" class="tableMergeCell-handshank"></i></th></tr></thead><tbody><tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th rowspan="3" colspan="1"></th><th></th></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td style="display: none;"></td><td></td></tr><tr><td></td><td rowspan="2" colspan="1" class="tableMergeCell-selected"></td><td class="tableMergeCell-selected"></td><td style="" rowspan="1" colspan="2" class="tableMergeCell-selected"></td><td style="display: none;"></td><td></td><td rowspan="3" colspan="1"></td><td></td><td style="display: none;"></td><td></td></tr><tr><td rowspan="3" colspan="1"></td><td style="display: none;" class="tableMergeCell-selected"></td><td rowspan="1" colspan="2" class="tableMergeCell-selected"></td><td style="display: none;" class="tableMergeCell-selected"></td><td style=""></td><td></td><td style="display: none;"></td><td></td><td></td><td></td></tr><tr><td style="display: none;"></td><td></td><td rowspan="1" colspan="3"></td><td style="display: none;"></td><td style="display: none;"></td><td></td><td style="display: none;"></td><td></td><td></td><td style=""></td></tr><tr><td style="display: none;"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td style=""></td><td style=""></td></tr><tr><td></td><td></td><td rowspan="2" colspan="2"></td><td id="t1" style="display: none;"></td><td></td><td></td><td style="" rowspan="1" colspan="2"></td><td style="display: none;"></td><td></td><td></td></tr><tr><td></td><td></td><td style="display: none;"></td><td style="display: none;"></td><td></td><td style=""></td><td style="" rowspan="1" colspan="2"></td><td style="display: none;"></td><td style=""></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td style=""></td><td style=""></td><td style=""></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>
            `
        }, 1000)

        // $(htmlStr).mathquill('editable').mathquill('latex')

        this.latexArray = [
            {
                latex: '\\frac{1}{2}'
            },
            {
                latex: '\\sqrt{2}'
            },
            {
                latex: '\\frac{32}{123}+x_{aa4}'
            },
            /*{
                latex: '<span class="mathquill-rendered-math" style="font-size:20px;"><span class="textarea"><textarea data-cke-editable="1" contenteditable="false"></textarea></span><span class="fraction non-leaf" mathquill-command-id="4"><span class="numerator" mathquill-block-id="5"><span mathquill-command-id="11">3</span><span mathquill-command-id="12">2</span></span><span class="denominator" mathquill-block-id="6"><span mathquill-command-id="8">1</span><span mathquill-command-id="9">2</span><span mathquill-command-id="10">3</span></span><span style="display:inline-block;width:0">&nbsp;</span></span><span mathquill-command-id="13" class="binary-operator">+</span><var mathquill-command-id="14">x</var><sub class="non-leaf" mathquill-command-id="16" mathquill-block-id="17"><var mathquill-command-id="19">a</var><var mathquill-command-id="20">a</var><span mathquill-command-id="21">4</span></sub></span><span>&nbsp;</span>​'
            }*/
        ]
    },
    mounted() {
        this.initEditor()
        this.listenMenuClick()
    },
    beforeDestroy () {
        window.removeEventListener('addFormula', this.addMath, true)
    },
    methods: {
        latexToHtml (latex) {
            const html = window.$ && window.$("<span></span>").mathquill('editable').mathquill('write', latex).mathquill('html')
            return `<span class="mathquill-rendered-math">${html}</span>`
        },
        addMath () {
            this.type = 'add'
            this.latex = ''
            this.visible = true
        },
        editMath (str, index) {
            this.type = 'edit'
            this.latex = str
            this.currentIndex = index
            this.visible = true
        },
        confirm (latex) {
            if (this.type === 'add') {
                console.log('add')
                let html = window.$("<span></span>").mathquill('editable').mathquill('write', latex).mathquill('html')
                html = `<span contenteditable="false" class="mathquill-rendered-math">${html}</span>`
                let range = this.editor.selection.getRange()
                range.insertNode($(html).get(0))
                range.collapse()
                this.latexArray.push({
                    latex
                })
            } else if (this.type === 'edit') {
                console.log('edit')
                this.latexArray[this.currentIndex].latex = latex
            }
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
            if (!window.editor) {
                window.editor = this.editor
            }
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
<style lang="less">
.newHtml {
    border-collapse: collapse;
}

.newHtml th,
.newHtml td {
    height: 30px;
    border: 1px solid #eee;
}

.w-e-text-container {
    height: 530px !important;
}

#btn1 {
    margin-top: 15px;
}

.testTable {
    position: absolute;
    right: 15px;
    width: 200px;
    th, td {
        border: 1px solid;
        padding: 5px 10px;
    }
}
</style>
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
import { wangEditorTableExtend } from '@/assets/mixin'
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
                <table border="0" cellpadding="0" cellspacing="0" class="tableMergeCell" style="width: 1320px;"><colgroup><col style="width: 88px;"><col style="width: 88px;"><col style="width: 88px;"><col style="width: 88px;"><col style="width: 88px;"><col style="width: 88px;"><col style="width: 88px;"><col style="width: 88px;"><col style="width: 88px;"><col style="width: 88px;"><col style="width: 88px;"><col style="width: 88px;"><col style="width: 88px;"><col style="width: 88px;"><col style="width: 88px;"></colgroup><thead><tr class="tableMergeCell-handshank-container"><th><i data-col="0" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="1" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="2" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="3" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="4" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="5" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="6" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="7" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="8" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="9" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="10" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="11" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="12" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="13" contenteditable="false" class="tableMergeCell-handshank"></i></th><th><i data-col="14" contenteditable="false" class="tableMergeCell-handshank"></i></th></tr></thead><tbody><tr><td>0-0</td><td>0-1</td><td>0-2</td><td>0-3</td><td>0-4</td><td>0-5</td><td>0-6</td><td>0-7</td><td>0-8</td><td>0-9</td><td>0-10</td><td>0-11</td><td>0-12</td><td>0-13</td><td>0-14</td></tr><tr><td>1-0</td><td rowspan="2" colspan="2">1-1</td><td style="display: none;">1-2</td><td>1-3</td><td>1-4</td><td>1-5</td><td>1-6</td><td>1-7</td><td>1-8</td><td>1-9</td><td>1-10</td><td>1-11</td><td>1-12</td><td>1-13</td><td>1-14</td></tr><tr><td>2-0</td><td style="display: none;">2-1</td><td style="display: none;">2-2</td><td>2-3</td><td>2-4</td><td>2-5</td><td>2-6</td><td>2-7</td><td>2-8</td><td>2-9</td><td>2-10</td><td>2-11</td><td>2-12</td><td>2-13</td><td>2-14</td></tr><tr><td>3-0</td><td>3-1</td><td rowspan="2" colspan="1">3-2</td><td rowspan="1" colspan="2">3-3</td><td style="display: none;">3-4</td><td>3-5</td><td>3-6</td><td>3-7</td><td>3-8</td><td>3-9</td><td>3-10</td><td>3-11</td><td>3-12</td><td>3-13</td><td>3-14</td></tr><tr><td>4-0</td><td>4-1</td><td style="display: none;">4-2</td><td rowspan="2" colspan="1" style="background-color: rgb(240, 163, 163); text-align: center;">4-3</td><td style="background-color: rgb(240, 163, 163); text-align: center;">4-4</td><td class="tableMergeCell-selected"></td><td>4-4</td><td></td><td>4-4</td><td>4-9</td><td>4-10</td><td>4-11</td><td>4-12</td><td>4-13</td><td>4-14</td></tr><tr><td>5-0</td><td>5-1</td><td>5-2</td><td style="display: none; background-color: rgb(240, 163, 163); text-align: center;">5-3</td><td style="background-color: rgb(240, 163, 163); text-align: center;">5-4</td><td></td><td>5-4</td><td></td><td>5-4</td><td>5-9</td><td>5-10</td><td>5-11</td><td>5-12</td><td>5-13</td><td>5-14</td></tr><tr><td>6-0</td><td>6-1</td><td>6-2</td><td></td><td>4-4</td><td></td><td>6-6</td><td>6-7</td><td>6-8</td><td>6-9</td><td>6-10</td><td>6-11</td><td>6-12</td><td>6-13</td><td>6-14</td></tr><tr><td>7-0</td><td>7-1</td><td>7-2</td><td></td><td>5-4</td><td></td><td>7-6</td><td>7-7</td><td>7-8</td><td>7-9</td><td>7-10</td><td>7-11</td><td>7-12</td><td>7-13</td><td>7-14</td></tr><tr><td>8-0</td><td>8-1</td><td>8-2</td><td></td><td></td><td></td><td>8-6</td><td>8-7</td><td>8-8</td><td>8-9</td><td>8-10</td><td>8-11</td><td>8-12</td><td>8-13</td><td>8-14</td></tr><tr><td>9-0</td><td>9-1</td><td>9-2</td><td>9-3</td><td>9-4</td><td>9-5</td><td>9-6</td><td>9-7</td><td>9-8</td><td>9-9</td><td>9-10</td><td>9-11</td><td>9-12</td><td>9-13</td><td>9-14</td></tr><tr><td>10-0</td><td>10-1</td><td>10-2</td><td>10-3</td><td>10-4</td><td>10-5</td><td>10-6</td><td>10-7</td><td>10-8</td><td>10-9</td><td>10-10</td><td>10-11</td><td>10-12</td><td>10-13</td><td>10-14</td></tr><tr><td>11-0</td><td>11-1</td><td>11-2</td><td>11-3</td><td>11-4</td><td>11-5</td><td>11-6</td><td>11-7</td><td>11-8</td><td>11-9</td><td>11-10</td><td>11-11</td><td>11-12</td><td>11-13</td><td>11-14</td></tr><tr><td>12-0</td><td>12-1</td><td>12-2</td><td>12-3</td><td>12-4</td><td>12-5</td><td>12-6</td><td>12-7</td><td>12-8</td><td>12-9</td><td>12-10</td><td>12-11</td><td>12-12</td><td>12-13</td><td>12-14</td></tr><tr><td>13-0</td><td>13-1</td><td>13-2</td><td>13-3</td><td>13-4</td><td>13-5</td><td>13-6</td><td>13-7</td><td>13-8</td><td>13-9</td><td>13-10</td><td>13-11</td><td>13-12</td><td>13-13</td><td>13-14</td></tr><tr><td>14-0</td><td>14-1</td><td>14-2</td><td>14-3</td><td>14-4</td><td>14-5</td><td>14-6</td><td>14-7</td><td>14-8</td><td>14-9</td><td>14-10</td><td>14-11</td><td>14-12</td><td>14-13</td><td>14-14</td></tr></tbody></table>
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
<template>
    <div>
      <div ref="editor">
          <!--hot-table :settings="hotSettings" /-->
      </div>
      <button type="button" id="btn1">获取html</button>
      <button type="button" id="btn2">设置html</button>
      <div ref="html"></div>
    </div>
</template>

<script>
/* eslint-disable */
import E from 'wangeditor'
import { HotTable } from '@handsontable/vue'
import Handsontable from 'handsontable'
import 'handsontable/dist/handsontable.full.css'
let ele = null
export default {
  name: 'home',
  components: {
    HotTable
  },
  data () {
    return {
        hotSettings: {
            data: Handsontable.helper.createSpreadsheetData(5, 5),
            colHeaders: true,
            // rowHeaders: true,
            height: 'auto',
            contextMenu: true,
            mergeCells: [],
            manualRowResize: true,
            manualColumnResize: true,
            manualColumnMove: true,
            manualRowMove: true,
            licenseKey: 'non-commercial-and-evaluation'
        }
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
        const {BtnMenu} = E
        const editor = new E(this.$refs.editor)

        class AlertMenu extends BtnMenu {
            constructor(editor) {
                const $elem = E.$(
                    `
                        <div class="w-e-menu" data-title="新增表格">
                            <a href="javascript:void(0);" class="combg">表格</a>
                        </div>
                    `
                )
                super($elem, editor)
            }
            clickHandler () {
                ele = document.createElement('div')
                ele.setAttribute('id', 'example')
                console.log(ele)
                // const t = document.querySelector('.handsontable')
                // t.removeEventListener('mousedown')
                // t.removeEventListener('mousemove')
                // t.removeEventListener('mouseup')
                // console.log(t)
                editor.txt.html(ele.outerHTML)

                const container = document.getElementById('example');
                const hot = new Handsontable(container, {
                    data: Handsontable.helper.createSpreadsheetData(5, 5),
                    colHeaders: true,
                    height: 'auto',
                    contextMenu: true,
                    mergeCells: [],
                    manualRowResize: true,
                    manualColumnResize: true,
                    manualColumnMove: true,
                    manualRowMove: true,
                    licenseKey: 'non-commercial-and-evaluation'
                });
            }
            tryChangeActive () {
                this.active()
            }
        }

        editor.config.menus = [
            'head',
            'bold',
            'fontSize',
            'fontName',
            'italic',
            'underline',
            'strikeThrough',
            'indent',
            'lineHeight',
            'foreColor',
            'backColor',
            'link',
            'list',
            'todo',
            'justify',
            'quote',
            'emoticon',
            'image',
            'video',
            'table',
            'code',
            'splitLine',
            'undo',
            'redo',
        ]

        const menuKey = 'alertMenuKey'
        editor.menus.extend(menuKey, AlertMenu)
        editor.config.menus = editor.config.menus.concat(menuKey)

        editor.config.onchange = function(newHtml) {
            // console.log("change 之后最新的 html", newHtml);
        };
        editor.config.onchangeTimeout = 200; // 修改为 500ms
        editor.create()

        const getHtml = () => {
            const html = editor.txt.html()
            console.log(html)
            this.$refs.html.innerHTML = html
        }
        const setHtml = () => {
            const html = editor.txt.html()
            editor.txt.html(html)
        }
        const btn1 = document.querySelector('#btn1')
        const btn2 = document.querySelector('#btn2')
        // console.log(btn1)
        btn1.addEventListener('click', getHtml, false)
        btn2.addEventListener('click', setHtml, false)
    }
  }
}
</script>

<style>
    .htContextMenu {
        z-index: 10609!important;
    }
</style>

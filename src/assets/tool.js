/* eslint-disable */
import TableMergeCell from '@/assets/tableMergeCell/tableMergeCell'
import '@/assets/tableMergeCell/tableMergeCell.less'
import ColumnResizer from '@/assets/columnResizer/columnResizer'
import '@/assets/columnResizer/columnResizer.less'

export const wangEditorTableExtend = {
    mounted() {
        this.$nextTick(() => {
            this.addInsertTableIconlistener()
            
            window.addEventListener('keydown', this.tableObserve, true)
            this.textElem = window.editor.$textElem.elems[0]
            this.textElem.addEventListener('paste', this.pasteTable, true)
            window.addEventListener('copy', this.copy, false)
            window.addEventListener('mousedown', this.mousedown, true)
        })
    },
    watch: {
        value(newVal) {
            if (newVal) {
                if (!/<table.*><\/table>/gs.test(newVal)) return
                this.$nextTick(() => {
                    this.initTableInteraction()
                })
            }
        }
    },
    methods: {
        copy () {
            const selectionStr = window.getSelection().toString()
            if (selectionStr) {
                console.log('监听整个表格复制命令（document.execCommand()），清空拷贝的单元格数据')
                TableMergeCell.copyedCellsArray = []
            }
        },
        mousedown (e) {
            const {target} = e
            if (this.$refs.editor && !this.$refs.editor.contains(target)) {
                this.removeTableActiveCls()
            }
        },
        removeTableActiveCls () {
            const activeEles = document.querySelectorAll('.tableMergeCell_active')
            if (activeEles) {
                activeEles.forEach(ele => {
                    ele.classList.remove('tableMergeCell_active')
                })
            }
        },
        pasteTable (e) {
            const clipboardData = e.clipboardData || window.clipboardData
            const textPlain = clipboardData.getData('text')
            const textHtml = clipboardData.getData('text/html')
            console.log('textElem listen pasteTable event', textPlain.length, textPlain === ' ')
            const getImageItem = (clipboardData) => {
                /*
                 * 图片： types: ['text/html', 'image/png']
                 * 表格： type: ['text/plain', 'text/html', 'text/rtf', 'Files']
                */
                const {items, types} = clipboardData
                let item = null
                console.log(items, types)
                for (let i = 0; i < types.length; i++) {
                    if (types[i] === 'Files') {
                        item = items[i]
                        break
                    }
                }
                return item
            }
            const item = getImageItem(clipboardData)
            const isPasteImg = item && item.kind === 'file' && item.type.match(/^image\//i) && !textHtml.includes('<table') && !textHtml.includes('</table>')
            
            if (textPlain === ' ') {
                console.log('粘贴整个表格')
                e.stopPropagation()
                e.preventDefault()
                const tableMergeCell_active = window.localStorage.getItem('tableMergeCell_active') || ''
                if (!tableMergeCell_active.includes('tableMergeCell_active')) return
                const tempDiv = document.createElement('div')
                tempDiv.insertAdjacentHTML('beforeend', tableMergeCell_active)
                const table = tempDiv.firstElementChild

                const selection = window.getSelection()
                if (!selection.rangeCount) return false
                const range = selection.getRangeAt(0)
                range.insertNode(table)
                this.removeTableActiveCls()
                selection.collapseToEnd()

                const getParentP = (target) => {
                    while (target.tagName !== 'P' && target.parentNode) {
                        target = target.parentNode
                    }
                    return target
                }
                const p = getParentP(table)
                if (!p || p.tagName !== 'P') return
                p.insertAdjacentElement('afterend', table)
            } else if (isPasteImg) {
                e.stopPropagation()
                console.log(item)
            }
        },

        initTableInteraction() {
            if (!this.$refs.editor) {
                throw new Error('请为wangEditor富文本容器元素提供ref="editor"属性')
            }
            const tableIsInTable = (target) => {
                while (target && target.parentNode && target.parentNode.tagName !== 'TABLE') {
                    target = target.parentNode
                }
                return target.parentNode
            }
            this.tables = this.$refs.editor.querySelectorAll('.w-e-text table')
            this.tables.forEach(table => {
                if (!tableIsInTable(table)) {
                    if (!table.tableMergeCellInstance) {
                        table.tableMergeCellInstance = new TableMergeCell(table, {
                            onAddCol: (index) => {
                                table.tableColumnResizerInstance.handleAddCol(index)
                            },
                            onDelCol: (index) => {
                                table.tableColumnResizerInstance.handleDelCol(index)
                            },
                        })
                    }
                    if (!table.tableColumnResizerInstance) {
                        table.tableColumnResizerInstance = new ColumnResizer(table)
                    }
                }
            })
        },
        addInsertTextListener() {
            this.insertText = this.iconTable.querySelector('button.right')
            this.insertText && this.insertText.addEventListener('click', this.initTableInteraction, false)
        },
        removeHandshank() {
            const tableMergeCellHandshank = document.querySelector('.tableMergeCell-subline')
            if (tableMergeCellHandshank && tableMergeCellHandshank.classList) {
                tableMergeCellHandshank.classList.remove('tableMergeCell-handshank-hover', 'tableMergeCell-subline')
            }
        },
        addInsertTableIconlistener() {
            this.iconTable = document.querySelector(".w-e-menu[data-title='表格']")
            this.iconUndo = document.querySelector(".w-e-menu[data-title='撤销']")
            this.iconTable && this.iconTable.addEventListener('click', this.addInsertTextListener, false)
            this.iconUndo && this.iconUndo.addEventListener('click', this.removeHandshank, false)
        },
        // 点击插入表格，输入回车键时
        tableObserve() {
            const callback = (mutationsList) => {
                for (const mutation of mutationsList) {
                    const { target, addedNodes } = mutation
                    const [addedNode] = addedNodes
                    if (target.className.includes('w-e-text') && addedNode && addedNode.tagName === 'TABLE') {
                        this.initTableInteraction()
                    }
                }
            }
            const observer = new MutationObserver(callback)
            const ele = this.$refs.editor.querySelector('.w-e-text[contenteditable="true"]')
            observer.observe(ele, {
                childList: true,
                subtree: true,
            })
        },
    },
    beforeDestroy() {
        this.tables && this.tables.forEach(table => {
            if (table.tableMergeCellInstance) {
                table.tableMergeCellInstance.destroy()
                table.tableMergeCellInstance = null
            }
            if (table.tableColumnResizerInstance) {
                table.tableColumnResizerInstance.destroy()
                table.tableColumnResizerInstance = null
            }
        })
        this.tables = null

        if (this.iconTable) {
            this.iconTable.removeEventListener('click', this.addInsertTextListener, false)
        }
        if (this.insertText) {
            this.insertText.removeEventListener('click', this.initTableInteraction, false)
        }
        window.removeEventListener('keydown', this.tableObserve, true)
        this.textElem.removeEventListener('paste', this.pasteTable, true)
        window.removeEventListener('copy', this.copy, false)
        window.removeEventListener('mousedown', this.mousedown, true)
    },
}

const handleKnowledgeContent = (str) => {
    return str.replace(/(<table.*?>)/gs, '<div class="tableMergeCell-tempContainer">$1').replace(/(<\/table>)/g, '$1</div>')
}

export const handleData_getKnowledgePageByActPackId = (res) => {
    if (!res) return res
    const { state, data } = res
    if (state === 200 && data) {
        const { rows } = data
        if (!Array.isArray(rows)) return res
        const len1 = rows.length
        for (let i = 0; i < len1; i++) {
            const row = rows[i]
            const { subActivityPackageKnowledgeDirVos } = row
            if (!Array.isArray(subActivityPackageKnowledgeDirVos)) continue
            const len2 = subActivityPackageKnowledgeDirVos.length
            for (let j = 0; j < len2; j++) {
                const level2Data = subActivityPackageKnowledgeDirVos[j]
                if (!level2Data) continue
                const { knowledgeVo } = level2Data
                if (!knowledgeVo) continue
                const { knowledgeContent } = knowledgeVo
                if (knowledgeContent) {
                    knowledgeVo.knowledgeContent = handleKnowledgeContent(knowledgeContent)
                }
            }
        }
    }
    return res
}

export const handleData_getKnowledgeById = (res) => {
    if (!res) return res
    const { state, data } = res
    if (state === 200 && data) {
        const { knowledgeContent } = data
        if (knowledgeContent) {
            data.knowledgeContent = handleKnowledgeContent(knowledgeContent)
        }
    }
    return res
}

export const handleData_showList = (res) => {
    if (!res) return res
    const { code, rows } = res
    if (code === 200) {
        if (!Array.isArray(rows)) return res
        const len1 = rows.length
        for (let i = 0; i < len1; i++) {
            const row = rows[i]
            const { logContent } = row
            if (logContent) {
                row.logContent = handleKnowledgeContent(logContent)
            }
        }
    }
    return res
}

export const handleData_taskDetail = (res) => {
    if (!res) return res
    const { state, data } = res
    if (state === 200 && data) {
        const { knowledgeList } = data
        if (Array.isArray(knowledgeList)) {
            const len = knowledgeList.length
            for (let i = 0; i < len; i++) {
                const item = knowledgeList[i]
                const { name } = item
                if (name) {
                    item.name = handleKnowledgeContent(name)
                }
            }
        }
    }
    return res
}
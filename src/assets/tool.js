/* eslint-disable */
import TableMergeCell from '@/assets/tableMergeCell/tableMergeCell'
import '@/assets/tableMergeCell/tableMergeCell.less'
import ColumnResizer from '@/assets/columnResizer/columnResizer'
import '@/assets/columnResizer/columnResizer.less'

export const wangEditorTableExtend = {
    mounted() {
        this.$nextTick(() => {
            this.addInsertTableIconlistener()
            this.addPasteTableListener()
            window.addEventListener('keydown', this.tableObserve, true)

            window.addEventListener('paste', this.pasteTable, false)
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
            e.preventDefault()

            const pasteText = (e.clipboardData || window.clipboardData).getData('text')
            console.log(pasteText === ' ', pasteText, pasteText.length)
            
            const tableMergeCell_active = window.localStorage.getItem('tableMergeCell_active')
            if (!tableMergeCell_active.includes('tableMergeCell_active')) return
            const tempDiv = document.createElement('div')
            tempDiv.insertAdjacentHTML('beforeend', tableMergeCell_active)
            const table = tempDiv.firstElementChild

            const selection = window.getSelection()
            if (!selection.rangeCount) return false
            const range = selection.getRangeAt(0)
            if (pasteText === ' ') {
                range.insertNode(table)
                this.removeTableActiveCls()
                selection.collapseToEnd()
            }
            const getParentP = (target) => {
                while (target.tagName !== 'P' && target.parentNode) {
                    target = target.parentNode
                }
                return target
            }
            const p = getParentP(table)
            if (!p || p.tagName !== 'P') return
            p.insertAdjacentElement('afterend', table)
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
        addInsertTableIconlistener() {
            this.iconTable = document.querySelector(".w-e-menu[data-title='表格']")
            this.iconTable && this.iconTable.addEventListener('click', this.addInsertTextListener, false)
        },
        handlePaste(event) {
            const pasteData = (event.clipboardData || window.clipboardData).getData('text/html')
            if (pasteData && pasteData.includes('<table')) {
                this.initTableInteraction()
            }
        },
        addPasteTableListener() {
            this.$refs.editor.addEventListener('paste', this.handlePaste, false)
        },
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
        if (this.$refs.editor) {
            this.$refs.editor.removeEventListener('paste', this.handlePaste, false)
        }
        window.removeEventListener('keydown', this.tableObserve, true)
        window.removeEventListener('paste', this.pasteTable, false)
        window.removeEventListener('mousedown', this.removeTableActiveCls, true)
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
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
        })
    },
    /*updated() {
        this.$nextTick(() => {
            this.initTableInteraction()
        })
    },*/
    watch: {
        value (newVal) {
            if (newVal) {
                if (!/<table.*><\/table>/gs.test(newVal)) return
                this.$nextTick(() => {
                    this.initTableInteraction()
                })
            }
        }
    },
    methods: {
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
    },
}

export const handleBackendKnowledgeContentData = (res) => {
    if (!res) return res
    const {state, data} = res
    if (state === 200 && data) {
        const {rows} = data
        if (!Array.isArray(rows)) return res
        const len1 = rows.length
        for (let i = 0; i < len1; i++) {
            const row = rows[i]
            const {subActivityPackageKnowledgeDirVos} = row
            if (!Array.isArray(subActivityPackageKnowledgeDirVos)) continue
            const len2 = subActivityPackageKnowledgeDirVos.length
            for (let j = 0; j < len2; j++) {
                const level2Data = subActivityPackageKnowledgeDirVos[j]
                if (!level2Data) continue
                const {knowledgeVo} = level2Data
                if (!knowledgeVo) continue
                const {knowledgeContent} = knowledgeVo
                knowledgeVo.knowledgeContent = knowledgeContent.replace(/(<table.*?>)/gs, '<div class="tableMergeCell-tempContainer">$1').replace(/(<\/table>)/g, '$1</div>')
            }
        }
    }
    return res
}
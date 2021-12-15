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
    updated() {
        this.$nextTick(() => {
            this.initTableInteraction()
        })
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
                            onAddCol: () => {
                                table.columnResizer.reset()
                            },
                        })
                    }
                    if (!table.tableColumnResizerInstance) {
                        table.tableColumnResizerInstance = new ColumnResizer(table)
                    }
                }
            })
        },
        addInsertTextListener(e) {
            this.insertText = this.iconTable.querySelector('button.right')
            this.insertText && this.insertText.addEventListener('click', this.initTableInteraction, false)
        },
        addInsertTableIconlistener() {
            this.iconTable = this.$refs.editor.querySelector("[data-title='表格']")
            this.iconTable && this.iconTable.addEventListener('click', this.addInsertTextListener, false)
        },
        addPasteTableListener() {
            this.$refs.editor.addEventListener('paste', (e) => {
                const pasteData = (event.clipboardData || window.clipboardData).getData('text/html')
                if (pasteData && pasteData.includes('<table')) {
                    this.initTableInteraction()
                }
            }, false)
        },
    },
    beforeDestroy() {
        this.tables && this.tables.forEach(table => {
            if (table.tableMergeCellInstance) {
                table.tableMergeCellInstance.destroy()
            }
            if (table.tableColumnResizerInstance) {
                table.tableColumnResizerInstance.destroy()
            }
        })
        this.tables = null

        if (this.iconTable) {
            this.iconTable.removeEventListener('click', this.addInsertTextListener, false)
        }
        if (this.insertText) {
            this.insertText.removeEventListener('click', this.initTableInteraction, false)
        }
    },
}

export const handleTable = (table) => {
    console.log(table)
    const wrap = document.createElement('div')
    wrap.innerHTML = table.outerHTML
    wrap.style.overflowX = 'auto'
    const parentWrap = table.parentNode
    parentWrap.replaceChild(wrap, table)
}

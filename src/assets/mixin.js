/* eslint-disable */
import TableMergeCell from './tableMergeCell/tableMergeCell'
import ColumnResizer from './columnResizer/columnResizer'

import {
    handleOfficeTable,
    handleTh,
    removeTableActiveCls,
    getAddedTable,
    getAddedImg,
} from './tool'

export const wangEditorTableExtend = {
    mounted() {
        this.$nextTick(() => {
            this.textElem = this.editor.$textElem.elems[0]
            this.textElem.addEventListener('paste', this.pasteTable, true)
            this.tableObserve()
        })
    },
    methods: {
        pasteTable (e) {
            const clipboardData = e.clipboardData || window.clipboardData
            const textPlain = clipboardData.getData('text')
            const textHtml = clipboardData.getData('text/html')
            
            const getImageItem = (clipboardData) => {
                /*
                 * 图片types: ['text/html', 'Files']
                 * 图片DataTransferItem： {kind: 'file', type: 'image/png'}
                 * 表格types： 
                 * ppt: ['text/html', 'Files']
                 * excel: ['text/plain', 'text/html', 'text/rtf', 'Files']
                 * word: ['text/plain', 'text/html', 'text/rtf']
                */
                const {items, types} = clipboardData
                let item = null
                for (let i = 0; i < types.length; i++) {
                    if (types[i] === 'Files') {
                        item = items[i]
                        break
                    }
                }
                return item
            }

            const officeXmlns = 'xmlns="http://www.w3.org/TR/REC-html40'
            const isExcel = textHtml && textHtml.includes(officeXmlns) && textHtml.includes('office:excel')
            const isWord = textHtml && textHtml.includes(officeXmlns) && textHtml.includes('office:word')
            const isPpt = textHtml && textHtml.includes(officeXmlns) && !textHtml.includes('office:excel') && !textHtml.includes('office:word')

            const imageItem = getImageItem(clipboardData)
            const isPasteImg = imageItem && imageItem.kind === 'file' && imageItem.type.match(/^image\//i) && !isExcel && !isWord && !isPpt
            
            if (textPlain === ' ') {
                // console.log('粘贴整个表格')
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
                removeTableActiveCls()
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
                // console.log('paste image', imageItem)
                /*const s = navigator.userAgent
                const m = s.match(/Chrome\/(\d+)/)
                if (m) {
                    const version = m[1] * 1
                    if (version === 96) {
                        e.stopPropagation()
                    }
                }*/ 
            } else if (isPpt) {
                // console.log('from ppt')
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
        tableObserve() {
            const callback = (mutationsList) => {
                for (const mutation of mutationsList) {
                    const { addedNodes } = mutation
                    if (!addedNodes.length) continue
                    const table = getAddedTable(mutation)
                    const imgSrc = getAddedImg(mutation)
                    if (table) {
                        handleOfficeTable(table)
                        handleTh(table)
                        this.initTableInteraction()
                    } 
                    if (imgSrc) {
                        const img = this.textElem.querySelector(`[src="${imgSrc}"]`)
                        img && img.remove()
                    }
                }
            }
            this.observer = new MutationObserver(callback)
            this.observer.observe(this.textElem, {
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
        this.textElem.removeEventListener('paste', this.pasteTable, true)
        this.observer && this.observer.disconnect()
    },
}
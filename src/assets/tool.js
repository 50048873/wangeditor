import TableMergeCell from '@/assets/tableMergeCell/tableMergeCell'
import '@/assets/tableMergeCell/tableMergeCell.less'
import ColumnResizer from '@/assets/columnResizer/columnResizer'
import '@/assets/columnResizer/columnResizer.less'

export const wangEditorTableExtend = {
    mounted () {
        this.$nextTick(() => {
            this.tableObserve()
        })
    },
    methods: {
        initTableInteraction () {
            if (!this.$refs.editor) return
            this.tables = this.$refs.editor.querySelectorAll('.w-e-text > table')
            this.tables.forEach(table => {
                table.tableMergeCellInstance = new TableMergeCell(table, {
                    onAddCol: () => {
                        table.columnResizer.reset()
                    },
                })
                table.tableColumnResizerInstance = new ColumnResizer(table, {
                    // resizeMode: 'overflow',
                })
            })
        },
        tableObserve () {
            const callback = (mutationsList) => {
                for (const mutation of mutationsList) {
                    const {target, addedNodes} = mutation
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
    beforeDestroy () {
      this.tables && this.tables.forEach(table => {
          table.tableMergeCellInstance.destroy()
          table.tableColumnResizerInstance.destroy()
      })
      this.tables = null
    },
}
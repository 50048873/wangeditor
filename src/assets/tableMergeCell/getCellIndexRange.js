getCellIndexRange () {
    console.log(this.cellEnd)
    const {rows} = this
    let indexEnd_row = this.indexEnd.row
    const indexEnd_col = this.indexEnd.col
    let totalRow = 0
    for (let i = this.indexStart.row; i <= indexEnd_row; i++) {
        // console.log(i)
        const tr = rows[i]
        const {children} = tr
        const childLen = children.length
        let rowspanArray = []
        for (let j = this.indexStart.col; j <= indexEnd_col; j++) {
            const cell = children[j]
            const {rowspan} = this.getCellSpanProperty(cell)
            rowspanArray.push(rowspan)
        } 
        const maxRowspan = Math.max(...rowspanArray)
        // totalRow = maxRowspan > 1 ? (i + (maxRowspan - 1)) : i
        totalRow = i + (maxRowspan - 1)
        if (totalRow > indexEnd_row) {
            indexEnd_row = totalRow
        }
    }
    console.log(totalRow)
}
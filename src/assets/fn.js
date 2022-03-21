/* eslint-disable */
const _getPreTrCellInfo = (rows, i, j) => {
    if (!rows) {
        throw new Error('请传入行')
    }
    if (typeof i !== 'number' || typeof j !== 'number') {
        throw new Error('请传入行和列索引')
    }
    if (i > 0) {
        let m = i - 1
        let preTrCell = rows[m].children[j]
        while (m > 0 && preTrCell && preTrCell.style.display === 'none') {
            m--
            preTrCell = rows[m].children[j]
        }
        return {
            preTrCell,
            preTrIndex: m,
        }
    }
}

const _getPreCellInfo = (cell, j) => {
    if (!cell) {
        throw new Error('请传入单元格')
    }
    if (typeof j !== 'number') {
        throw new Error('请传入列索引')
    }
    if (!cell.previousElementSibling) {
        return {
            preCell: cell,
            preCellIndexRight: j,
        }
    }
    let preCell = cell.previousElementSibling
    let k = j - 1
    while (k > 0 && preCell && preCell.style.display === 'none') {
        preCell = preCell.previousElementSibling
        k--
    }
    if (preCell) {
        const {colspan} = getCellSpanProperty(preCell)
        k = k + (colspan - 1)
    } 
    return {
        preCell,
        preCellIndexRight: k,
    }
}

const _getRowStart = (rows, cell, i, j) => {
    let i2 = i - 1
    for (; i2 >= 0; i2--) {
        const {children} = rows[i2]
        const len = children.length
        for (let m = 0; m < len; m++) {
            const cell2 = children[m]
            const {rowspan, colspan} = getCellSpanProperty(cell2)
            const indexR = i2 + rowspan - 1
            const indexC = m + colspan - 1
            if (rowspan > 1 && indexR >= i && m <= j && indexC >= j) {
                return i2
            }
        }
    }
    return i
}

const _getColStart = (rows, cell, i, j) => {
    const {children} = rows[i]
    const len = children.length
    for (let m = 0; m < len; m++) {
        const cell2 = children[m]
        const {colspan} = getCellSpanProperty(cell2)
        const indexC = m + colspan - 1
        if (colspan > 1 && indexC >= j && m <= j) {
            return m
        }
    }
    return j
}

export const getCellSpanProperty = function (cell) {
    if (!cell) {
        return {
            rowspan: 1,
            colspan: 1,
        }
    }
    let rowspan = cell.getAttribute('rowspan')
    let colspan = cell.getAttribute('colspan')
    rowspan = rowspan ? rowspan * 1 : 1
    colspan = colspan ? colspan * 1 : 1
    return {
        rowspan,
        colspan,
    }
}

export const getRowStart = (function fn (rows, rowStart, rowEnd, colStart, colEnd) {
    if (rowStart === 0) return rowStart
    const {children} = rows[rowStart]
    for (let j = colStart; j <= colEnd; j++) {
        const cell = children[j]
        if (cell.style.display === 'none') {
            const _rowStart = _getRowStart(rows, cell, rowStart, j)
            if (_rowStart < rowStart) {
                rowStart = _rowStart
                return fn(rows, rowStart, rowEnd, colStart, colEnd)
            }
        }
    } 
    return rowStart
})

export const getRowEnd = (function fn (rows, rowStart, rowEnd, colStart, colEnd) {
    if (rowEnd === rows.length - 1) return rowEnd
    const {children} = rows[rowEnd]
    for (let j = colStart; j <= colEnd; j++) {
        const cell = children[j]
        const {rowspan} = getCellSpanProperty(cell)
        if (rowspan > 1) {
            rowEnd += rowspan - 1
            return fn(rows, rowStart, rowEnd, colStart, colEnd)
        } else if (rowEnd > 0 && cell.style.display === 'none') {
            const {preTrCell, preTrIndex} = _getPreTrCellInfo(rows, rowEnd, j)
            const {rowspan: preTrRowspan} = getCellSpanProperty(preTrCell)
            if (preTrRowspan > 1) { 
                const _rowEnd = preTrIndex + preTrRowspan - 1
                if (_rowEnd > rowEnd) {
                    rowEnd = _rowEnd
                    return fn(rows, rowStart, rowEnd, colStart, colEnd)
                }
            }
        }
    } 
    return rowEnd
})

export const getColStart = (function fn (rows, rowStart, rowEnd, colStart, colEnd) {
    if (colStart === 0) return colStart
    for (let i = rowStart; i <= rowEnd; i++) {
        const tr = rows[i]
        const {children} = tr
        const cell = children[colStart]
        if (cell.style.display === 'none') {
            const _colStart = _getColStart(rows, cell, i, colStart)
            if (_colStart < colStart) {
                colStart = _colStart
                return fn(rows, rowStart, rowEnd, colStart, colEnd)
            }
        } 
    }
    return colStart
})

export const getColEnd = (function fn (rows, rowStart, rowEnd, colStart, colEnd) {
    if (colEnd === rows[0].length) return colEnd
    for (let i = rowStart; i <= rowEnd; i++) {
        const tr = rows[i]
        const {children} = tr
        const cell = children[colEnd]
        const {colspan} = getCellSpanProperty(cell)
        if (colspan > 1) {
            colEnd += colspan - 1
            return fn(rows, rowStart, rowEnd, colStart, colEnd)
        } else if (cell.style.display === 'none') {
            const {preCell, preCellIndexRight} = _getPreCellInfo(cell, colEnd)
            const {colspan: preColspan} = getCellSpanProperty(preCell)
            if (preColspan > 1 && colEnd < preCellIndexRight) {
                colEnd = preCellIndexRight
                return fn(rows, rowStart, rowEnd, colStart, colEnd)
            } 
        } 
    }
    return colEnd
})

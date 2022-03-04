/* eslint-disable */
export const getCellSpanProperty = function (cell) {
    // console.log(cell)
    let rowspan = cell.getAttribute('rowspan')
    let colspan = cell.getAttribute('colspan')
    rowspan = rowspan ? rowspan * 1 : 1
    colspan = colspan ? colspan * 1 : 1
    return {
        rowspan,
        colspan,
    }
}

export const getIndexEnd = (function fn (rows, rowStart, rowEnd, colStart, colEnd) {
    for (let i = rowStart; i <= rowEnd; i++) {
        const tr = rows[i]
        const {children} = tr
        for (let j = colStart; j <= colEnd; j++) {
            const cell = children[j]
            // console.log(i, j, cell)
            const {rowspan, colspan} = getCellSpanProperty(cell)
            if (rowspan > 1) {
                const _rowEnd = i + (rowspan - 1)
                if (_rowEnd > rowEnd) {
                    rowEnd = _rowEnd
                }
            } else if (cell.style.display === 'none') {
                let preCell = cell.previousElementSibling
                let k = j - 1
                while (preCell && preCell.style.display === 'none') {
                    preCell = preCell.previousElementSibling
                    k--
                }
                if (preCell) {
                    const {rowspan, colspan} = getCellSpanProperty(preCell)
                    k = k + (colspan - 1)
                    if (k >= j && rowspan > 1) {
                        const _rowEnd = i + (rowspan - 1)
                        if (_rowEnd > rowEnd) {
                            rowEnd = _rowEnd
                        }
                    }
                }
            }
            if (colspan > 1) {
                const _colEnd = j + (colspan - 1)
                if (_colEnd > colEnd) {
                    colEnd = _colEnd
                    return fn(rows, rowStart, rowEnd, colStart, colEnd)
                } 
            }
        } 
    }
    return {
        rowEnd,
        colEnd,
    }
})

export const getPreTrCellInfo = (rows, i, j) => {
    if (i > 0) {
        let m = i - 1
        let preTrCell = rows[m].children[j]
        while (preTrCell && preTrCell.style.display === 'none') {
            m--
            preTrCell = rows[m].children[j]
        }
        return {
            preTrCell,
            preTrIndex: m,
        }
    }
}

export const getPreCellInfo = (cell, j) => {
    if (!cell.previousElementSibling) {
        return {
            preCell: cell,
            preCellIndex: j,
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
        preCellIndex: k,
    }
}

export const getIndexStart = (rows, rowStart, rowEnd, colStart, colEnd) => {
    for (let i = rowEnd; i >= rowStart; i--) {
        const {children} = rows[i]
        for (let j = colEnd; j >= colStart; j--) {
            const cell = children[j]
            // console.log(i, j, cell)
            if (cell.style.display === 'none') {
                // 仅行合并
                // 1、左边单元格不为none
                // 2、左边单元格为none

                // 仅列合并
                // 1、上面单元格不为none
                // 2、上面单元格为none


                // 行列合并(上面单元格与同行上一个单元格都为none)
                // 1、左边不影响当前
                // 2、左边与当前为一体

                const {preTrCell, preTrIndex} = getPreTrCellInfo(rows, i, j)
                const {preCell, preCellIndex} = getPreCellInfo(cell, j)
                const {rowspan: preTrRowspan} = getCellSpanProperty(preTrCell)
                const {colspan} = getCellSpanProperty(preCell)
                // console.log(preTrRowspan, colspan)
                if (preTrRowspan > 1 && j > preCellIndex) { // 仅行合并
                    const diff = i - preTrIndex
                    const newRowStart = i - diff
                    if (newRowStart < rowStart && newRowStart >= 0) {
                        rowStart = newRowStart
                    }
                    // console.log(i, j, ':', preTrIndex, diff, rowStart)
                } else if (colspan > 1 && j <= preCellIndex) { // 仅列合并
                    const c = j - (colspan - 1)
                    if (c < colStart) {
                        colStart = c > 0 ? c : 0
                    }
                } /*else if () { // 行列合并

                }*/
            }
        } 
    }

    return {
        rowStart,
        colStart,
    }
}

export const isRect = (rows) => {
    const trLen = rows.length
    for (let i = 0; i <= trlen; i++) {
        const {children} = rows[i]
        for (let j = colEnd; j >= colStart; j--) {
            const cell = children[j]
            // console.log(i, j, cell)
        } 
    }
}
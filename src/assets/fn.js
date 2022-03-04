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
            preCellIndexRight: j,
            preCellIndexLeft: j,
        }
    }
    let preCell = cell.previousElementSibling
    let k = j - 1
    while (k > 0 && preCell && preCell.style.display === 'none') {
        preCell = preCell.previousElementSibling
        k--
    }
    const indexLeft = k
    if (preCell) {
        const {colspan} = getCellSpanProperty(preCell)
        k = k + (colspan - 1)
    } 
    return {
        preCell,
        preCellIndexRight: k,
        preCellIndexLeft: indexLeft,
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
                const {preCell, preCellIndexRight, preCellIndexLeft} = getPreCellInfo(cell, j)
                const {rowspan: preTrRowspan} = getCellSpanProperty(preTrCell)
                const {colspan} = getCellSpanProperty(preCell)
                if (preTrRowspan > 1 && j > preCellIndexRight) { // 仅行合并
                    if (preTrIndex < rowStart && preTrIndex >= 0) {
                        rowStart = preTrIndex
                    }
                } else if (colspan > 1 && j <= preCellIndexRight) { // 仅列合并
                    if (preCellIndexLeft < colStart && preCellIndexLeft >= 0) {
                        colStart = preCellIndexLeft
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

export const isRect = (selectedRowArray) => {
    const trLen = selectedRowArray.length
    let res = []
    for (let i = 0; i < trLen; i++) {
        const row = selectedRowArray[i]
        const count = getLenOneRowWithTableIsProcess(row)
        res.push(count)
    }
    const same = res.every(num => num === res[0])
    return same
}

export const getLenOneRowWithTableIsProcess = (rowArray) => {
    const len = rowArray.length
    let count = 0
    for (let i = 0; i < len; i++) {
        const cell = rowArray[i]
        const colspan = cell.getAttribute('colspan')
        if (i === len - 1 && colspan > 1) {
            count = count + colspan * 1
        } else {
            count += 1
        }
    }
    return count
}
/* eslint-disable */
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

export const getIndexEnd_copy1 = (function fn (rows, rowStart, rowEnd, colStart, colEnd) {
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
                    // return fn(rows, rowStart, rowEnd, colStart, colEnd)
                } 
            }
        } 
    }
    return {
        rowEnd,
        colEnd,
    }
})

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
            } 
            if (colspan > 1) {
                const _colEnd = j + (colspan - 1)
                if (_colEnd > colEnd) {
                    colEnd = _colEnd
                    // return fn(rows, rowStart, rowEnd, colStart, colEnd)
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
    if (!rows) {
        throw new Error('请传入行')
    }
    if (typeof i !== 'number' || typeof j !== 'number') {
        throw new Error('请传入行和列索引')
    }
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

export const getIndexStart = (function fn (rows, rowStart, rowEnd, colStart, colEnd) {
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
                const {colspan: preColspan} = getCellSpanProperty(preCell)
                if (preTrRowspan > 1 && j > preCellIndexRight) { // 仅行合并
                    if (preTrIndex < rowStart && preTrIndex >= 0) {
                        if (preTrIndex + preTrRowspan - 1 < i) continue
                        rowStart = preTrIndex
                    }
                } else if (preColspan > 1 && j <= preCellIndexRight) { // 仅列合并
                    if (preCellIndexLeft < colStart && preCellIndexLeft >= 0) {
                        colStart = preCellIndexLeft
                        // return fn(rows, rowStart, rowEnd, colStart, colEnd)
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
})

export const isRect_copy1 = (selectedRowArray) => {
    const trLen = selectedRowArray.length
    let res = []
    for (let i = 0; i < trLen; i++) {
        const row = selectedRowArray[i]
        const count = getLenOneRowWithTableIsProcess(row)
        res.push(count)
    }
    const same = res.every(num => num === res[0])
    // console.log(res)
    return same
}

export const isRect = (selectedRowArray) => {
    console.log(selectedRowArray)
    const trLen = selectedRowArray.length
    const cellsLen = selectedRowArray[0].length
    let res1 = [], res2 = []
    for (let i = 0; i < trLen; i++) {
        const row = selectedRowArray[i]
        const count = getLenOneRowWithTableIsProcess(row)
        res1.push(count)
    }
    for (let j = 0; j < cellsLen; j++) {
        let _oneCol = []
        for (let i = 0; i < trLen; i++) {
            const cell = selectedRowArray[i][j]
            _oneCol.push(cell)
        }
        const count = getLenOneColWithTableIsProcess(_oneCol)
        res2.push(count)
    }
    const same1 = res1.every(num => num === res1[0])
    const same2 = res2.every(num => num === res2[0])
    console.log(res1, res2)
    return same1 && same2
}

export const getLenOneRowWithTableIsProcess = (row) => {
    const len = row.length
    let count = 0
    for (let j = 0, jump = 0; j < len; j++) {
        const cell = row[j]
        if (jump > 0) {
            jump--
            continue
        }
        const {colspan} = getCellSpanProperty(cell)
        const {preCell} = getPreCellInfo(cell, j)
        if (colspan > 1) {
            count += colspan
            jump = colspan - 1
        } else if (j === 0 && cell.style.display === 'none') {
            const {colspan: preColspan} = getCellSpanProperty(preCell)
            if (preColspan > 1) {
                count += preColspan
            } else {
                count += 1
            }
        } /*else if (j === len - 1 && cell.style.display === 'none') {
            count += 2
        }*/ else {
            count += 1
        }
    }
    return count
}

export const getLenOneColWithTableIsProcess = (oneCol) => {
    const len = oneCol.length
    let count = 0
    for (let i = 0, jump = 0; i < len; i++) {
        const cell = oneCol[i]
        if (jump > 0) {
            jump--
            continue
        }
        const {rowspan} = getCellSpanProperty(cell)
        if (rowspan > 1) {
            count += rowspan
            jump = rowspan - 1
        } else {
            count += 1
        }
    }
    return count
}

export const loopTR = (rows, rowStart, rowEnd, colStart, colEnd) => {
    for (let i = rowStart; i <= rowEnd; i++) {
        const tr = rows[i]
        const {children} = tr
        for (let j = colEnd; j >= colStart; j--) {
            const cell = children[j]
            // console.log(i, j, cell)
            const {rowspan, colspan} = getCellSpanProperty(cell)
            if (rowspan > 1) {
                const _rowEnd = i + (rowspan - 1)
                if (_rowEnd > rowEnd) {
                    rowEnd = _rowEnd
                }
            } 
            if (cell.style.display === 'none') {
                const {preCell, preCellIndexRight, preCellIndexLeft} = getPreCellInfo(cell, j)
                const {colspan: preColspan} = getCellSpanProperty(preCell)
                if (preColspan > 1 && j <= preCellIndexRight) { // 仅列合并
                    if (preCellIndexLeft < colStart && preCellIndexLeft >= 0) {
                        colStart = preCellIndexLeft
                    }
                } 
            } 
        } 
    }
    return {
        rowEnd,
        colStart,
    }
}

export const loopBR = (rows, rowStart, rowEnd, colStart, colEnd) => {
    for (let i = rowEnd; i >= rowStart; i--) {
        const {children} = rows[i]
        for (let j = colEnd; j >= colStart; j--) {
            const cell = children[j]
            // console.log(i, j, cell)
            if (cell.style.display === 'none') {
                const {preTrCell, preTrIndex} = getPreTrCellInfo(rows, i, j)
                const {preCell, preCellIndexRight, preCellIndexLeft} = getPreCellInfo(cell, j)
                const {rowspan: preTrRowspan} = getCellSpanProperty(preTrCell)
                const {colspan: preColspan} = getCellSpanProperty(preCell)
                if (preTrRowspan > 1 && j > preCellIndexRight) { // 仅行合并
                    if (preTrIndex < rowStart && preTrIndex >= 0) {
                        if (preTrIndex + preTrRowspan - 1 < i) continue
                        rowStart = preTrIndex
                    }
                } else if (preColspan > 1 && j <= preCellIndexRight) { // 仅列合并
                    if (preCellIndexLeft < colStart && preCellIndexLeft >= 0) {
                        colStart = preCellIndexLeft
                    }
                } 
            }
        } 
    }
    return {
        rowStart,
        colStart,
    }
}

export const loopBL = (rows, rowStart, rowEnd, colStart, colEnd) => {
    for (let i = rowEnd; i >= rowStart; i--) {
        const {children} = rows[i]
        for (let j = colStart; j <= colEnd; j++) {
            const cell = children[j]
            // console.log(i, j, cell)
            if (cell.style.display === 'none') {
                const {preTrCell, preTrIndex} = getPreTrCellInfo(rows, i, j)
                const {preCellIndexRight} = getPreCellInfo(cell, j)
                const {rowspan: preTrRowspan} = getCellSpanProperty(preTrCell)
                if (preTrRowspan > 1 && j > preCellIndexRight) { // 仅行合并
                    if (preTrIndex < rowStart && preTrIndex >= 0) {
                        if (preTrIndex + preTrRowspan - 1 < i) continue
                        rowStart = preTrIndex
                    }
                } 
            }
            const {colspan} = getCellSpanProperty(cell)
            if (colspan > 1) {
                const _colEnd = j + (colspan - 1)
                if (_colEnd > colEnd) {
                    colEnd = _colEnd
                } 
            } 
        } 
    }

    return {
        rowStart,
        colEnd,
    }
}

export const loopTL = (rows, rowStart, rowEnd, colStart, colEnd) => {
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
            } 
            if (colspan > 1) {
                const _colEnd = j + (colspan - 1)
                if (_colEnd > colEnd) {
                    colEnd = _colEnd
                } 
            } 
        } 
    }
    return {
        rowEnd,
        colEnd,
    }
}

export const getIndex = (arr, key, type) => {
    let res = []
    arr.forEach(item => {
        const value = item[key]
        if (value >= 0) {
            res.push(value)
        }
    })
    return Math[type](...res)
}

export const getRowStart = (function fn (rows, rowStart, rowEnd, colStart, colEnd) {
    // console.log(rowStart, rowEnd, colStart, colEnd)
    const {children} = rows[rowStart]
    for (let j = colStart; j <= colEnd; j++) {
        const cell = children[j]
        if (cell.style.display === 'none') {
            // console.log(cell)
            const {preTrCell, preTrIndex} = getPreTrCellInfo(rows, rowStart, j)
            const {preCell, preCellIndexRight} = getPreCellInfo(cell, j)
            const {rowspan: preTrRowspan} = getCellSpanProperty(preTrCell)
            if (preTrRowspan > 1 && j > preCellIndexRight) { // 仅行合并
                if (preTrIndex < rowStart && preTrIndex >= 0) {
                    if (preTrIndex + preTrRowspan - 1 < rowStart) continue
                    rowStart = preTrIndex
                    return fn(rows, rowStart, rowEnd, colStart, colEnd)
                }
            }
        }
    } 
    return rowStart
})

export const getColEnd = (function fn (rows, rowStart, rowEnd, colStart, colEnd) {
    for (let i = rowStart; i <= rowEnd; i++) {
        const tr = rows[i]
        const {children} = tr
        const cell = children[colEnd]
        // console.log(i, cell)
        const {colspan} = getCellSpanProperty(cell)
        if (colspan > 1) {
            colEnd += colspan - 1
            return fn(rows, rowStart, colEnd, colStart, colEnd)
        } else if (cell.style.display === 'none') {
            // console.log(cell)
            const {preCell, preCellIndexRight, preCellIndexLeft} = getPreCellInfo(cell, colEnd)
            const {colspan: preColspan} = getCellSpanProperty(preCell)
            if (preColspan > 1 && colEnd < preCellIndexRight) { // 仅列合并
                // console.log(colEnd, preCellIndexLeft, preCellIndexRight, preCell)
                colEnd = preCellIndexRight
                return fn(rows, rowStart, rowEnd, colEnd, colEnd)
            } 
        } 
    }
    return colEnd
})

export const getRowEnd = (function fn (rows, rowStart, rowEnd, colStart, colEnd) {
    const {children} = rows[rowEnd]
    for (let j = colStart; j <= colEnd; j++) {
        const cell = children[j]
        const {rowspan} = getCellSpanProperty(cell)
        if (rowspan > 1) {
            rowEnd += rowspan - 1
            return fn(rows, rowStart, rowEnd, colStart, colEnd)
        } else if (cell.style.display === 'none') {
            const {preTrCell, preTrIndex} = getPreTrCellInfo(rows, rowEnd, j)
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
    for (let i = rowStart; i <= rowEnd; i++) {
        const tr = rows[i]
        const {children} = tr
        const cell = children[colStart]
        // console.log(i, cell)
        if (cell.style.display === 'none') {
            // console.log(cell)
            const {preCell, preCellIndexRight, preCellIndexLeft} = getPreCellInfo(cell, colStart)
            const {colspan: preColspan} = getCellSpanProperty(preCell)
            if (preColspan > 1 && colStart <= preCellIndexRight) { // 仅列合并
                const _colStart = colStart - (preColspan - 1)
                // console.log(_colStart)
                colStart = _colStart
                return fn(rows, rowStart, rowEnd, colStart, colEnd)
            } 
        } 
    }
    return colStart
})


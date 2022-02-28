/* eslint-disable */
const factorial = (function fn (num) {
    if (num <= 1) {
        return 1
    } else {
        return num * fn(num - 1)
    }
})

export const getCellSpanProperty = function (cell) {
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

export const getIndexStart = (function fn (rows, rowStart, rowEnd, colStart, colEnd) {
    for (let i = rowEnd; i >= rowStart; i--) {
        const {children} = rows[i]
        for (let j = colEnd; j >= colStart; j--) {
            const cell = children[j]
            console.log(i, j, cell)
            // 列
            /*if (colspan > 1) {
                const _colEnd = j + (colspan - 1)
                if (_colEnd > colEnd) {
                    colEnd = _colEnd
                    return fn(rows, rowStart, rowEnd, colStart, colEnd)
                } 
            }*/

            // 行
            if (cell.style.display === 'none') {
                if (i === 0) continue
                let m = i - 1
                let preTrCell = rows[m].children[j]
                while (preTrCell && preTrCell.style.display === 'none') {
                    m--
                    preTrCell = rows[m].children[j].previousElementSibling
                }
                console.log(preTrCell)
                const {
                    rowspan: preTrRowspan, 
                } = getCellSpanProperty(preTrCell)

                let preCell = cell.previousElementSibling
                let k = j - 1
                while (preCell && preCell.style.display === 'none') {
                    preCell = preCell.previousElementSibling
                    k--
                }
                if (preCell) {
                    const {colspan} = getCellSpanProperty(preCell)
                    k = k + (colspan - 1)
                } 
                // console.log(k, m, rows[m], preTrCell, preTrRowspan)
                if (k < j && preTrRowspan > 1) {
                    if (m < rowStart) {
                        rowStart = m
                    }
                }
            }
        } 
    }

    return {
        rowStart,
        colStart,
    }
})

/* eslint-disable */
const handleKnowledgeContent = (str) => {
    return str.replace(/(<table.*?>)/gs, '<div class="tableMergeCell-tempContainer">$1').replace(/(<\/table>)/g, '$1</div>')
}

export const handleData_getKnowledgePageByActPackId = (res) => {
    if (!res) return res
    const { state, data } = res
    if (state === 200 && data) {
        const { rows } = data
        if (!Array.isArray(rows)) return res
        const len1 = rows.length
        for (let i = 0; i < len1; i++) {
            const row = rows[i]
            const { subActivityPackageKnowledgeDirVos } = row
            if (!Array.isArray(subActivityPackageKnowledgeDirVos)) continue
            const len2 = subActivityPackageKnowledgeDirVos.length
            for (let j = 0; j < len2; j++) {
                const level2Data = subActivityPackageKnowledgeDirVos[j]
                if (!level2Data) continue
                const { knowledgeVo } = level2Data
                if (!knowledgeVo) continue
                const { knowledgeContent } = knowledgeVo
                if (knowledgeContent) {
                    knowledgeVo.knowledgeContent = handleKnowledgeContent(knowledgeContent)
                }
            }
        }
    }
    return res
}

export const handleData_getKnowledgeById = (res) => {
    if (!res) return res
    const { state, data } = res
    if (state === 200 && data) {
        const { knowledgeContent } = data
        if (knowledgeContent) {
            data.knowledgeContent = handleKnowledgeContent(knowledgeContent)
        }
    }
    return res
}

export const handleData_showList = (res) => {
    if (!res) return res
    const { code, rows } = res
    if (code === 200) {
        if (!Array.isArray(rows)) return res
        const len1 = rows.length
        for (let i = 0; i < len1; i++) {
            const row = rows[i]
            const { logContent } = row
            if (logContent) {
                row.logContent = handleKnowledgeContent(logContent)
            }
        }
    }
    return res
}

export const handleData_taskDetail = (res) => {
    if (!res) return res
    const { state, data } = res
    if (state === 200 && data) {
        const { knowledgeList } = data
        if (Array.isArray(knowledgeList)) {
            const len = knowledgeList.length
            for (let i = 0; i < len; i++) {
                const item = knowledgeList[i]
                const { name } = item
                if (name) {
                    item.name = handleKnowledgeContent(name)
                }
            }
        }
    }
    return res
}

// ?????????????????????????????????????????????
export const handleOfficeTableSpace = (cell) => {
    const {innerHTML} = cell
    cell.innerHTML = innerHTML.replace(/(&nbsp;){3,}/g, '<br>')
}

// ?????????????????????????????????????????????????????????
export const getCellsLenFromOfficeTable = (row) => {
    const cells = row.cells
    const len = cells.length
    let count = 0
    for (let i = 0; i < len; i++) {
        const cell = cells[i]
        const colspan = cell.getAttribute('colspan')
        if (colspan > 1) {
            count = count + colspan * 1
        } else {
            count += 1
        }
    }
    return count
}

// ?????????????????????????????????????????????????????????
export const handleOfficeTable = (table) => {
    const cellpadding = table.getAttribute('cellpadding')
    if (cellpadding) return
    const tbody = table.tBodies[0]
    const rows = tbody.children
    const rowLen = rows.length
    const cellsLen = getCellsLenFromOfficeTable(rows[0])
    for (let i = 0; i < rowLen; i++) {
        const row = rows[i]
        const cells = row.cells
        for (let j = 0; j < cellsLen; j++) {
            const cell = cells[j]
            handleOfficeTableSpace(cell)
            const rowspan = cell.getAttribute('rowspan')
            const colspan = cell.getAttribute('colspan')
            if (rowspan > 1 && !colspan) {
                for (let k = 1; k < rowspan; k++) {
                    const newCell = rows[i + k].insertCell(j)
                    newCell.style.display = 'none'
                }
            } else if (!rowspan && colspan > 1) {
                for (let k = 1; k < colspan; k++) {
                    const newCell = row.insertCell(j + k)
                    newCell.style.display = 'none'
                }
            } else if (rowspan > 1 && colspan > 1) {
                for (let l = 0; l < rowspan; l++) {
                    let c = 0, p = j
                    if (l === 0) {
                        c = 1
                        p = j + 1
                    }
                    for (; c < colspan; c++) {
                        const newCell = rows[i + l].insertCell(p)
                        newCell.style.display = 'none'
                    }
                }
            }
        }
    }
}

// ????????????????????????????????????
export const handleTh = (table) => {
    const cellspacing = table.getAttribute('cellspacing')
    if (!cellspacing) return
    const tbody = table.tBodies[0]
    const rows = tbody.children
    const firstTr = rows[0]
    const {children} = firstTr
    const len = children.length
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < len; i++) {
        const cell = children[i]
        if (cell.tagName === 'TD') {
            fragment = null
            break
        }
        const td = document.createElement('td')
        fragment.appendChild(td)
    }
    if (!fragment) return
    let newTr = document.createElement('tr')
    newTr.appendChild(fragment)
    tbody.replaceChild(newTr, firstTr)
}

// ??????????????????????????????
export const removeTableActiveCls = () => {
    const activeEle = document.querySelector('.tableMergeCell_active')
    if (activeEle) {
        activeEle.classList.remove('tableMergeCell_active')
    }
}

const _getPreTrCellInfo = (rows, i, j) => {
    if (!rows) {
        throw new Error('????????????')
    }
    if (typeof i !== 'number' || typeof j !== 'number') {
        throw new Error('????????????????????????')
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
        throw new Error('??????????????????')
    }
    if (typeof j !== 'number') {
        throw new Error('??????????????????')
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

// ???????????????rowspan, colspan?????????
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

// ???????????????
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

// ???????????????
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

// ???????????????
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

// ???????????????
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

// ????????????rgb???
export const colorToRgb = (color) => {
    var span = document.createElement('span')
    span.style.color = color
    document.body.appendChild(span)
    var c = window.getComputedStyle(span).color
    document.body.removeChild(span)
    return c
}

// ???????????????
export const getIndexDefaultValue = () => {
    return {
        row: -1,
        col: -1,
    }
}

// ??????td, th?????????
export const getTargetParentCell = (target) => {
    while (target.tagName !== 'TD' && target.tagName !== 'TH' && target.parentNode) {
        target = target.parentNode
    }
    return target
}

// ?????????thead????????????
export const isTheadChild = (target) => {
    while (target.tagName !== 'THEAD' && target.parentNode) {
        target = target.parentNode
    }
    return target.tagName === 'THEAD'
}

// ?????????excel????????????????????????
export const handleExcelData = (values) => {
    values = values.replace(/\n/g, 'n').replace(/\s/g, ',').replace(/,{2,}/g, ',')
    values = values.substring(0, values.length - 2)
    const arr1 = values.split(',n')
    let res = []
    arr1.forEach(item => {
        const arr2 = item.split(',')
        res.push(arr2)
    })
    return res
}

// ??????mutation addedNode???table??????
export const getAddedTable = (mutation) => {
    const { addedNodes } = mutation
    let table = null
    for (let i = 0; i < addedNodes.length; i++) {
        const node = addedNodes[i]
        const {className} = node
        if (node.tagName === 'TABLE') {
            table = node
            break
        } else if (className && className.includes('tableMergeCell-tempContainer')) {
            table = node.firstChild
            break
        }
    }
    return table
}

// ??????mutation addedNode???img??????
export const getAddedImg = (mutation) => {
    const { addedNodes } = mutation
    let src = null
    for (let i = 0; i < addedNodes.length; i++) {
        const node = addedNodes[i]
        if (node.tagName === 'IMG') {
            const prevTable = node.previousElementSibling
            if (prevTable && prevTable.tagName === 'TABLE') {
                src = node.getAttribute('src')
                break
            } else if (node.parentNode) {
                const prevSib = node.parentNode.previousElementSibling
                if (prevSib && prevSib.tagName === 'TABLE') {
                    src = node.getAttribute('src')
                    break
                }
            }
        }
    }
    return src
}
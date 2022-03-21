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

// 删除从其它软件粘贴过来带的空格
export const handleOfficeTableSpace = (cell) => {
    const {innerHTML} = cell
    cell.innerHTML = innerHTML.replace(/(&nbsp;){3,}/g, '<br>')
}

// 获取从办公软件粘贴过来的每行单元格长度
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

// 补齐从办公软件复制粘贴过来的表格单元格
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
                    /*if (l === 0) {
                        for (let c = 1; c < colspan; c++) {
                            const newCell = rows[i + l].insertCell(j + 1)
                            newCell.style.display = 'none'
                        }
                    } else {
                        for (let c = 0; c < colspan; c++) {
                            const newCell = rows[i + l].insertCell(j)
                            newCell.style.display = 'none'
                        }
                    }*/
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

export const removeTableActiveCls = () => {
    const activeEle = document.querySelector('.tableMergeCell_active')
    if (activeEle) {
        activeEle.classList.remove('tableMergeCell_active')
    }
}
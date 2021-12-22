/* eslint-disable */
import {Modal} from 'ant-design-vue'
import 'ant-design-vue/lib/modal/style/css'

const defaults = {
    btnDisabledColor: '#ddd',   // 右键菜单禁用时的颜色
    onAddCol: null,             // 添加列完成后回调
}

export default class TableMergeCell {
    static focusEle = null

    // 二维数组
    static copyedCellsArray = []

    static colorToRgb (color) {
        var span = document.createElement('span')
        span.style.color = color
        document.body.appendChild(span)
        var c = window.getComputedStyle(span).color
        document.body.removeChild(span)
        return c
    }

    static getIndexDefaultValue () {
        return {
            row: -1,
            col: -1,
        }
    }

    static getTargetParentCell (target) {
        while (target.tagName !== 'TD' && target.tagName !== 'TH' && target.parentNode) {
            target = target.parentNode
        }
        return target
    }

    static isTheadChild (target) {
        while (target.tagName !== 'THEAD' && target.parentNode) {
            target = target.parentNode
        }
        return target.tagName === 'THEAD'
    }

    static handleExcelData (values) {
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

    constructor (tableEle, options = {}) {
        this.opts = Object.assign({}, defaults, options)
        this.tableEle = tableEle
        this.tBody = tableEle.tBodies[0]
        this.rows = this.tBody.rows
        this.tableClassName = 'tableMergeCell'
        this.menuEle = null
        this.menus = [
            {
                name: '靠左',
                key: 'textAlignLeft',
            },
            {
                name: '居中',
                key: 'textAlignCenter',
            },
            {
                name: '靠右',
                key: 'textAlignRight',
            },
            {
                name: '设置背景色',
                key: 'addBackgroundColor',
            },
            {
                name: '删除背景色',
                key: 'delBackgroundColor',
            },
            {
                name: '合并单元格',
                key: 'merge',
            }, 
            {
                name: '取消合并单元格',
                key: 'unMerge',
            },
            {
                name: '添加行',
                key: 'addRow',
            },
            {
                name: '删除行',
                key: 'delRow',
            },
            {
                name: '添加列',
                key: 'addCol',
            },
            {
                name: '删除列',
                key: 'delCol',
            },
            {
                name: '设置表头',
                key: 'addTh',
            },
            {
                name: '取消表头',
                key: 'delTh',
            },
            {
                name: '删除表格',
                key: 'delTable',
            },
        ]
        this.selectedCellClassName = 'tableMergeCell-selected'
        this.ready = false
        this.cellStart = null
        this.cellEnd = null
        this.indexStart = TableMergeCell.getIndexDefaultValue()
        this.indexEnd = TableMergeCell.getIndexDefaultValue()
        this.maxRowCount = 0
        this.maxColCount = 0
        this.contextmenuCell = null
        this.init()
    }

    // 初始化
    init () {
        if (!this.tableEle && this.tableEle.ELEMENT_NODE !== 1 && this.tableEle.tagName !== 'TABLE') {
            throw new Error('请传入table元素！')
        }
        this.tableEle.classList.add(this.tableClassName)
        this.handleTableFromExcel()
        this.addFocusEle()
        // this.addCellLocation()
        this.syncMaxRowAndColCount()
        this.addEvent()
    }

    // 销毁
    destroy () {
        this.removeEvent()
        if (this.menuEle) {
            this.menuEle.removeEventListener('click', this.menuClick, false)
            this.menuEle.remove()
        }
        TableMergeCell.focusEle && TableMergeCell.focusEle.remove()
    }

    // 补齐从excel复制粘贴过来的表格单元格
    handleTableFromExcel () {
        const [colgroup, tbody] = this.tableEle.children
        if (colgroup.tagName === 'COLGROUP') {
            const rows = tbody.children
            const rowLen = rows.length
            for (let i = 0; i < rowLen; i++) {
                const row = rows[i]
                const cells = row.cells
                const colLen = cells.length
                for (let j = 0; j < colLen; j++) {
                    const cell = cells[j]
                    const rowspan = cell.getAttribute('rowspan')
                    const colspan = cell.getAttribute('colspan')
                    if (rowspan >= 1) {
                        for (let k = 1; k < rowspan; k++) {
                            const newCell = rows[i + k].insertCell(j)
                            newCell.style.display = 'none'
                        }
                    }
                    if (colspan >= 1) {
                        for (let k = 1; k < colspan; k++) {
                            const newCell = row.insertCell(j + k)
                            newCell.style.display = 'none'
                        }
                    }
                }
            }
        }
    }

    // 创建焦点元素
    addFocusEle () {
        if (!TableMergeCell.focusEle) {
            TableMergeCell.focusEle = document.createElement('button')
            TableMergeCell.focusEle.className = 'tableMergeCell-focusEle'
            document.body.appendChild(TableMergeCell.focusEle)
        }
    }

    // 添加调试坐标
    addCellLocation () {
        const {rows} = this
        rows.forEach((row, i) => {
            const cells = row.children
            cells.forEach((cell, j) => {
                cell.textContent = i + '-' + j
            })
        })
    }

    // 同步最大行数和最大列数
    syncMaxRowAndColCount () {
        const {rows} = this
        if (rows.length) {
            this.maxRowCount = rows.length
            this.maxColCount = rows[0].childElementCount
        } else {
            this.maxRowCount = 0
            this.maxColCount = 0
        }
    }

    // 添加背景色
    colorChange = (e) => {
        const {target} = e
        const {value} = target
        const {selectedCells} = this.colorPicker
        if (selectedCells.length) {
            selectedCells.forEach(ele => {
                ele.style.backgroundColor = value
            })
        }
        if (this.colorPicker) {
            this.colorPicker.removeEventListener('input', this.colorChange)
            this.colorPicker.remove()
            this.colorPicker = null
        }
        this.removeClass()
    }

    // 显示颜色选择弹窗
    addBackgroundColor () {
        const selectedCells = this.getSelectedCells()
        if (!selectedCells.length) return
        this.colorPicker = document.createElement('input')
        this.colorPicker.setAttribute('type', 'color')
        this.colorPicker.className = 'tableMergeCell-colorPicker'
        this.colorPicker.addEventListener('input', this.colorChange, false)
        this.colorPicker.selectedCells = selectedCells
        const selectedLastEle = selectedCells[selectedCells.length - 1]
        selectedLastEle.appendChild(this.colorPicker)
        this.colorPicker.click()
    }

    // 删除背景色
    delBackgroundColor () {
        const selectedCells = this.getSelectedCells()
        selectedCells.forEach(ele => {
            ele.style.removeProperty('background-color')
        })
    }

    // 表中表
    tableIsInTable (target) {
        while (target && target.tagName !== 'TABLE') {
            target = target.parentNode
        }
        return this.tableEle !== target && this.tableEle.contains(target)
    }

    // 为指定单元格添加类名
    addClass (cell) {
        if (!cell.className.includes(this.selectedCellClassName)) {
            cell.classList.add(this.selectedCellClassName)
        }
    }

    // 移除指定或选取元素类名
    removeClass (cell) {
        if (cell) {
            cell.classList.remove(this.selectedCellClassName)
            if (cell.className === '') {
                cell.removeAttribute('class')
            }
        } else {
            const selectedCells = this.tableEle.querySelectorAll('.tableMergeCell-selected')
            if (selectedCells.length) {
                selectedCells.forEach(item => {
                    item.classList.remove(this.selectedCellClassName)
                    if (item.className === '') {
                        item.removeAttribute('class')
                    }
                })
            }  
        }
    }

    // 高亮选取的单元格
    highlightSelectedCells () {
        const {rows} = this
        const isValid = this.selectedCellsIsValid(rows)
        if (!isValid) return
        const selectedCells = this.getSelectedCells()
        selectedCells.forEach(ele => {
            this.addClass(ele)
        })
    }

    // 获取选取的单元格
    getSelectedCells (isTwoDimensionalArray = false) {
        const {indexStart, indexEnd} = this
        let selectedCells = []
        let selectedCellsTwoDimensionalArray = []
        const {rows} = this
        for (let i = 0; i < this.maxRowCount; i++) {
            const tr = rows[i]
            const {children} = tr
            const childLen = children.length
            let rowArray = []
            for (let j = 0; j < childLen; j++) {
                const cell = children[j]
                if (i >= indexStart.row && i <= indexEnd.row && j >= indexStart.col && j <= indexEnd.col) {
                    selectedCells.push(cell)
                    rowArray.push(cell)
                } 
            }
            if (rowArray.length) {
                selectedCellsTwoDimensionalArray.push(rowArray)
            }
        }

        return isTwoDimensionalArray ? selectedCellsTwoDimensionalArray : selectedCells
    }

    // 判断选取的单元格是否有效
    selectedCellsIsValid () {
        const cellStart_rowspan = this.cellStart.getAttribute('rowspan')
        const cellEnd_rowspan = this.cellEnd && this.cellEnd.getAttribute('rowspan')
        // '不符合合并规则：选中区域不能包含已合并的单元格。'
        if (cellStart_rowspan || cellEnd_rowspan) {
            return false
        } 
        const selectedCells = this.getSelectedCells()
        const isInvalid = selectedCells.some(ele => {
            return ele.style.display === 'none' || this.getIsMergedCellBool(ele)
        })
        // '不符合合并规则：不能有隐藏的单元格或合并的单元格。'
        if (isInvalid) {
            return false
        }
        return true
    }

    // 合并单元格
    mergeCell = () => {
        const selectedCells = this.getSelectedCells()
        const len = selectedCells.length
        const {indexStart, indexEnd} = this
        const rowspan = indexEnd.row - indexStart.row + 1
        const colspan = indexEnd.col - indexStart.col + 1
        let firstHasValueCell = null
        for (let i = 0; i < len; i++) {
            const cell = selectedCells[i]
            if (cell.innerText) {
                firstHasValueCell = cell
                break
            }
        }
        selectedCells.forEach((ele, index) => {
            if (index === 0) {
                ele.setAttribute('rowspan', rowspan)
                ele.setAttribute('colspan', colspan)
                if (!ele.innerText && firstHasValueCell) {
                    ele.innerHTML = firstHasValueCell.innerHTML
                    ele.removeAttribute('style')
                    const style = firstHasValueCell.getAttribute('style')
                    style && ele.setAttribute('style', style)
                }
            } else {
                ele.style.display = 'none'
            }
            this.removeClass(ele)
        })
    }

    // 取消合并单元格
    unMergeCell = () => {
        let cellSpanProperty = null
        this.indexStart = this.getCellIndex(this.cellEnd)
        cellSpanProperty = this.getCellSpanProperty(this.cellEnd)
        this.indexEnd = {
            row: cellSpanProperty.rowspan - 1 + this.indexStart.row,
            col: cellSpanProperty.colspan - 1 + this.indexStart.col,
        }
        const selectedCells = this.getSelectedCells()
        selectedCells.forEach((cell, index) => {
            if (index === 0) {
                cell.removeAttribute('rowspan')
                cell.removeAttribute('colspan')
            } else {
                cell.style.removeProperty('display')
            }
            this.removeClass(cell)
        })
        
    }

    // 获取单元格行列索引
    getCellIndex (ele) {
        let index = {
            row: -1,
            col: -1,
        }
        if (!this.cellStart) return index
        const {tagName} = this.cellStart
        const {rows} = this
        if (tagName === 'TH') {
            const firstTr = rows[0]
            const {children} = firstTr
            const childLen = children.length
            index.row = 0
            for (let j = 0; j < childLen; j++) {
                const cell = children[j]
                if (cell === ele) {
                    index.col = j
                    break
                }
            }
        } else if (tagName === 'TD') {
            for (let i = 0; i < this.maxRowCount; i++) {
                const tr = rows[i]
                const {children} = tr
                const childLen = children.length
                for (let j = 0; j < childLen; j++) {
                    const cell = children[j]
                    if (cell === ele) {
                        index.row = i
                        index.col = j
                        break
                    }
                }
                if (index.row > 0) {
                    break
                }
            }
        }
        
        return index
    }

    // 获取单元格rowspan, colspan属性值
    getCellSpanProperty (cell) {
        let rowspan = cell.getAttribute('rowspan')
        let colspan = cell.getAttribute('colspan')
        rowspan = rowspan ? rowspan * 1 : 1
        colspan = colspan ? colspan * 1 : 1
        return {
            rowspan,
            colspan,
        }
    }

    // 获取是否是合并过的单元格
    getIsMergedCellBool (cell) {
        const {rowspan, colspan} = this.getCellSpanProperty(cell)
        const maxCount = Math.max(rowspan, colspan)
        return maxCount > 1
    }

    // 根据类名获取选取的单元格
    getSelectedCellsByClassName () {
        return Array.from(this.tableEle.querySelectorAll(`.${this.selectedCellClassName}`))
    }

    // 获取受影响的合并行索引数组
    getMergedRowIndexArray (startRowIndex, rowspan) {
        const endRowIndex = startRowIndex + rowspan - 1
        let rowIndexArray = []
        do {
            rowIndexArray.push(startRowIndex)
            startRowIndex++
        } while (startRowIndex <= endRowIndex)
        return rowIndexArray
    }

    // 获取受影响的合并列索引数组
    getMergedColIndexArray (startColIndex, colspan) {
        const endColIndex = startColIndex + colspan - 1
        let colIndexArray = []
        do {
            colIndexArray.push(startColIndex)
            startColIndex++
        } while (startColIndex <= endColIndex)
        return colIndexArray
    }

    // 控制右键菜单合并按钮是否可点击
    handleMenuBtnMergeStatus (cell) {
        const {btnDisabledColor} = this.opts
        this.isMergedCell = this.getIsMergedCellBool(cell)
        const selectedCells = this.getSelectedCellsByClassName()
        if (!selectedCells.length) {
            this.btn_merge.style.color = btnDisabledColor
            this.btn_unMerge.style.color = btnDisabledColor
        } else {
            if (this.cellStart === this.cellEnd) {
                if (this.cellEnd.getAttribute('rowspan') || this.cellEnd.getAttribute('colspan')) {
                    this.btn_unMerge.style.removeProperty('color')
                } else {
                    this.btn_merge.style.color = btnDisabledColor
                    this.btn_unMerge.style.color = btnDisabledColor
                }
            } else if (this.getIsMergedCellBool(cell)) {
                this.btn_merge.style.color = btnDisabledColor
                this.btn_unMerge.style.removeProperty('color')
            } else {
                this.btn_merge.style.removeProperty('color')
                this.btn_unMerge.style.color = btnDisabledColor
            }
        }
    }

    // 控制右键菜单行按钮是否可点击
    handleMenuBtnRowStatus (target) {
        const {btnDisabledColor} = this.opts
        if (target.tagName === 'TH') {
            this.btn_addRow.style.color = btnDisabledColor
        } else {
            this.btn_addRow.style.removeProperty('color')
        }
        const {rowspan, colspan} = this.getCellSpanProperty(target)
        if (rowspan > 1 || colspan > 1) {
            this.btn_delRow.style.color = btnDisabledColor
            this.btn_delCol.style.color = btnDisabledColor
        } else {
            this.btn_delRow.style.removeProperty('color')
            this.btn_delCol.style.removeProperty('color')
        }
    }

    // 当未选取单元格时，控制部分右键菜单项是否可点击
    handleSomeMenuBtns () {
        const {btnDisabledColor} = this.opts
        const selectedCells = this.getSelectedCellsByClassName()
        if (selectedCells.length) {
            this.btn_textAlignLeft.style.removeProperty('color')
            this.btn_textAlignCenter.style.removeProperty('color')
            this.btn_textAlignRight.style.removeProperty('color')
            this.btn_addBackgroundColor.style.removeProperty('color')
            this.btn_delBackgroundColor.style.removeProperty('color')
        } else {
            this.btn_addBackgroundColor.style.color = btnDisabledColor
            this.btn_delBackgroundColor.style.color = btnDisabledColor
            this.btn_textAlignLeft.style.color = btnDisabledColor
            this.btn_textAlignCenter.style.color = btnDisabledColor
            this.btn_textAlignRight.style.color = btnDisabledColor
        }
    }

    // 控制删除的列与关联列的关系
    handleMergedCellByDelCol (index) {
        const {rows} = this
        const trLen = rows.length
        for (let i = 0; i < trLen; i++) {
            const row = rows[i]
            const cells = row.children
            const cellLen = cells.length
            for (let j = 0; j < cellLen; j++) {
                const cell = cells[j]
                const {colspan} = this.getCellSpanProperty(cell)
                if (colspan > 1 && index > j && index < j + colspan) {
                    cell.setAttribute('colspan', colspan - 1)
                }
            }
        }
    }

    // 删除表格
    delTable () {
        this.tableEle.remove()
    }

    // 删除空表格
    delEmptyTable () {
        const {rows} = this
        if (!rows.length || !rows[0].children.length) {
            this.delTable()
        }
    }

    // 上面添加一行
    addRow (index) {
        const {maxColCount, tBody} = this
        const relatedCellsArray = this.getRelatedMergedRowCells(index, 'addRow')
        let colIndexArray = []
        relatedCellsArray.forEach(cell => {
            const {rowspan, colspan} = this.getCellSpanProperty(cell)
            const {col} = this.getCellIndex(cell)
            colIndexArray.push(...this.getMergedColIndexArray(col, colspan))
            cell.setAttribute('rowspan', rowspan + 1)
        })
        const newRow = tBody.insertRow(index)
        for (let i = 0; i < maxColCount; i++) {
            newRow.insertCell(i)
        }
        colIndexArray.forEach(index => {
            newRow.children[index].style.display = 'none'
        })
        this.syncMaxRowAndColCount()
    }

    // 获取相关的行合并单元格
    getRelatedMergedRowCells (index, type) {
        const {rows} = this
        let relatedCellsArray = []
        rows.forEach((row, rowIndex) => {
            const cells = row.children
            cells.forEach(cell => {
                const {rowspan} = this.getCellSpanProperty(cell)
                if (rowspan > 1 && this.rowIsInMergedRow(rowIndex, rowspan, index, type)) {
                    relatedCellsArray.push(cell)
                }
            })
        })
        return relatedCellsArray
    }

    // 行是在合并单元格范围内
    rowIsInMergedRow (startRowIndex, rowspan, willRowIndex, type) {
        if (type === 'addRow') {
            return willRowIndex > startRowIndex && willRowIndex <= startRowIndex + rowspan - 1
        } else if (type === 'delRow') {
            return willRowIndex >= startRowIndex && willRowIndex <= startRowIndex + rowspan - 1
        }
    }

    // 左边添加一列
    addCol (index) {
        const {onAddCol} = this.opts
        this.syncMaxRowAndColCount()

        const {maxRowCount} = this
        const {rows} = this
        for (let i = 0; i < maxRowCount; i++) {
            const row = rows[i]
            const cell = row.children[index]
            const newCell = cell.tagName === 'TH' ? '<th></th>' : '<td></td>'
            cell.insertAdjacentHTML('beforebegin', newCell)
        }

        rows.forEach((row, rowIndex) => {
            const cells = row.children
            cells.forEach((cell, cellIndex) => {
                const {rowspan, colspan} = this.getCellSpanProperty(cell)
                if (colspan > 1 && index > cellIndex && index <= cellIndex + colspan - 1) {
                    cell.setAttribute('colspan', colspan + 1)
                    cells[index].style.display = 'none'
                    let rowLen = rowspan
                    let currentRowIndex = rowIndex
                    while (rowLen > 1) {
                        rows[++currentRowIndex].children[index].style.display = 'none'
                        rowLen--
                    }
                }
            })
        })

        this.syncMaxRowAndColCount()

        onAddCol && onAddCol()
    }

    // 删除行
    delRow (index) {
        const {tBody, rows} = this
        const relatedCellsArray = this.getRelatedMergedRowCells(index, 'delRow')
        relatedCellsArray.forEach(cell => {
            const {row, col} = this.getCellIndex(cell)
            if (row === index) {
                this.delFirstRow(rows, col, cell, index)
            } else {
                this.delOtherRow(cell)
            }
        })
        tBody.deleteRow(index)
        this.delEmptyTable()
        this.syncMaxRowAndColCount()
    }

    // 删除非第一行
    delOtherRow (cell) {
        const {rowspan} = this.getCellSpanProperty(cell)
        cell.setAttribute('rowspan', rowspan - 1)
    }

    // 删除第一行
    delFirstRow (rows, col, cell, index) {
        const {rowspan, colspan} = this.getCellSpanProperty(cell)
        const nextRow = rows[index + 1]
        const nextCell = nextRow.children[col]
        nextCell.setAttribute('rowspan', rowspan - 1)
        nextCell.setAttribute('colspan', colspan)
        nextCell.style.display = 'table-cell'
    }

    // 获取相关的列合并单元格
    getRelatedMergedColCells (index) {
        const {rows} = this
        let relatedCellsArray = []
        rows.forEach(row => {
            const cells = row.children
            cells.forEach((cell, cellIndex) => {
                const {colspan} = this.getCellSpanProperty(cell)
                if (colspan > 1 && index >= cellIndex && index <= cellIndex + colspan - 1) {
                    relatedCellsArray.push(cell)
                }
            })
        })
        return relatedCellsArray
    }

    // 删除非第一列
    delOtherCol (cell) {
        const {colspan} = this.getCellSpanProperty(cell)
        cell.setAttribute('colspan', colspan - 1)
    }

    // 删除第一列
    delFirstCol (cell) {
        const {rowspan, colspan} = this.getCellSpanProperty(cell)
        const nextCell = cell.nextElementSibling
        nextCell.setAttribute('colspan', colspan - 1)
        nextCell.setAttribute('rowspan', rowspan)
        nextCell.style.display = 'table-cell'
    }

    // 删除列
    delCol (index) {
        const {rows} = this
        const relatedCellsArray = this.getRelatedMergedColCells(index)
        relatedCellsArray.forEach(cell => {
            const {col} = this.getCellIndex(cell)
            if (col === index) {
                this.delFirstCol(cell)
            } else {
                this.delOtherCol(cell)
            }
        })
        rows.forEach(row => {
            row.deleteCell(index)
        })
        this.delEmptyTable()
        this.syncMaxRowAndColCount()
    }

    // 添加表头
    addTh () {
        const firstTr = this.rows[0]
        const {children} = firstTr
        let tr = document.createElement('tr')
        if (children[0].tagName === 'TD') {
            const len = children.length
            for (let i = 0; i < len; i++) {
                const cell = children[i]
                if (this.getIsMergedCellBool(cell)) {
                    Modal && Modal.confirm({
                        title: '提示',
                        content: '请先手动取消第一行合并的单元格！',
                        zIndex: 10009,
                    })
                    break
                }
                const th = document.createElement('th')
                th.innerHTML = cell.innerHTML
                tr.appendChild(th)
            }
            if (tr.childElementCount === len) {
                firstTr.innerHTML = tr.innerHTML
            }
        }
    }

    // 删除表头
    delTh () {
        const firstTr = this.rows[0]
        const {children} = firstTr
        let tr = document.createElement('tr')
        if (children[0].tagName === 'TH') {
            children.forEach(cell => {
                const td = document.createElement('td')
                td.innerHTML = cell.innerHTML
                tr.appendChild(td)
            })
            firstTr.innerHTML = tr.innerHTML
        }
    }

    // 靠左
    textAlignLeft () {
        const selectedCells = this.getSelectedCells()
        selectedCells.forEach(cell => {
            cell.style.textAlign = 'left'
        })
    }

    // 居中
    textAlignCenter () {
        const selectedCells = this.getSelectedCells()
        selectedCells.forEach(cell => {
            cell.style.textAlign = 'center'
        })
    }

    // 靠右
    textAlignRight () {
        const selectedCells = this.getSelectedCells()
        selectedCells.forEach(cell => {
            cell.style.textAlign = 'right'
        })
    }

    // 点击右键菜单项时
    menuClick = (e) => {
        const {target} = e
        const color1 = window.getComputedStyle(target).color
        const color2 = TableMergeCell.colorToRgb(this.opts.btnDisabledColor)
        if (color1 === color2) return
        const key = target.dataset.key
        const {row, col} = this.getCellIndex(this.contextmenuCell)
        switch (key) {
            case 'textAlignLeft':
                this.textAlignLeft()
                break
            case 'textAlignCenter':
                this.textAlignCenter()
                break
            case 'textAlignRight':
                this.textAlignRight()
                break
            case 'addBackgroundColor':
                this.addBackgroundColor()
                break
            case 'delBackgroundColor':
                this.delBackgroundColor()
                break
            case 'delTable':
                this.delTable()
                break
            case 'addRow':
                this.addRow(row)
                break
            case 'delRow':
                this.delRow(row)
                break
            case 'addCol':
                this.addCol(col)
                break
            case 'delCol':
                this.delCol(col)
                break
            case 'addTh':
                this.addTh()
                break
            case 'delTh':
                this.delTh()
                break
            case 'merge':
                this.mergeCell()
                break
            case 'unMerge':
                this.unMergeCell()
                break
        }
        if (this.menuEle) {
            this.menuEle.style.display = 'none'
        }
    }

    mousedown = (e) => {
        let {target, button} = e
        if (this.tableIsInTable(target) || TableMergeCell.isTheadChild(target) || button !== 0) return
        target = TableMergeCell.getTargetParentCell(target)
        const {tagName} = target
        if (tagName === 'TD' || tagName === 'TH') {
            this.ready = true
            this.cellStart = target
            this.indexStart = this.getCellIndex(target)
            this.removeClass()
            this.addClass(target)
        }
    }

    // 移除一些特征
    removeSomeNoSelfIsClicked = (e) => {
        const {target} = e
        // 隐藏右键菜单
        if (this.menuEle && !this.menuEle.contains(target)) {
            this.menuEle.style.display = 'none'
        }
        // 未点击表格时（且未点击右键菜单的添加背景色）移除高亮单元格
        const key = target.dataset.key
        if (!this.tableEle.contains(target) && key !== 'addBackgroundColor') {
            this.removeClass()
        }
        // 移除背景色设置输入框
        if (this.colorPicker) {
            this.colorPicker.remove()
        }
    }

    mousemove = (e) => {
        if (this.ready) {
            let {target} = e
            target = TableMergeCell.getTargetParentCell(target)
            if (!this.tableEle.contains(target)) return
            this.cellEnd = target
            this.indexEnd = this.getCellIndex(target)
            this.removeClass()
            this.highlightSelectedCells()
            const selection = window.getSelection()
            if (this.cellStart !== this.cellEnd) {
                selection.collapseToEnd()
            }
        }
    }

    mouseup = (e) => {
        let {target, button} = e
        if (button === 0 && this.ready) {
            target = TableMergeCell.getTargetParentCell(target)
            this.cellEnd = target
            this.indexEnd = this.getCellIndex(target)
            this.ready = false
            if (this.cellStart !== this.cellEnd) {
                TableMergeCell.focusEle && TableMergeCell.focusEle.focus()
            }
        }
    }

    tableClick = (e) => {
        const {target, button} = e
        if (button === 0 && target.tagName !== 'INPUT' && this.tableEle.contains(target)) {
            e.stopPropagation()
        }
    }

    contextmenu = (e) => {
        e.preventDefault()
        const {target, clientX, clientY} = e
        if (this.tableIsInTable(target)) return
        if (!this.menuEle) {
            this.menuEle = document.createElement('ul')
            this.menuEle.classList.add('tableMergeCell-contextmenu')
            this.menuEle.addEventListener('click', this.menuClick, false)

            this.menus.forEach(item => {
                const li = document.createElement('li')
                const {name, key} = item
                li.textContent = name
                li.dataset.key = key
                this[`btn_${key}`] = li
                this.menuEle.appendChild(li)
            })

            document.body.appendChild(this.menuEle)
            const {width, height} = this.menuEle.getBoundingClientRect()
            this.menuEle.dataset.width = width
            this.menuEle.dataset.height = height
        }
        
        const {clientWidth, clientHeight} = document.documentElement
        const {width, height} = this.menuEle.dataset
        const diffX = clientWidth - clientX
        const diffY = clientHeight - clientY
        if (diffX < width) {
            this.menuEle.style.right = '10px'
            this.menuEle.style.removeProperty('left')
        } else {
            this.menuEle.style.left = `${clientX}px`
            this.menuEle.style.removeProperty('right')
        }
        if (diffY < height) {
            this.menuEle.style.height = `${diffY - 10}px`
        } else {
            this.menuEle.style.removeProperty('height')
        }
        this.menuEle.style.top = `${clientY}px`
        this.menuEle.style.display = 'block'
        this.contextmenuCell = target
        this.handleMenuBtnMergeStatus(target)
        this.handleMenuBtnRowStatus(target)
        this.handleSomeMenuBtns(target)
    }

    copy = (e) => {
        e.preventDefault()
        let selectionStr = window.getSelection().toString()
        if (selectionStr) {
            if (e.clipboardData) {
                e.clipboardData.setData('text/plain', selectionStr)
            } else if (window.clipboardData) {
                window.clipboardData.setData('text', selectionStr)
            }
            TableMergeCell.copyedCellsArray = []
        } else {
            if (e.clipboardData) {
                e.clipboardData.setData('text/plain', '')
            } else if (window.clipboardData) {
                window.clipboardData.setData('text', '')
            }
            // 二维数组记录复制的单元格
            TableMergeCell.copyedCellsArray = this.getSelectedCells(true)
        }
    }

    handlePaste (targetCells, resourceCells) {
        if (!Array.isArray(targetCells) || !Array.isArray(resourceCells)) {
            throw new Error('粘贴单元格或复制单元格不是数组')
        }
        const tRowLen = targetCells.length
        const rRowLen = resourceCells.length
        const targetCell0 = targetCells[0]
        const resourceCell0 = resourceCells[0]
        if (!targetCell0) {
            throw new Error('粘贴的单元格未获取到第一行')
        }
        if (!resourceCell0) {
            throw new Error('复制的单元格未获取到第一行')
        }
        const tColLen = targetCell0.length
        const rColLen = resourceCell0.length
        if (tRowLen === rRowLen && tColLen === rColLen) { // 多对多（行列长度都相同）
            for (let i = 0; i < tRowLen; i++) {
                const tRow = targetCells[i]
                const rRow = resourceCells[i]
                for (let j = 0; j < tColLen; j++) {
                    const cellT = tRow[j]
                    const cellR = rRow[j]
                    if (!cellT || !cellR) continue
                    if (typeof cellR === 'string') {
                        cellT.innerText = cellR
                        continue
                    }
                    const {rowspan: rowspanT, colspan: colspanT} = this.getCellSpanProperty(cellT)
                    const {rowspan: rowspanR, colspan: colspanR} = this.getCellSpanProperty(cellR)
                    if (rowspanT === rowspanR && colspanT === colspanR) {
                        cellT.outerHTML = cellR.outerHTML
                    } else {
                        const cellRcopy = cellR.cloneNode(true)
                        if ((rowspanR > 1 || colspanR > 1) && (rowspanT <= 1 && colspanT <= 1)) {
                            cellRcopy.removeAttribute('rowspan')
                            cellRcopy.removeAttribute('colspan')
                            cellT.outerHTML = cellRcopy.outerHTML
                        } else if ((rowspanT > 1 || colspanT > 1) && (rowspanR <= 1 && colspanR <= 1)) {
                            cellRcopy.setAttribute('rowspan', rowspanT)
                            cellRcopy.setAttribute('colspan', colspanT)
                            cellT.outerHTML = cellRcopy.outerHTML
                        }
                    }
                }
            }
        } else if ((rRowLen > 1 || rColLen > 1) && tRowLen === 1 && tColLen === 1) { // 多对一
            const index = this.indexStart
            const pastedIndexRange = {
                indexStart: index,
                indexEnd: {
                    row: index.row + rRowLen - 1,
                    col: index.col + rColLen - 1,
                }
            }
            const rowStart = pastedIndexRange.indexStart.row
            const rowEnd = pastedIndexRange.indexEnd.row
            const colStart = pastedIndexRange.indexStart.col
            const colEnd = pastedIndexRange.indexEnd.col
            const {rows} = this
            for (let i = rowStart, k = 0; i <= rowEnd; i++, k++) {
                const row = rows[i]
                if (!row) continue
                const cells = row.children
                for (let j = colStart, h = 0; j <= colEnd; j++, h++) {
                    const cell = cells[j]
                    if (!cell) continue
                    const copyedOneItem = resourceCells[k][h]
                    if (!cell || !copyedOneItem) continue
                    if (typeof copyedOneItem === 'string') {
                        cell.innerText = copyedOneItem
                        continue
                    }
                    const {rowspan, colspan} = this.getCellSpanProperty(cell)
                    if (rowspan <= 1 && colspan <= 1) {
                        cell.outerHTML = copyedOneItem.outerHTML
                    }
                }
            }
        } else {
            Modal && Modal.confirm({
                title: '提示',
                content: '目前只支持两种模式：1、复制时选择的行列与粘贴时选择的行列相同（简称一对一或多对多）；2、复制时选择的行列不限，粘贴时只选一个单元格（简称多对一）；',
                zIndex: 10009,
            })
        }
    }

    paste = (e) => {
        const clipboardData = e.clipboardData || window.clipboardData
        const selectedCells = this.getSelectedCells(true)
        if (clipboardData.items.length > 1) {
            e.preventDefault()
            const data = clipboardData.getData('text')
            const excelData = TableMergeCell.handleExcelData(data)
            this.handlePaste(selectedCells, excelData)
        } else if (TableMergeCell.copyedCellsArray.length) {
            e.preventDefault()
            this.handlePaste(selectedCells, TableMergeCell.copyedCellsArray)
            this.indexStart = TableMergeCell.getIndexDefaultValue()
            this.indexEnd = TableMergeCell.getIndexDefaultValue()
        }
    }

    keydown = (e) => {
        const {key} = e
        if (key === 'Delete') {
            const selectedCells = this.getSelectedCells()
            selectedCells.forEach(cell => {
                cell.innerHTML = ''
            })
        }
    }

    addEvent () {
        window.addEventListener('mousedown', this.mousedown, false)
        window.addEventListener('mousedown', this.removeSomeNoSelfIsClicked, false)
        window.addEventListener('mousemove', this.mousemove, false)
        window.addEventListener('mouseup', this.mouseup, false)
        this.tableEle.addEventListener('click', this.tableClick, false)
        this.tableEle.addEventListener('contextmenu', this.contextmenu, false)
        window.addEventListener('copy', this.copy, false)
        window.addEventListener('paste', this.paste, false)
        window.addEventListener('keydown', this.keydown, true)
    }

    removeEvent () {
        window.removeEventListener('mousedown', this.mousedown, false)
        window.removeEventListener('mousedown', this.removeSomeNoSelfIsClicked, false)
        window.removeEventListener('mousemove', this.mousemove, false)
        window.removeEventListener('mouseup', this.mouseup, false)
        this.tableEle.removeEventListener('click', this.tableClick, false)
        this.tableEle.removeEventListener('contextmenu', this.contextmenu, false)
        window.removeEventListener('copy', this.copy, false)
        window.removeEventListener('paste', this.paste, false)
        window.removeEventListener('keydown', this.keydown, true)
    }
}

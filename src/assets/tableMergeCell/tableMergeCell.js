/* eslint-disable */
import {Modal} from 'ant-design-vue'
import 'ant-design-vue/lib/modal/style/css'
import {
    getCellSpanProperty, 
    getRowStart,
    getColEnd,
    getRowEnd,
    getColStart,
} from '../fn'
import {
    removeTableActiveCls,
} from '../tool'

const defaults = {
    btnDisabledColor: '#ddd',   // 右键菜单禁用时的颜色
    onAddCol: null,             // 添加列完成后回调
    onDelCol: null,             // 删除列完成后回调
    imgMinWidth: 20,            // 图片最小宽
}

export default class TableMergeCell {
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
                name: '复制表格',
                key: 'copyTable',
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
        this.addCellLocation()
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
        setTimeout(() => {
            this.colorPicker.click()
        }, 20)
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

    // 获取选取的单元格
    getSelectedCells (isTwoDimensionalArray = false) {
        const {indexStart, indexEnd} = this
        let selectedCells = []
        let selectedCellsTwoDimensionalArray = []
        const {rows} = this
        for (let i = indexStart.row; i <= indexEnd.row; i++) {
            const tr = rows[i]
            const {children} = tr
            let rowArray = []
            for (let j = indexStart.col; j <= indexEnd.col; j++) {
                const cell = children[j]
                selectedCells.push(cell)
                rowArray.push(cell)
            }
            if (rowArray.length) {
                selectedCellsTwoDimensionalArray.push(rowArray)
            }
        }
        return isTwoDimensionalArray ? selectedCellsTwoDimensionalArray : selectedCells
    }

    // 合并单元格
    mergeCell () {
        const {rows, indexStart, indexEnd} = this
        const firstCell = rows[indexStart.row].children[indexStart.col]
        for (let i = indexStart.row; i <= indexEnd.row; i++) {
            const tr = rows[i]
            const {children} = tr
            for (let j = indexStart.col; j <= indexEnd.col; j++) {
                const cell = children[j]
                if (cell.innerText && !firstCell.innerText) {
                    firstCell.innerHTML = cell.innerHTML
                }
                if (i === indexStart.row && j === indexStart.col) {
                    const rowspan = indexEnd.row - indexStart.row + 1
                    const colspan = indexEnd.col - indexStart.col + 1
                    cell.setAttribute('rowspan', rowspan)
                    cell.setAttribute('colspan', colspan)
                } else {
                    cell.removeAttribute('rowspan')
                    cell.removeAttribute('colspan')
                    cell.style.display = 'none'
                }
                this.removeClass(cell)
            }
        }
    }

    // 取消合并单元格
    unMergeCell () {
        const {rows, indexStart, indexEnd} = this
        for (let i = indexStart.row; i <= indexEnd.row; i++) {
            const tr = rows[i]
            const {children} = tr
            for (let j = indexStart.col; j <= indexEnd.col; j++) {
                const cell = children[j]
                if (cell.style.display === 'none') {
                    cell.style.display = 'table-cell'
                } else {
                    const {rowspan, colspan} = getCellSpanProperty(cell)
                    if (rowspan > 1) {
                        cell.removeAttribute('rowspan')
                    } 
                    if (colspan > 1) {
                        cell.removeAttribute('colspan')
                    }
                }
                this.removeClass(cell)
            }
        }
    }

    // 获取单元格行列索引
    getCellIndex (ele) {
        let index = {
            row: -1,
            col: -1,
        }
        for (let i = 0; i < this.maxRowCount; i++) {
            const tr = this.rows[i]
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
        
        return index
    }

    // 获取是否是合并过的单元格
    getIsMergedCellBool (cell) {
        const {rowspan, colspan} = getCellSpanProperty(cell)
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

    // 控制右键菜单行按钮是否可点击
    handleMenuBtnRowStatus (target) {
        const {btnDisabledColor} = this.opts
        if (target.tagName === 'TH') {
            this.btn_addRow.style.color = btnDisabledColor
        } else {
            this.btn_addRow.style.removeProperty('color')
        }
        const {rowspan, colspan} = getCellSpanProperty(target)
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

            this.btn_addRow.style.removeProperty('color')
            this.btn_delRow.style.removeProperty('color')
            this.btn_addCol.style.removeProperty('color')
            this.btn_delCol.style.removeProperty('color')

            this.btn_addTh.style.removeProperty('color')
            this.btn_delTh.style.removeProperty('color')

            this.btn_merge.style.removeProperty('color')
            this.btn_unMerge.style.removeProperty('color')
        } else {
            this.btn_addBackgroundColor.style.color = btnDisabledColor
            this.btn_delBackgroundColor.style.color = btnDisabledColor
            this.btn_textAlignLeft.style.color = btnDisabledColor
            this.btn_textAlignCenter.style.color = btnDisabledColor
            this.btn_textAlignRight.style.color = btnDisabledColor

            this.btn_addRow.style.color = btnDisabledColor
            this.btn_delRow.style.color = btnDisabledColor
            this.btn_addCol.style.color = btnDisabledColor
            this.btn_delCol.style.color = btnDisabledColor

            this.btn_addTh.style.color = btnDisabledColor
            this.btn_delTh.style.color = btnDisabledColor

            this.btn_merge.style.color = btnDisabledColor
            this.btn_unMerge.style.color = btnDisabledColor
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
                const {colspan} = getCellSpanProperty(cell)
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
            const {rowspan, colspan} = getCellSpanProperty(cell)
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
                const {rowspan} = getCellSpanProperty(cell)
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
            cell.insertAdjacentHTML('beforebegin', '<td></td>')
        }

        rows.forEach((row, rowIndex) => {
            const cells = row.children
            cells.forEach((cell, cellIndex) => {
                const {rowspan, colspan} = getCellSpanProperty(cell)
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

        onAddCol && onAddCol(index)
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
        const {rowspan} = getCellSpanProperty(cell)
        cell.setAttribute('rowspan', rowspan - 1)
    }

    // 删除第一行
    delFirstRow (rows, col, cell, index) {
        const {rowspan, colspan} = getCellSpanProperty(cell)
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
                const {colspan} = getCellSpanProperty(cell)
                if (colspan > 1 && index >= cellIndex && index <= cellIndex + colspan - 1) {
                    relatedCellsArray.push(cell)
                }
            })
        })
        return relatedCellsArray
    }

    // 删除非第一列
    delOtherCol (cell) {
        const {colspan} = getCellSpanProperty(cell)
        cell.setAttribute('colspan', colspan - 1)
    }

    // 删除第一列
    delFirstCol (cell) {
        const {rowspan, colspan} = getCellSpanProperty(cell)
        const nextCell = cell.nextElementSibling
        nextCell.setAttribute('colspan', colspan - 1)
        nextCell.setAttribute('rowspan', rowspan)
        nextCell.style.display = 'table-cell'
    }

    // 删除列
    delCol (index) {
        const {onDelCol} = this.opts
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
        onDelCol && onDelCol(index)
    }

    // 设置表头
    addTh () {
        const {rows} = this
        for (let i = this.indexStart.row; i <= this.indexEnd.row; i++) {
            const tr = rows[i]
            const {children} = tr
            for (let j = this.indexStart.col; j <= this.indexEnd.col; j++) {
                const cell = children[j]
                cell.style.borderBottom = '2px solid #ccc'
                cell.style.textAlign = 'center'
                cell.style.backgroundColor = '#f1f1f1'
                cell.style.fontWeight = 'bold'
            }
        }
    }

    // 取消表头
    delTh () {
        const {rows} = this
        for (let i = this.indexStart.row; i <= this.indexEnd.row; i++) {
            const tr = rows[i]
            const {children} = tr
            for (let j = this.indexStart.col; j <= this.indexEnd.col; j++) {
                const cell = children[j]
                cell.style.removeProperty('border-bottom')
                cell.style.removeProperty('text-align')
                cell.style.removeProperty('background-color')
                cell.style.removeProperty('font-weight')
            }
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

    copyTable () {
        // console.log('复制表格，localStorage缓存表格数据，并执行document.execCommand(copy)命令')
        this.removeClass()
        removeTableActiveCls()
        this.tableEle.classList.add('tableMergeCell_active')
        window.localStorage.setItem('tableMergeCell_active', this.tableEle.outerHTML)
        if (this.tableEle.classList.contains('tableMergeCell_active')) {
            const htmlStr = ' '
            const input = document.createElement('INPUT')
            input.style.opacity  = 0
            input.style.position = 'absolute'
            input.style.left = '-100000px'
            document.body.appendChild(input)
            input.value = htmlStr
            input.select()
            input.setSelectionRange(0, htmlStr.length)
            document.execCommand('copy')
            document.body.removeChild(input)
        }
    }

    activeTable () {
        const {rows} = this
        const firstTr = rows[0]
        const lastTr = rows[rows.length - 1]
        const firstTd = firstTr.firstElementChild
        const lastTd = lastTr.lastElementChild
        if (firstTd == this.cellStart && lastTd == this.cellEnd) {
            // console.log('select all')
            // this.copyTable()
            return true
        }
        return false
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
            case 'copyTable':
                this.copyTable()
                break
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
        if ((this.imgMasklayer && this.imgMasklayer.contains(target)) || target.tagName === 'IMG') return
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
        if (target && !this.tableEle.contains(target) && key !== 'addBackgroundColor' && !target.className.includes('tableMergeCell-contextmenu')) {
            this.removeClass()
        }
        // 移除背景色设置输入框
        if (this.colorPicker) {
            this.colorPicker.remove()
        }
        if (this.imgMasklayer && !this.imgMasklayer.contains(target)) {
            this.imgMasklayer.removeEventListener('click', this.handleImgBtn, false)
            this.imgMasklayer.removeEventListener('keydown', this.handleImgEnter, false)
            this.imgMasklayer.insertAdjacentElement('beforebegin', this.selectedImg)
            this.imgMasklayer.remove()
        }
        // 移除复制表格时的边框
        if (target && !this.tableEle.contains(target)) {
            removeTableActiveCls()
        }
    }

    mousemove = (e) => {
        // e.preventDefault()
        let {target} = e
        target = TableMergeCell.getTargetParentCell(target)
        if (this.ready && this.tableEle.contains(target)) {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                // const {rowspan, colspan} = getCellSpanProperty(target)
                // if (rowspan > 1 || colspan > 1) return
                this.cellEnd = target
                this.indexEnd = this.getCellIndex(target)
                // this.removeClass()
                const selection = window.getSelection()
                if (this.cellStart !== this.cellEnd) {
                    selection.collapseToEnd()
                }
            }, 1000 / 60)
        }
    }

    highlightRangeCells () {
        // console.log(this.indexStart, this.indexEnd)
        const {rows} = this
        for (let i = this.indexStart.row; i <= this.indexEnd.row; i++) {
            const tr = rows[i]
            const {children} = tr
            for (let j = this.indexStart.col; j <= this.indexEnd.col; j++) {
                const cell = children[j]
                // console.log(i, j, cell)
                this.addClass(cell)
            }
        }
    }

    handleIndexSerial () {
        const {row: rowStart, col: colStart} = this.indexStart
        const {row: rowEnd, col: colEnd} = this.indexEnd
        if (rowStart > rowEnd) {
            this.indexStart.row = rowEnd
            this.indexEnd.row = rowStart
        }
        if (colStart > colEnd) {
            this.indexStart.col = colEnd
            this.indexEnd.col = colStart
        }
    }

    updateIndex () {
        const {rows, indexStart, indexEnd} = this
        // console.log(indexStart, indexEnd)
        this.indexStart.row = getRowStart(rows, indexStart.row, indexEnd.row, indexStart.col, indexEnd.col)
        this.indexStart.col = getColStart(rows, indexStart.row, indexEnd.row, indexStart.col, indexEnd.col)
        this.indexEnd.row = getRowEnd(rows, indexStart.row, indexEnd.row, indexStart.col, indexEnd.col)
        this.indexEnd.col = getColEnd(rows, indexStart.row, indexEnd.row, indexStart.col, indexEnd.col)
        // console.log(indexStart, indexEnd)
    }

    makeSelectedCellsToRect () {
        if (this.indexEnd.row < 0 || this.indexEnd.col < 0) return
        this.handleIndexSerial()
        let count = 1, maxLoop = 10
        while (count <= maxLoop) {
            const {row: _rowStart, col: _colStart} = this.indexStart
            const {row: _rowEnd, col: _colEnd} = this.indexEnd
            // console.log('updateBefore', _rowStart, _colStart, _rowEnd, _colEnd)
            this.updateIndex()
            // console.log(`update count: ${count}`, this.indexStart, this.indexEnd)
            if (this.indexStart.row === _rowStart && 
                this.indexEnd.row === _rowEnd && 
                this.indexStart.col === _colStart && 
                this.indexEnd.col === _colEnd) {
                count = maxLoop
            }
            count++
        }
        this.highlightRangeCells()
    }

    mouseup = (e) => {
        let {target, button} = e
        if (button === 0 && this.ready) {
            target = TableMergeCell.getTargetParentCell(target)
            if (this.tBody.contains(target)) {
                this.cellEnd = target
                this.indexEnd = this.getCellIndex(target)
                this.addClass(target)
                this.makeSelectedCellsToRect()
                this.activeTable()
            }
            this.ready = false
        }
    }

    tableClick = (e) => {
        const {target, button} = e
        const {tagName} = target
        if (button === 0 && this.tableEle.contains(target)) {
            e.stopPropagation()
        }
        if (tagName === 'A') {
            const href = target.getAttribute('href')
            window.open(href)
        }
        if (tagName === 'IMG') {
            this.handleImg(target)
        }
    }

    contextmenu = (e) => {
        const {target, clientX, clientY} = e
        if (target.tagName === 'IMG') return
        e.preventDefault()
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
            this.menuEle.style.marginLeft = `-${width}px`
        } else {
            this.menuEle.style.marginLeft = 'auto'
        }
        if (diffY < height) {
            this.menuEle.style.marginTop = `-${height}px`
        } else {
            this.menuEle.style.marginTop = 'auto'
        }
        this.menuEle.style.top = `${clientY}px`
        this.menuEle.style.left = `${clientX}px`
        this.menuEle.style.display = 'block'
        this.contextmenuCell = TableMergeCell.getTargetParentCell(target)
        this.handleMenuBtnRowStatus(target)
        this.handleSomeMenuBtns(target)
    }

    copy = (e) => {
        const selectionStr = window.getSelection().toString()
        const isActiveTable = this.activeTable()
        const copyedCellsArray = this.getSelectedCells(true)
        removeTableActiveCls()
        if (selectionStr) {
            e.stopPropagation()
            // console.log('表格监听复制命令，清空拷贝的单元格数据')
        } else if (isActiveTable) {
            this.copyTable()
        } else if (Array.isArray(copyedCellsArray)) {
            e.stopPropagation()
            e.preventDefault()
            // console.log('复制单元格并清空剪切版')
            if (e.clipboardData) {
                e.clipboardData.setData('text/plain', '')
            } else if (window.clipboardData) {
                window.clipboardData.setData('text', '')
            }
            // 二维数组记录复制的单元格
            TableMergeCell.copyedCellsArray = copyedCellsArray
        }
    }

    handlePaste (originCells) {
        if (!Array.isArray(originCells)) {
            throw new Error('请传入复制的单元格')
        }
        const {rows} = this
        for (let i1 = 0, i2 = this.indexStart.row; i1 < originCells.length; i1++, i2++) {
            const tr_o = originCells[i1]
            const tr_t = rows[i2]
            if (!tr_t) break
            const children_t = tr_t.children
            for (let j1 = 0, j2 = this.indexStart.col; j1 < tr_o.length; j1++, j2++) {
                const cell_o = tr_o[j1]
                const cell_t = children_t[j2]
                if (!cell_t) continue
                if (typeof cell_o === 'string') {
                    cell_t.innerText = cell_o
                    continue
                }
                const {display: display_t} = cell_t.style
                const {display: display_o} = cell_o.style
                if (display_t === display_o) {
                    cell_t.innerHTML = cell_o.innerHTML
                    cell_t.setAttribute('style', cell_o.getAttribute('style'))
                }
            }
        }
    }

    paste = (e) => {
        const clipboardData = e.clipboardData || window.clipboardData
        const data = clipboardData.getData('text')
        if (clipboardData.items.length > 2) {
            e.preventDefault()
            e.stopPropagation()
            const excelData = TableMergeCell.handleExcelData(data)
            this.handlePaste(excelData)
        } else if (TableMergeCell.copyedCellsArray.length) {
            if (!data) {
                e.preventDefault()
                this.handlePaste(TableMergeCell.copyedCellsArray)
                this.indexStart = TableMergeCell.getIndexDefaultValue()
                this.indexEnd = TableMergeCell.getIndexDefaultValue()
            } 
        }
    }

    keydown = (e) => {
        const {key} = e
        if (key === 'Delete') {
            const selectedCells = this.tableEle.querySelectorAll('.tableMergeCell-selected')
            selectedCells.forEach(cell => {
                cell.innerHTML = ''
            })
        }
    }

    handleImg (target) {
        this.selectedImg = target
        // this.selectedImg.style.removeProperty('max-width')
        const {width, height} = this.selectedImg.getBoundingClientRect()
        this.imgOriginWidth = width
        this.selectedImg.insertAdjacentHTML('beforebegin', `
            <div contenteditable="false" class="tableMergeCell-imgTooltip" style="width: ${width}px; height: ${height}px;">
                <span class="tableMergeCell-imgInputWrap">
                    <input value="${width}px" class="tableMergeCell-imgInput" title="调整图片至特定宽度">
                    <button type="button" class="tableMergeCell-imgBtn">确定</button>
                </span>
            </div>`
        )
        this.imgMasklayer = this.tableEle.querySelector('.tableMergeCell-imgTooltip')
        this.imgMasklayer.insertAdjacentElement('afterbegin', this.selectedImg)
        if (this.imgMasklayer) {
            this.imgMasklayer.addEventListener('click', this.handleImgBtn, false)
            this.imgMasklayer.addEventListener('keydown', this.handleImgEnter, false)
        }
    }

    handleImgEnter = (e) => {
        const {key, target} = e
        if (key === 'Enter' && target.className.includes('tableMergeCell-imgInput')) {
            this.handleImgWidth(target)
        }
    }

    handleImgBtn = (e) => {
        const {target} = e
        if (target.className.includes('tableMergeCell-imgBtn')) {
            const preElement = target.previousElementSibling
            this.handleImgWidth(preElement)
        }
    }

    handleImgWidth (inputEle) {
        const value = inputEle.value
        const {imgMinWidth} = this.opts
        let newWidth
        if (/^\d+/.test(value)) {
            newWidth = Number.parseInt(value)
        } else {
            inputEle.value = `${this.imgOriginWidth}px`
        }
        if (newWidth < imgMinWidth) {
            Modal && Modal.confirm({
                title: '提示',
                content: `图片最小宽为${imgMinWidth}像素！`,
                zIndex: 10009,
            })
            return
        }
        const getTargetParentCell = (target) => {
            while (target.tagName !== 'TD' && target.parentNode) {
                target = target.parentNode
            }
            return target
        }
        const td = getTargetParentCell(this.imgMasklayer)
        if (td && td.tagName === 'TD') {
            const {width, paddingRight, paddingLeft, borderRightWidth} = window.getComputedStyle(td)
            const maxW = Number.parseFloat(width) - Number.parseFloat(paddingRight) - Number.parseFloat(paddingLeft) - Number.parseFloat(borderRightWidth)
            if (newWidth > maxW) {
                Modal && Modal.confirm({
                    title: '提示',
                    content: '图片的宽不能超过单元格的宽，请先调整列宽到合适的宽度！',
                    zIndex: 10009,
                })
                return
            }
        }
        if (typeof newWidth === 'number' && newWidth !== this.imgOriginWidth) {
            this.selectedImg.style.width = `${newWidth}px`
            const {width, height} = this.selectedImg.getBoundingClientRect()
            this.imgMasklayer.style.width = `${width}px`
            this.imgMasklayer.style.height = `${height}px`
        }
        if (this.imgMasklayer) {
            this.imgMasklayer.removeEventListener('click', this.handleImgBtn, false)
            this.imgMasklayer.removeEventListener('keydown', this.handleImgEnter, false)
            this.imgMasklayer.insertAdjacentElement('beforebegin', this.selectedImg)
            this.imgMasklayer.remove()
        }
    }

    addEvent () {
        this.tableEle.addEventListener('mousedown', this.mousedown, false)
        window.addEventListener('mousemove', this.mousemove, false)
        window.addEventListener('mouseup', this.mouseup, false)
        this.tableEle.addEventListener('click', this.tableClick, false)
        this.tableEle.addEventListener('contextmenu', this.contextmenu, false)
        this.tableEle.addEventListener('copy', this.copy, false)
        this.tableEle.addEventListener('paste', this.paste, false)
        window.addEventListener('mousedown', this.removeSomeNoSelfIsClicked, true)
        window.addEventListener('keydown', this.keydown, true)
    }

    removeEvent () {
        this.tableEle.removeEventListener('mousedown', this.mousedown, false)
        window.removeEventListener('mousemove', this.mousemove, false)
        window.removeEventListener('mouseup', this.mouseup, false)
        this.tableEle.removeEventListener('click', this.tableClick, false)
        this.tableEle.removeEventListener('contextmenu', this.contextmenu, false)
        this.tableEle.removeEventListener('copy', this.copy, false)
        this.tableEle.removeEventListener('paste', this.paste, false)
        window.removeEventListener('mousedown', this.removeSomeNoSelfIsClicked, true)
        window.removeEventListener('keydown', this.keydown, true)
    }
}

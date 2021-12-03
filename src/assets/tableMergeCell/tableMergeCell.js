/* eslint-disable */
const defaults = {
    btnDisabledColor: '#ddd', // 右键菜单禁用时的颜色
    onAddCol: null,             // 添加列完成后回调
}

export default class TableMergeCell {
    constructor (tableEle, options = {}) {
        this.opts = Object.assign({}, defaults, options)
        this.tableEle = tableEle
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
                name: '合并单元格',
                key: 'merge',
            }, 
            {
                name: '取消合并单元格',
                key: 'unMerge',
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
        this.indexStart = {
            row: -1,
            col: -1,
        }
        this.indexEnd = {
            row: -1,
            col: -1,
        }
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

    // 添加调试坐标
    addCellLocation () {
        const {rows} = this.tableEle.tBodies[0]
        rows.forEach((row, i) => {
            const cells = row.children
            cells.forEach((cell, j) => {
                cell.textContent = i + '-' + j
            })
        })
    }

    // 同步最大行数和最大列数
    syncMaxRowAndColCount () {
        const {rows} = this.tableEle.tBodies[0]
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
        const {rows} = this.tableEle.tBodies[0]
        const isValid = this.selectedCellsIsValid(rows)
        if (!isValid) return
        const selectedCells = this.getSelectedCells()
        selectedCells.forEach(ele => {
            this.addClass(ele)
        })
    }

    // 获取选取的单元格
    getSelectedCells () {
        const {indexStart, indexEnd} = this
        let selectedCells = []
        const {rows} = this.tableEle.tBodies[0]
        for (let i = 0; i < this.maxRowCount; i++) {
            const tr = rows[i]
            const {children} = tr
            const childLen = children.length
            for (let j = 0; j < childLen; j++) {
                const cell = children[j]
                if (i >= indexStart.row && i <= indexEnd.row && j >= indexStart.col && j <= indexEnd.col) {
                    selectedCells.push(cell)
                } 
            }
        }
        return selectedCells
    }

    // 判断选取的单元格是否有效
    selectedCellsIsValid () {
        const cellStart_rowspan = this.cellStart.getAttribute('rowspan')
        const cellEnd_rowspan = this.cellEnd && this.cellEnd.getAttribute('rowspan')
        if (cellStart_rowspan || cellEnd_rowspan) {
            // console.log('不符合合并规则：选中区域不能包含已合并的单元格。')
            return false
        } 
        const selectedCells = this.getSelectedCells()
        const isInvalid = Array.from(selectedCells).some(ele => {
            return ele.style.display === 'none' || this.getIsMergedCellBool(ele)
        })
        if (isInvalid) {
            // console.log('不符合合并规则：不能有隐藏的单元格或合并的单元格。')
            return false
        }
        return true
    }

    // 合并单元格
    mergeCell = () => {
        const selectedCells = this.getSelectedCells()
        const {indexStart, indexEnd} = this
        const rowspan = indexEnd.row - indexStart.row + 1
        const colspan = indexEnd.col - indexStart.col + 1
        Array.from(selectedCells).forEach((ele, index) => {
            if (index === 0) {
                ele.setAttribute('rowspan', rowspan)
                ele.setAttribute('colspan', colspan)
            } else {
                ele.style.display = 'none'
            }
            this.removeClass(ele)
        })
    }

    // 取消合并单元格
    unMergeCell = (cell) => {
        let cellSpanProperty = null
        if (cell) {
            this.indexStart = this.getCellIndex(cell)
            cellSpanProperty = this.getCellSpanProperty(cell)
        } else {
            this.indexStart = this.getCellIndex(this.contextmenuCell)
            cellSpanProperty = this.getCellSpanProperty(this.contextmenuCell)
        }
        this.indexEnd = {
            row: cellSpanProperty.rowspan - 1 + this.indexStart.row,
            col: cellSpanProperty.colspan - 1 + this.indexStart.col,
        }
        const selectedCells = this.getSelectedCells()
        Array.from(selectedCells).forEach((ele, index) => {
            if (index === 0) {
                ele.removeAttribute('rowspan')
                ele.removeAttribute('colspan')
            } else {
                ele.style.display = 'table-cell'
            }
            this.removeClass(ele)
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
        const {rows} = this.tableEle.tBodies[0]
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
        return {
            rowspan: cell.getAttribute('rowspan') * 1,
            colspan: cell.getAttribute('colspan') * 1,
        }
    }

    // 获取是否是合并过的单元格
    getIsMergedCellBool (cell) {
        const {rowspan, colspan} = this.getCellSpanProperty(cell)
        const maxCount = Math.max(rowspan, colspan)
        return maxCount > 1
    }

    // 控制右键菜单合并按钮是否可点击
    handleMenuBtnMergeStatus (cell) {
        const {btnDisabledColor} = this.opts
        this.isMergedCell = this.getIsMergedCellBool(cell)
        /**
        * 1.开始选中的单元格是否等于最后选中的单元格
        * 2.是否合并
        * 3.直接右键点击，未选中单元格时的情况
        */

        if ((this.cellStart === this.cellEnd || !cell.className.includes(this.selectedCellClassName)) && !cell.getAttribute('rowspan')) {
            this.btn_merge.style.color = btnDisabledColor
            this.btn_merge.style.pointerEvents = 'none'
            this.btn_unMerge.style.color = btnDisabledColor
            this.btn_unMerge.style.pointerEvents = 'none'
        } else if (this.getIsMergedCellBool(cell)) {
            this.btn_merge.style.color = btnDisabledColor
            this.btn_merge.style.pointerEvents = 'none'
            this.btn_unMerge.style.color = 'inherit'
            this.btn_unMerge.style.pointerEvents = 'auto'
        } else {
            this.btn_merge.style.color = 'inherit'
            this.btn_merge.style.pointerEvents = 'auto'
            this.btn_unMerge.style.color = btnDisabledColor
            this.btn_unMerge.style.pointerEvents = 'none'
        }
    }

    // 控制右键菜单行按钮是否可点击
    handleMenuBtnRowStatus (target) {
        const {btnDisabledColor} = this.opts
        if (target.tagName === 'TH') {
            this.btn_addRow.style.color = btnDisabledColor
            this.btn_addRow.style.pointerEvents = 'none'
        } else {
            this.btn_addRow.style.color = 'inherit'
            this.btn_addRow.style.pointerEvents = 'auto'
        }
        const {rowspan, colspan} = this.getCellSpanProperty(target)
        if (rowspan > 1 || colspan > 1) {
            this.btn_delRow.style.color = btnDisabledColor
            this.btn_delRow.style.pointerEvents = 'none'
            this.btn_delCol.style.color = btnDisabledColor
            this.btn_delCol.style.pointerEvents = 'none'
        } else {
            this.btn_delRow.style.color = 'inherit'
            this.btn_delRow.style.pointerEvents = 'auto'
            this.btn_delCol.style.color = 'inherit'
            this.btn_delCol.style.pointerEvents = 'auto'
        }
    }

    // 根据类名获取选取的单元格
    getSelectedCellsByClassName () {
        return Array.from(this.tableEle.querySelectorAll(`.${this.selectedCellClassName}`))
    }

    // 当未选取单元格时，控制部分右键菜单项是否可点击
    handleSomeMenuBtns (target) {
        const {btnDisabledColor} = this.opts
        const selectedCells = this.getSelectedCellsByClassName()
        if (selectedCells.length) {
            this.btn_textAlignLeft.style.color = 'inherit'
            this.btn_textAlignLeft.style.pointerEvents = 'auto'
            this.btn_textAlignCenter.style.color = 'inherit'
            this.btn_textAlignCenter.style.pointerEvents = 'auto'
            this.btn_textAlignRight.style.color = 'inherit'
            this.btn_textAlignRight.style.pointerEvents = 'auto'
            this.btn_addBackgroundColor.style.color = 'inherit'
            this.btn_addBackgroundColor.style.pointerEvents = 'auto'
            this.btn_delBackgroundColor.style.color = 'inherit'
            this.btn_delBackgroundColor.style.pointerEvents = 'auto'
        } else {
            this.btn_addBackgroundColor.style.color = btnDisabledColor
            this.btn_addBackgroundColor.style.pointerEvents = 'none'
            this.btn_delBackgroundColor.style.color = btnDisabledColor
            this.btn_delBackgroundColor.style.pointerEvents = 'none'
            this.btn_textAlignLeft.style.color = btnDisabledColor
            this.btn_textAlignLeft.style.pointerEvents = 'none'
            this.btn_textAlignCenter.style.color = btnDisabledColor
            this.btn_textAlignCenter.style.pointerEvents = 'none'
            this.btn_textAlignRight.style.color = btnDisabledColor
            this.btn_textAlignRight.style.pointerEvents = 'none'
        }
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

    // 控制删除的列与关联列的关系
    handleMergedCellByDelCol (index) {
        const {rows} = this.tableEle.tBodies[0]
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
        /*this.$confirm({
            title: '删除确认？',
            content: '您确认删除表格吗？',
            zIndex: 10009,
            onOk () {
                console.log('ok')
            },
            onCancel () {
                console.log('cancel')
            },
        })*/
        this.tableEle.remove()
    }

    // 删除空表格
    delEmptyTable () {
        const {rows} = this.tableEle.tBodies[0]
        if (!rows.length || !rows[0].children.length) {
            this.delTable()
        }
    }

    // 上面添加一行
    addRow (index) {
        const {maxColCount} = this
        const tBody = this.tableEle.tBodies[0]
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
        const {rows} = this.tableEle.tBodies[0]
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
        const {rows} = this.tableEle.tBodies[0]
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
        const tBody = this.tableEle.tBodies[0]
        const {rows} = tBody
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
        const {rows} = this.tableEle.tBodies[0]
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
        const tBody = this.tableEle.tBodies[0]
        const {rows} = tBody
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
        const firstTr = this.tableEle.tBodies[0].rows[0]
        const {children} = firstTr
        let tr = document.createElement('tr')
        if (children[0].tagName === 'TD') {
            const len = children.length
            for (let i = 0; i < len; i++) {
                const cell = children[i]
                if (this.getIsMergedCellBool(cell)) {
                    alert('请先取消第一行合并的单元格！')
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
        const firstTr = this.tableEle.tBodies[0].rows[0]
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

    // 隐藏右键菜单
    hideMenuEleSelfIsClicked = () => {
        if (this.menuEle) {
            this.menuEle.style.display = 'none'
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
        const key = target.dataset.key
        const {row, col} = this.getCellIndex(this.contextmenuCell)
        switch (key) {
            case 'textAlignLeft':
                console.log('靠左')
                this.textAlignLeft()
                break
            case 'textAlignCenter':
                console.log('居中')
                this.textAlignCenter()
                break
            case 'textAlignRight':
                console.log('靠右')
                this.textAlignRight()
                break
            case 'addBackgroundColor':
                console.log('设置背景色')
                this.addBackgroundColor()
                break
            case 'delBackgroundColor':
                console.log('删除背景色')
                this.delBackgroundColor()
                break
            case 'delTable':
                console.log('删除表格')
                this.delTable()
                break
            case 'addRow':
                console.log('添加行')
                this.addRow(row)
                break
            case 'delRow':
                console.log('删除行')
                this.delRow(row)
                break
            case 'addCol':
                console.log('添加列')
                this.addCol(col)
                break
            case 'delCol':
                console.log('删除列')
                this.delCol(col)
                break
            case 'addTh':
                console.log('设置表头')
                this.addTh()
                break
            case 'delTh':
                console.log('取消表头')
                this.delTh()
                break
            case 'merge':
                console.log('合并单元格')
                this.mergeCell()
                break
            case 'unMerge':
                console.log('取消合并单元格')
                this.unMergeCell()
                break
        }
        if (target.style.pointerEvents !== 'none') {
            this.hideMenuEleSelfIsClicked()
        }
    }

    mousedown = (e) => {
        const {target, button} = e
        if (this.tableIsInTable(target) || button !== 0) return
        const {tagName} = target
        if (tagName === 'TD' || tagName === 'TH') {
            this.ready = true
            this.cellStart = target
            this.indexStart = this.getCellIndex(target)
            this.removeClass()
            this.addClass(target)
        }
    }

    mousemove = (e) => {
        if (this.ready) {
            const {target} = e
            this.cellEnd = target
            this.indexEnd = this.getCellIndex(target)
            this.removeClass()
            this.highlightSelectedCells()
            /*const selObj = window.getSelection()
            if (this.cellStart !== this.cellEnd) {
                selObj.collapseToEnd()
            }*/
        }
    }

    /*mouseleave = () => {
        this.ready = false
    }*/

    mouseup = (e) => {
        const {target, button} = e
        if (button === 0 && this.ready) {
            this.cellEnd = target
            this.indexEnd = this.getCellIndex(target)
            this.ready = false
        }
    }

    tableClick = (e) => {
        const {target, button} = e
        if (button === 0 && target.tagName !== 'INPUT' && this.tableEle.contains(target)) {
            e.stopPropagation()
        }
    }

    tableIsInTable (target) {
        while (target && target.tagName !== 'TABLE') {
            target = target.parentNode
        }
        return this.tableEle !== target && this.tableEle.contains(target)
    }

    contextmenu = (e) => {
        e.preventDefault()
        const {target} = e
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
        }
        const {clientX, clientY} = e
        this.menuEle.style.display = 'block'
        this.menuEle.style.top = `${clientY}px`
        this.menuEle.style.left = `${clientX}px`
        this.contextmenuCell = target
        this.handleMenuBtnMergeStatus(target)
        this.handleMenuBtnRowStatus(target)
        this.handleSomeMenuBtns(target)
    }

    // 移除一些特征
    removeSomeNoSelfIsClicked = (e) => {
        const {target} = e
        // 隐藏右键菜单
        if (this.menuEle && !this.menuEle.contains(target)) {
            this.menuEle.style.display = 'none'
        }
        // 移除高亮单元格
        const key = target.dataset.key
        if (!this.tableEle.contains(target) && key !== 'addBackgroundColor') {
            /*const selectedCells = this.getSelectedCells()
            selectedCells.forEach(cell => {
                this.removeClass(cell)
            })*/
            this.removeClass()
        }
        // 移除背景色设置输入框
        if (this.colorPicker) {
            this.colorPicker.remove()
        }
    }

    addEvent () {
        window.addEventListener('mousedown', this.mousedown, false)
        window.addEventListener('mousemove', this.mousemove, false)
        // window.addEventListener('mouseleave', this.mouseleave, false)
        window.addEventListener('mouseup', this.mouseup, false)
        this.tableEle.addEventListener('click', this.tableClick, false)
        this.tableEle.addEventListener('contextmenu', this.contextmenu, false)
        window.addEventListener('mousedown', this.removeSomeNoSelfIsClicked, false)
    }

    removeEvent () {
        window.removeEventListener('mousedown', this.mousedown, false)
        window.removeEventListener('mousemove', this.mousemove, false)
        // window.removeEventListener('mouseleave', this.mouseleave, false)
        window.removeEventListener('mouseup', this.mouseup, false)
        this.tableEle.removeEventListener('click', this.tableClick, false)
        this.tableEle.removeEventListener('contextmenu', this.contextmenu, false)
        window.removeEventListener('mousedown', this.removeSomeNoSelfIsClicked, false)
    }
}

/* eslint-disable */
class TableMergeCell {
    
    constructor (tableEle) {
        this.tableEle = tableEle
        this.menuEle = null
        this.tableClassName = 'tableMergeCell'
        this.selected = 'selected'
        this.ready = false
        this.cellStart = null
        this.cellEnd = null
        this.init()
    }

    init () {
        if (!this.tableEle || this.tableEle.ELEMENT_NODE !== 1 || this.tableEle.tagName !== 'TABLE') {
            throw new Error('请传入table元素！')
        }
        this.tableEle.classList.add(this.tableClassName)
        this.addEvent()
    }

    destroy () {
        this.removeEvent()
    }

    addClass (cell) {
        if (!cell.className.includes(this.selected)) {
            cell.classList.add(this.selected)
        }
    }

    removeClass (cell) {
        if (cell) {
            cell.classList.remove(this.selected)
            if (cell.className === '') {
                cell.removeAttribute('class')
            }
        } else {
            const selected = this.tableEle.querySelectorAll('.selected')
            if (selected.length) {
                selected.forEach(item => {
                    item.classList.remove(this.selected)
                    if (item.className === '') {
                        item.removeAttribute('class')
                    }
                })
            }  
        }
    }

    getCellIndex (ele) {
        const trs = this.tableEle.querySelectorAll('tr')
        const trLen = trs.length
        let index = {
            row: -1,
            col: -1,
        }
        for (let i = 0; i < trLen; i++) {
            const tr = trs[i]
            const {children} = tr
            const childLen = children.length
            for (let j = 0; j < childLen; j++) {
                const cell = children[j]
                // console.log(cell, ele)
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

    highlightSelectedCells () {
        const trs = this.tableEle.querySelectorAll('tr')
        const isValid = this.selectedCellsIsValid(trs)
        if (!isValid) return
        const trLen = trs.length
        const {indexStart, indexEnd} = this
        for (let i = 0; i < trLen; i++) {
            const tr = trs[i]
            const {children} = tr
            const childLen = children.length
            for (let j = 0; j < childLen; j++) {
                const cell = children[j]
                if (i >= indexStart.row && i <= indexEnd.row && j >= indexStart.col && j <= indexEnd.col) {
                    this.addClass(cell)
                } else {
                    this.removeClass(cell)
                }
            }
        }
    }

    getSelectedCells () {
        const {indexStart, indexEnd} = this
        let selectedEles = []
        const trs = this.tableEle.querySelectorAll('tr')
        const trLen = trs.length
        for (let i = 0; i < trLen; i++) {
            const tr = trs[i]
            const {children} = tr
            const childLen = children.length
            for (let j = 0; j < childLen; j++) {
                const cell = children[j]
                if (i >= indexStart.row && i <= indexEnd.row && j >= indexStart.col && j <= indexEnd.col) {
                    selectedEles.push(cell)
                } 
            }
        }
        return selectedEles
    }

    selectedCellsIsValid () {
        const cellStart_rowspan = this.cellStart.getAttribute('rowspan')
        // const cellStart_colspan = this.cellStart.getAttribute('colspan')
        const cellEnd_rowspan = this.cellEnd && this.cellEnd.getAttribute('rowspan')
        // const cellEnd_colspan = this.cellEnd && this.cellEnd.getAttribute('colspan')
        if (cellStart_rowspan || cellEnd_rowspan) {
            console.log('不符合合并规则：选中区域不能包含已合并的单元格。')
            return false
        } 
        const selectedEles = this.getSelectedCells()
        const isInvalid = Array.from(selectedEles).some(ele => {
            return ele.style.display === 'none'
        })
        if (isInvalid) {
            console.log('不符合合并规则：不能有隐藏的单元格。')
            return false
        }
        return true
    }

    mergeCell = () => {
        const selectedEles = this.getSelectedCells()
        const {indexStart, indexEnd} = this
        const rowspan = indexEnd.row - indexStart.row + 1
        const colspan = indexEnd.col - indexStart.col + 1
        Array.from(selectedEles).forEach((ele, index) => {
            if (index === 0) {
                ele.setAttribute('rowspan', rowspan)
                ele.setAttribute('colspan', colspan)
            } else {
                ele.style.display = 'none'
            }
            ele.classList.remove(this.selected)
        })
    }

    /*mergeCell2 = () => {
        const {indexStart, indexEnd} = this
        const rowspan = indexEnd.row - indexStart.row + 1
        const colspan = indexEnd.col - indexStart.col + 1
        if (rowspan > 1 || colspan > 1) {
            this.cellStart.setAttribute('rowspan', rowspan)
            this.cellStart.setAttribute('colspan', colspan)
            const trs = this.tableEle.querySelectorAll('tr')
            const trLen = trs.length
            for (let i = 0; i < trLen; i++) {
                const tr = trs[i]
                const {children} = tr
                const childLen = children.length
                for (let j = 0; j < childLen; j++) {
                    const cell = children[j]
                    if (cell && cell !== this.cellStart && cell.className.includes(this.selected)) {
                        cell.style.display = 'none'
                    } 
                }
            }
            this.removeClass()
        }
    }*/

    unMergeCell = () => {
        this.indexStart = this.getCellIndex(this.contextmenuCell)
        const cellSpanProperty = this.getCellSpanProperty(this.contextmenuCell)
        this.indexEnd = {
            row: cellSpanProperty.rowspan - 1 + this.indexStart.row,
            col: cellSpanProperty.colspan - 1 + this.indexStart.col,
        }
        const selectedEles = this.getSelectedCells()
        Array.from(selectedEles).forEach((ele, index) => {
            if (index === 0) {
                ele.removeAttribute('rowspan')
                ele.removeAttribute('colspan')
            } else {
                ele.style.display = 'table-cell'
            }
            ele.classList.remove(this.selected)
        })
    }

    getCellIndexEnd (cell) {
        if (this.cellStart === cell) {
            this.indexEnd = this.indexStart
        } else {
            this.indexEnd = this.getCellIndex(cell)
        }
    }

    hideMenuEleNoSelfIsClicked = (e) => {
        const {target} = e
        if (this.menuEle && !this.menuEle.contains(target)) {
            this.menuEle.style.display = 'none'
        }
    }

    hideMenuEleSelfIsClicked = () => {
        if (this.menuEle) {
            this.menuEle.style.display = 'none'
        }
    }

    btnMergeClick = () => {
        this.hideMenuEleSelfIsClicked()
        this.mergeCell()
    }

    btnUnMergeClilk = () => {
        this.hideMenuEleSelfIsClicked()
        this.unMergeCell()
    }

    getCellSpanProperty (cell) {
        const rowspan = cell.getAttribute('rowspan')
        const colspan = cell.getAttribute('colspan')
        return {
            rowspan,
            colspan,
        }
    }

    getIsMergedCellBool (cell) {
        const {rowspan, colspan} = this.getCellSpanProperty(cell)
        const maxCount = Math.max(rowspan, colspan)
        return maxCount > 1
    }

    handleMenuBtnsStatus (cell) {
        this.isMergedCell = this.getIsMergedCellBool(cell)
        /**
        * 1.开始选中的单元格是否等于最后选中的单元格
        * 2.是否合并
        * 3.直接右键点击，未选中单元格时的情况
        */
        if ((this.cellStart === this.cellEnd || !cell.className.includes(this.selected)) && !cell.getAttribute('rowspan')) {
            this.btnMerge.style.color = '#eee'
            this.btnMerge.style.pointerEvents = 'none'
            this.btnUnMerge.style.color = '#eee'
            this.btnUnMerge.style.pointerEvents = 'none'
        } else if (this.isMergedCell) {
            this.btnMerge.style.color = '#eee'
            this.btnMerge.style.pointerEvents = 'none'
            this.btnUnMerge.style.color = 'inherit'
            this.btnUnMerge.style.pointerEvents = 'auto'
        } else {
            this.btnMerge.style.color = 'inherit'
            this.btnMerge.style.pointerEvents = 'auto'
            this.btnUnMerge.style.color = '#eee'
            this.btnUnMerge.style.pointerEvents = 'none'
        }
        
    }

    mousedown = (e) => {
        const {target, button} = e
        if (button === 0 && target.tagName !== 'TH') {
            this.ready = target
            this.cellStart = target
            this.indexStart = this.getCellIndex(target)
            this.removeClass()
            this.addClass(target)
        }
    }

    mousemove = (e) => {
        if (this.ready) {
            e.preventDefault()
            const {target} = e
            this.cellEnd = target
            this.getCellIndexEnd(target)
            this.highlightSelectedCells()
        }
    }

    mouseleave = (e) => {
        this.ready = null
    }

    mouseup = (e) => {
        const {target, button} = e
        if (button === 0) {
            this.cellEnd = target
            this.getCellIndexEnd(target)
            this.ready = null
        }
    }

    contextmenu = (e) => {
        e.preventDefault()
        const {target} = e
        if (!this.menuEle) {
            this.menuEle = document.createElement('ul')
            this.menuEle.classList.add('tableMergeCell-contextmenu')

            /*this.menus = ['合并单元格', '取消合并单元格']
            this.menus.forEach(item => {
                const li = document.createElement('li')
                li.textContent = item
                this.menuEle.appendChild(li)
            })*/

            this.btnMerge = document.createElement('li')
            this.btnMerge.textContent = '合并单元格'
            this.btnMerge.addEventListener('click', this.btnMergeClick, false)
            this.menuEle.appendChild(this.btnMerge)

            this.btnUnMerge = document.createElement('li')
            this.btnUnMerge.textContent = '取消合并单元格'
            this.btnUnMerge.addEventListener('click', this.btnUnMergeClilk, false)
            this.menuEle.appendChild(this.btnUnMerge)

            document.body.appendChild(this.menuEle)
        }
        const {clientX, clientY} = e
        this.menuEle.style.display = 'block'
        this.menuEle.style.top = `${clientY}px`
        this.menuEle.style.left = `${clientX}px`

        this.handleMenuBtnsStatus(target)
        this.contextmenuCell = target
    }

    addEvent () {
        this.tableEle.addEventListener('mousedown', this.mousedown, false)
        this.tableEle.addEventListener('mousemove', this.mousemove, false)
        this.tableEle.addEventListener('mouseleave', this.mouseleave, false)
        this.tableEle.addEventListener('mouseup', this.mouseup, false)
        this.tableEle.addEventListener('contextmenu', this.contextmenu, false)
        document.addEventListener('mousedown', this.hideMenuEleNoSelfIsClicked, false)
    }

    removeEvent () {
        this.tableEle.removeEventListener('mousedown', this.mousedown, false)
        this.tableEle.removeEventListener('mousemove', this.mousemove, false)
        this.tableEle.removeEventListener('mouseleave', this.mouseleave, false)
        this.tableEle.removeEventListener('mouseup', this.mouseup, false)
        this.tableEle.removeEventListener('contextmenu', this.contextmenu, false)
        document.removeEventListener('mousedown', this.hideMenuEleNoSelfIsClicked, false)
        this.btnMerge.removeEventListener('click', this.btnMergeClick, false)
        this.btnUnMerge.removeEventListener('click', this.btnUnMergeClilk, false)
    }
}

export default TableMergeCell
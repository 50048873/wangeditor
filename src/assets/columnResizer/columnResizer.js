/* eslint-disable */
const defaults = {
    colMinWidth: 50, // 列最小宽度
}

export default class ColumnResizer {
    static getTargetParentElement (target, querySelector) {
        while (target.className && !target.className.includes(querySelector) && target.parentNode) {
            target = target.parentNode
        }
        return target
    }

    constructor (tableEle, options = {}) {
        this.opts = Object.assign({}, defaults, options)
        this.isExcelTable = false
        this.tableEle = tableEle
        this.colgroup = tableEle.querySelector('colgroup')
        this.thead = tableEle.querySelector('thead')
        this.wangEditorEditableContainer = ColumnResizer.getTargetParentElement(tableEle, 'w-e-text')
        this.handshank = null
        this.handshankCls = 'tableMergeCell-handshank'
        this.subline = 'tableMergeCell-subline'
        this.handshankHover = 'tableMergeCell-handshank-hover'
        this.average = 200
        this.init()
    }

    // 初始化
    init () {
        if (!this.tableEle || this.tableEle.ELEMENT_NODE !== 1 || this.tableEle.tagName !== 'TABLE') {
            throw new Error('请传入table元素！')
        }
        this.initTable()
        this.handleExcelTable()
        this.initTheadAndColgroup()
        this.updateAverage()
        this.setColWidth()
        this.handleTableWidth()
        this.handleResizeHandShank()
        this.triggerFirstCellHeight()
        this.addEvent()
    }

    // 初始化表格
    initTable () {
        this.tableEle.removeAttribute('width')
        const parentNode = this.tableEle.parentNode
        if (parentNode && parentNode.className.includes('tableMergeCell-tempContainer')) {
            parentNode.insertAdjacentElement('beforebegin', this.tableEle)
        }
        const nextElementSibling = this.tableEle.nextElementSibling
        if (nextElementSibling && nextElementSibling.className && nextElementSibling.className.includes('tableMergeCell-tempContainer')) {
            nextElementSibling.remove()
        }
    }

    // 非页面插入的表格
    handleExcelTable () {
        const cellpadding = this.tableEle.getAttribute('cellpadding')
        if (!cellpadding) {
            if (this.colgroup) {
                this.colgroup.remove()
                this.colgroup = null
            }
            this.isExcelTable = true
            this.tableEle.setAttribute('cellpadding', 0)
        }
    }

    // 初始化thead和colgroup
    initTheadAndColgroup () {
        const tbody = this.tableEle.tBodies[0]
        const {rows} = tbody
        const colCount = rows[0].childElementCount
        if (this.colgroup && this.colgroup.children && this.colgroup.children.length !== colCount) {
            this.colgroup.remove()
            this.colgroup = null
        }
        if (!this.colgroup) {
            const colgroup = document.createElement('colgroup')
            for (let i = 0 ; i < colCount; i++) {
                const col = document.createElement('col')
                colgroup.appendChild(col)
            }
            this.colgroup = tbody.insertAdjacentElement('beforebegin', colgroup)
        }
        if (!this.thead) {
            const thead = document.createElement('thead')
            const tr = document.createElement('tr')
            tr.className = 'tableMergeCell-handshank-container'
            for (let i = 0 ; i < colCount; i++) {
                const th = document.createElement('th')
                tr.appendChild(th)
            }
            thead.appendChild(tr)
            this.thead = tbody.insertAdjacentElement('beforebegin', thead)
        }
    }

    // 更新平均值
    updateAverage () {
        if (this.isExcelTable) {
            const {colMinWidth} = this.opts
            const {children} = this.colgroup
            const col = children[0]
            this.average = Math.max(col.getBoundingClientRect().width, colMinWidth * 2)
        } else {
            const width = this.wangEditorEditableContainer.clientWidth - 20
            const {rows} = this.tableEle.tBodies[0]
            this.colCount = rows[0].childElementCount
            this.average = Math.floor(width / this.colCount)
        }
    }

    // 初始化col默认宽
    setColWidth () {
        const {children} = this.colgroup
        children.forEach(col => {
            const width = col.style.width
            if (!width) {
                col.style.width = `${this.average}px`
            } 
        })
    }

    // 获取col合计值
    getColTotal () {
        const {children} = this.colgroup
        let total = 0
        children.forEach(col => {
            let width = col.style.width
            if (width) {
                const count = Number.parseInt(width)
                if (typeof count === 'number') {
                    total += count
                }
            } 
        })
        return total
    }

    // 设置表格默认宽
    handleTableWidth () {
        if (!this.tableEle.style.width) {
            let width = 500
            if (this.isExcelTable) {
                const totalWidth = this.getColTotal()
                width = totalWidth ? totalWidth : Math.floor(this.tableEle.getBoundingClientRect().width)
            } else {
                width = this.average * this.colCount
            }
            this.setTableWidth(width)
        }
    }

    // 增加列调整手柄
    handleResizeHandShank () {
        const cells = this.thead.children[0].children
        cells.forEach((cell, index) => {
            const handshank = cell.querySelector(`.${this.handshankCls}`)
            handshank && handshank.remove()
            const i = `<i data-col="${index}" contenteditable="false" class="${this.handshankCls}"></i>`
            cell.insertAdjacentHTML('beforeend', i)
        })
    }

    // 更新列手柄高
    triggerFirstCellHeight () {
        setTimeout(() => {
            const evt = new CustomEvent('input', {
                bubbles: true,
                cancelable: false,
            })
            this.tableEle.dispatchEvent(evt)
        }, 1000)
    }

    // 添加一个默认列
    addOneCol (index) {
        const cols = this.colgroup.children
        const ths = this.thead.children[0].children
        const col = document.createElement('col')
        const th = document.createElement('th')
        col.style.width = `${this.average}px`
        cols[index].insertAdjacentElement('beforebegin', col)
        ths[index].insertAdjacentElement('beforebegin', th)
    }

    // 增加列
    handleAddCol = (index) => {
        this.addOneCol(index)
        this.handleResizeHandShank()
        const colsWidth = this.getColsWidth()
        this.setTableWidth(colsWidth)
    }

    // 删除列
    handleDelCol (index) {
        const cols = this.colgroup.children
        const ths = this.thead.children[0].children
        cols[index].remove()
        ths[index].remove()
        this.handleResizeHandShank()
        const colsWidth = this.getColsWidth()
        this.setTableWidth(colsWidth)
    }

    // 增加辅助线
    addSubline () {
        this.handshank.classList.add(this.subline)
    }

    // 设置表格宽
    setTableWidth (width) {
        if (typeof width !== 'number') {
            throw new Error('表格宽的参数为Number类型！')
        }
        width = width.toFixed()
        this.tableEle.style.width = `${width}px`
    }

    // 获取列宽和
    getColsWidth () {
        const {children} = this.colgroup
        const arr = Array.from(children).map(col => {
            const width = col.style.width
            return Number.parseInt(width)
        })
        const width = arr.reduce((acc, cur) => {
            return acc + cur
        })
        return width
    }

    mousedown = (e) => {
        const {target, button, clientX} = e
        if (this.tableEle.contains(target) && button === 0 && target.className.includes(this.handshankCls)) {
            this.handshank = target
            this.handshank.classList.add(this.handshankHover)
            this.clientX = clientX
            this.addSubline()
        } else {
            this.handshank = null
        }
    }

    mousemove = (e) => {
        if (this.handshank) {
            e.preventDefault()
            const {clientX} = e
            this.diff = clientX - this.clientX
            this.handshank.style.transform = `translateX(${this.diff}px)`
        }
    }

    mouseup = (e) => {
        if (this.handshank) {
            const {clientX} = e
            const index = this.handshank.dataset.col
            const currentCol = this.colgroup.children[index]
            if (currentCol) {
                const width = Number.parseInt(currentCol.style.width)
                const calcWidth = width + this.diff
                const {colMinWidth} = this.opts
                const newWidth = Math.max(colMinWidth, calcWidth)
                if (this.tableEle.contains(this.handshank) && clientX - this.clientX !== 0) {
                    currentCol.style.width = `${newWidth}px`
                }
            }
            this.handshank.style.removeProperty('transform')
            this.handshank.classList.remove(this.handshankHover, this.subline)
            this.handshank = null
            const colsWidth = this.getColsWidth()
            this.setTableWidth(colsWidth)
        }
    } 

    // 同步列控制手柄高度
    input = () => {
        const tbody = this.tableEle.tBodies[0]
        const row0 = tbody.rows[0]
        const cell = row0.children[0]
        const {height} = cell.getBoundingClientRect()
        const cells = this.thead.children[0].children
        if (height > 30) {
            cells.forEach(cell => {
                const i = cell.querySelector(`.${this.handshankCls}`)
                if (i) {
                    i.style.height = `${height}px`
                }
            })
        } else {
            cells.forEach(cell => {
                const i = cell.querySelector(`.${this.handshankCls}`)
                i && i.style.removeProperty('height')
            })
        }
    }

    destroy () {
        this.removeEvent()
    }

    addEvent () {
        window.addEventListener('mousedown', this.mousedown, false)
        window.addEventListener('mousemove', this.mousemove, false)
        window.addEventListener('mouseup', this.mouseup, false)
        this.wangEditorEditableContainer.addEventListener('input', this.input, false)
    }

    removeEvent () {
        window.removeEventListener('mousedown', this.mousedown, false)
        window.removeEventListener('mousemove', this.mousemove, false)
        window.removeEventListener('mouseup', this.mouseup, false)
        this.wangEditorEditableContainer.removeEventListener('input', this.input, false)
    }
}

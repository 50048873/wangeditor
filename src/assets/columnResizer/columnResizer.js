/* eslint-disable */
const defaults = {
    colMinWidth: 50, // 列最小宽度
}

export default class ColumnResizer {
    constructor (tableEle, options = {}) {
        this.opts = Object.assign({}, defaults, options)
        this.tableEle = tableEle
        this.tableEle.columnResizer = Object.assign({}, {reset: this.reset})
        this.handshank = null
        this.handshankCls = 'tableMergeCell-handshank'
        this.subline = 'tableMergeCell-subline'
        this.handshankHover = 'tableMergeCell-handshank-hover'
        this.init()
    }

    // 初始化
    init () {
        if (!this.tableEle || this.tableEle.ELEMENT_NODE !== 1 || this.tableEle.tagName !== 'TABLE') {
            throw new Error('请传入table元素！')
        }
        this.getDefaultWidth()
        this.setDefaultWidth()
        this.addResizeHandShank()
        this.addEvent()
    }

    // 获取表格与列宽默认值
    getDefaultWidth () {
        const {width} = this.tableEle.getBoundingClientRect()
        const {rows} = this.tableEle.tBodies[0]
        const colCount = rows[0].childElementCount
        this.average = width / colCount
        this.tableWidth = width
    }

    // 重置相关内容
    reset = () => {
        this.addResizeHandShank()
        this.setDefaultWidth()
    }

    // 初始化默认宽
    setDefaultWidth () {
        this.setTableWidth(this.tableWidth)
        const {rows} = this.tableEle.tBodies[0]
        const firstRowCells = rows[0].children
        firstRowCells.forEach(cell => {
            const width = cell.style.width
            if (!width) {
                cell.style.width = `${this.average}px`
            }
        })
    }

    // 增加列调整手柄
    addResizeHandShank () {
        const {rows} = this.tableEle.tBodies[0]
        const cells = rows[0].children
        cells.forEach((cell, index) => {
            const handshank = cell.querySelector(`.${this.handshankCls}`)
            handshank && handshank.remove()
            const i = `&emsp;<i data-col="${index}" contenteditable="false" class="${this.handshankCls}"></i>`
            cell.insertAdjacentHTML('beforeend', i)
        })
    }

    // 增加辅助线
    addSubline () {
        this.handshank.classList.add(this.subline)
        // this.tableEle.style.overflow = 'hidden'
    }

    // 移除辅助线
    removeSubline () {
        this.handshank.classList.remove(this.subline)
        // this.tableEle.style.overflow = 'initial'
    }

    // 设置表格宽
    setTableWidth (width) {
        this.tableEle.setAttribute('width', `${width}px`)
    }

    // 获取列宽和
    getColsWidth () {
        const {rows} = this.tableEle.tBodies[0]
        const cells = rows[0].children
        const arr = Array.from(cells).map(cell => {
            return Number.parseFloat(cell.style.width)
        })
        const width = arr.reduce((acc, cur) => {
            return acc + cur
        })
        return width
    }

    mousedown = (e) => {
        const {target, button, clientX} = e
        if (button === 0 && target.className.includes(this.handshankCls)) {
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

    mouseleave = () => {
        this.mouseup()
    }

    mouseup = (e) => {
        if (this.handshank) {
            const {clientX} = e
            const firstRow = this.tableEle.tBodies[0].rows[0]
            const index = this.handshank.dataset.col
            const currentCol = firstRow.children[index]
            const {width} = currentCol.getBoundingClientRect()
            const calcWidth = width + this.diff
            const {colMinWidth} = this.opts
            const newWidth = Math.max(colMinWidth, calcWidth)
            if (clientX - this.clientX === 0) return
            if (this.tableEle.contains(this.handshank)) {
                currentCol.style.width = `${newWidth}px`
            }
            this.handshank.style.transform = 'none'
            this.handshank.classList.remove(this.handshankHover)
            this.removeSubline()
            const colsWidth = this.getColsWidth()
            this.setTableWidth(colsWidth)
            this.handshank = null
        }
    }    

    addEvent () {
        window.addEventListener('mousedown', this.mousedown, false)
        window.addEventListener('mousemove', this.mousemove, false)
        window.addEventListener('mouseup', this.mouseup, false)
        // this.tableEle.addEventListener('mouseleave', this.mouseleave, false)
    }

    removeEvent () {
        window.removeEventListener('mousedown', this.mousedown, false)
        window.removeEventListener('mousemove', this.mousemove, false)
        window.removeEventListener('mouseup', this.mouseup, false)
        // this.tableEle.removeEventListener('mouseleave', this.mouseleave, false)
    }
}

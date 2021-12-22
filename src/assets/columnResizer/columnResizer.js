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
        this.tableEle = tableEle
        this.wangEditorEditableContainer = ColumnResizer.getTargetParentElement(tableEle, 'w-e-text')
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
        this.initTheadAndColgroup()
        this.getDefaultWidth()
        this.setWidth()
        this.addResizeHandShank()
        this.addEvent()
    }

    destroy () {
        this.removeEvent()
    }

    initTheadAndColgroup () {
        const tbody = this.tableEle.tBodies[0]
        const {rows} = tbody
        const colCount = rows[0].childElementCount
        const colgroup = document.createElement('colgroup')
        for (let i = 0 ; i < colCount; i++) {
            const col = document.createElement('col')
            colgroup.appendChild(col)
        }
        this.colgroup = tbody.insertAdjacentElement('beforebegin', colgroup)

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

    // 获取表格与列宽默认值
    getDefaultWidth () {
        const {width} = this.tableEle.getBoundingClientRect()
        const {rows} = this.tableEle.tBodies[0]
        const colCount = rows[0].childElementCount
        this.average = (width / colCount).toFixed()
    }

    // 重置相关内容
    reset = () => {
        this.addResizeHandShank()
        this.setWidth()
    }

    // 初始化默认宽
    setWidth () {
        const {children} = this.colgroup
        children.forEach(col => {
            const width = col.style.width
            if (!width) {
                col.style.width = `${this.average}px`
            } 
        })
        this.setTableWidth(this.average * children.length)
    }

    // 增加列调整手柄
    addResizeHandShank () {
        const cells = this.thead.children[0].children
        cells.forEach((cell, index) => {
            const handshank = cell.querySelector(`.${this.handshankCls}`)
            handshank && handshank.remove()
            const i = `<i data-col="${index}" contenteditable="false" class="${this.handshankCls}"></i>`
            cell.insertAdjacentHTML('beforeend', i)
        })
    }

    // 增加辅助线
    addSubline () {
        this.handshank.classList.add(this.subline)
    }

    // 移除辅助线
    removeSubline () {
        this.handshank.classList.remove(this.subline)
    }

    // 设置表格宽
    setTableWidth (width) {
        if (typeof width !== 'number') {
            throw new Error('表格宽的参数为Number类型！')
        }
        width = width.toFixed()
        this.tableEle.setAttribute('width', `${width}px`)
    }

    // 获取列宽和
    getColsWidth () {
        const {children} = this.colgroup
        const arr = Array.from(children).map(col => {
            return Number.parseFloat(col.style.width)
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

    mouseup = (e) => {
        if (this.handshank) {
            const {clientX} = e
            const index = this.handshank.dataset.col
            const currentCol = this.colgroup.children[index]
            const {width} = currentCol.getBoundingClientRect()
            const calcWidth = width + this.diff
            const {colMinWidth} = this.opts
            const newWidth = Math.max(colMinWidth, calcWidth)
            if (this.tableEle.contains(this.handshank) && clientX - this.clientX !== 0) {
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

    input = () => {
        const tbody = this.tableEle.tBodies[0]
        const row0 = tbody.rows[0]
        const cell = row0.children[0]
        const {height} = cell.getBoundingClientRect()
        const cells = this.thead.children[0].children
        if (height > 30) {
            cells.forEach(cell => {
                const i = cell.querySelector(`.${this.handshankCls}`)
                i.style.height = `${height}px`
            })
        } else {
            cells.forEach(cell => {
                const i = cell.querySelector(`.${this.handshankCls}`)
                i.style.removeProperty('height')
            })
        }
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

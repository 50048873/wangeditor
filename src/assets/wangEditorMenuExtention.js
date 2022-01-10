import E from 'wangeditor'

export class FormulaMenu extends E.BtnMenu {
    constructor (editor) {
        const $elem = E.$(
            `<div class="w-custom-menu" data-title="新增公式参数">
                <i>新增公式参数</i>
            </div>
            `
        )
        super($elem, editor)
    }
    clickHandler () {
        const event = new CustomEvent('addFormula')
        window.dispatchEvent(event)
    }
    tryChangeActive () {
        this.active()
    }
}
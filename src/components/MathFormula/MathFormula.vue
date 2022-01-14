<template>
    <section class="mathFormula">
        <div class="tabMenu">
            <ul class="tabTitle">
                <li 
                    v-for="(title, index) in tabTitle"
                    :key="index" 
                    :class="{current: index === currentIndex}"
                    @click="toggle(index)">
                    {{title}}
                </li>
            </ul>
            <ul class="tabContent">
                <li 
                    class="mathBox" 
                    v-for="(symbol, index) in currentMathSymbol"
                    :key="index"
                    :style="bgPos(index)"
                    @click="insert(symbol)">
                </li>
            </ul>
        </div>
        <div id="mathDiv" class="mathDiv">
            <span id="jmeMath"></span>
        </div>
    </section>
</template>

<script>
/* eslint-disable */
import {tabTitle, mathSymbol, pos} from './constant'
export default {
    name: 'MathFormula',
    props: {
        latex: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'add',
            validator (value) {
                return ['add', 'edit'].some(item => {
                    return item === value
                })
            },
        },
    },
    data () {
        return {
            currentIndex: 0,
        }
    },
    computed: {
        currentMathSymbol () {
            return this.mathSymbol[this.currentIndex]
        },
    },
    created () {
        this.tabTitle = tabTitle
        this.mathSymbol = mathSymbol
    },
    mounted () {
        this.$nextTick(() => {
            $("#jmeMath").mathquill('editable').mathquill("write", this.latex)
        })
    },
    methods: {
        toggle (index) {
            this.currentIndex = index
        },
        bgPos (index) {
            const slidLen = 34 // 每个图标的宽或高
            const {x, y} = pos[this.currentIndex]
            return {
                backgroundPosition: `-${x + Math.floor(index % 8) * slidLen}px -${y + Math.floor(index / 8) * slidLen}px`
            }
        },
        insert (q) {
            $("#jmeMath").focus().mathquill("write", q.replace("{/}", "\\"))
        },
    }
}
</script>

<style src="./mathFormula.less" lang="less"></style>
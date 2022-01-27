<template>
    <a-modal title="新增公式" width="600px" :visible="visible" @ok="ok" @cancel="cancel">
        <math-formula :type="type" :latex="latex" v-if="visible" />
    </a-modal>
</template>
<script>
import MathFormula from '@/components/MathFormula/MathFormula'
export default {
    name: 'FormulaPop',
    components: {
        MathFormula,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        latex: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            default: 'add',
        },
    },
    methods: {
        ok() {
            const $jmeMath = window.$('#jmeMath')
            const latex = $jmeMath.mathquill('latex')
            console.log(latex)
            this.$emit('confirm', latex)
            this.$emit('update:visible', false)
        },
        cancel() {
            this.$emit('update:visible', false)
        }
    }
}
</script>
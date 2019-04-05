const renderer = require('../../src/renderer')

let vm = new Vue({
    data: {
        toolsIsOpen: false
    },
    methods: {
        refresh() {
            window.location.reload(true)
        },
        toggleTools() {
            console.log(renderer)
        }
    },
    mounted() {
        console.log(this.toolsIsOpen)
    }
}).$mount('#app')

module.exports = {
    vm
}
export default {
  name: 'search-input',
  props: ['value'],
  template: '<input type="text" :value="value" @input="onInput" id="datatable-search-input" class="input" />',
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value)
      webix.$$('webix-datatable').filterByAll()
    }
  }
}

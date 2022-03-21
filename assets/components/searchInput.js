// @todo
export default {
  name: 'search-input',
  props: ['value'],
  template: '<input type="text" :value="value" @input="$emit(\'input\', $event)" id="datatable-search-input" class="input" />',
}

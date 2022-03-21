export default {
  name: 'fav-checkbox',
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <div>
      <input id="show-favs-only" type="checkbox" :checked="checked" @change="onChange">
      <label for="show-favs-only">Только избранные</label>
    </div>
  `,
  methods: {
    onChange(event) {
      this.$emit('change', event.target.checked)
      webix.$$('webix-datatable').filterByAll()
    }
  }
}

export default {
  name: 'table-settings',
  props: {
    columns: {
      type: Array,
      required: true,
    }
  },
  template: `
    <div class="table-settings">
      <button @click="isOpened = !isOpened" class="button" :class="{ 'button--pressed': isOpened }">
        <span class="icon-settings"></span>Настройка таблицы
      </button>
      <div class="table-settings__columns" :class="{ 'table-settings--is-opened': isOpened }">
        <div v-for="col in filteredColumns" :key="col.id" class="table-settings__col">
          <input type="checkbox" :id="getCheckboxId(col.id)" :checked="!col.hidden" @change="switchColumn($event.target.checked, col.id)">  
          <label :for="getCheckboxId(col.id)">{{ getCheckboxLabel(col.header) }}</label>
        </div>
        <div class="table-settings__col">
          <button class="button" @click="resetState">Сбросить состояние</button>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      isOpened: false,
      datatableInitialState: null,
    }
  },
  computed: {
    filteredColumns() {
      return this.columns.filter(column => this.getCheckboxLabel(column.header))
    }
  },
  methods: {
    getCheckboxId(id) {
      return `table-settings-${id}`
    },
    getCheckboxLabel(header) {
      if (typeof header === 'string') {
        return header
      }
      if (Array.isArray(header) && typeof header[0] === 'string') {
        return header[0]
      }
      return null
    },
    switchColumn(value, id) {
      const dataTable = webix.$$('webix-datatable')
      if (value) {
        dataTable.showColumn(id)
      } else {
        dataTable.hideColumn(id)
      }
    },
    resetState() {
      if (this.datatableInitialState)
        webix.$$('webix-datatable').setState(this.datatableInitialState)
    }
  },
  mounted() {
    // this.datatableInitialState = webix.$$('webix-datatable').getState()
  }
}

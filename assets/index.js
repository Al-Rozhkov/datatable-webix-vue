import tableData from "./tableData.js";
import webixUiComponent from "./components/webixDatatable.js";
import favCheckbox from "./components/favCheckbox.js";
import searchInput from "./components/searchInput.js";
import tableSettings from "./components/tableSettings.js";

const LOCALSTORAGE_KEY = "eggheads-fav-list";

function getFavsMap() {
  const favsString = localStorage.getItem(LOCALSTORAGE_KEY)
  return favsString ? JSON.parse(favsString) : {}
}

new Vue({
  el: "#app",
  template: `
    <div>
      <h3>Товары в категории <small>{{ tableData.length }} элементов</small></h3>

      <div class="toolbar">
        <search-input @input="" />
        <fav-checkbox v-model="showFavsOnly" />
        <table-settings :columns="config.columns" el="" class="toolbar__table-settings" @reset-table="resetTable" />
      </div>

      <webix-ui :config="config" :value="tableData" id="webix-datatable" />
    </div>
  `,
  components: {
    "webix-ui": webixUiComponent,
    "fav-checkbox": favCheckbox,
    "search-input": searchInput,
    "table-settings": tableSettings,
  },
  data: function () {
    const favsMap = getFavsMap()
    const thisComponent = this

    return {
      showFavsOnly: false,
      favsMap,
      columnsToHide: [],
      datatableInitialState: null,
      tableData,
      config: {
        view: "datatable", id: "webix-datatable", autoheight: true, autowidth: true, resizeColumn: true, dragColumn: true, borderless: true,
        tooltip: { template: "" },
        columns: [
          { id: "lostInterest", sort: "int", header: ["Упущен %", { content: "numberFilter" }], tooltip: false },
          {
            id: "position", sort: "int", header: ["Позиция", { content: "numberFilter" }], tooltip: false,
            template: function (item) {
              const isPositive = item.positionDynamics > 0
              const plus = isPositive ? '+' : ''
              return `${item.position} <span class="position-dynamics-${isPositive ? 'positive' : 'negative'}">${plus + item.positionDynamics}</span>`
            }
          },
          {
            id: "photo", sort: "int", header: "Фото",
            template: function (item) {
              return item.photo ? `<img class="img-rounded" src="./img/thumbs/${item.photo}">` : ''
            },
            tooltip: function (item) {
              return item.photo ? `<img class="img-rounded" src="./img/${item.photo}">` : ''
            },
          },
          { id: "sku", sort: "string", header: ["Артикул", { content: "textFilter" }], tooltip: false, },
          {
            id: "isFav", header: "",
            template: function (item) {
              return `<span class="icon-fav${item.isFav ? ' icon-fav--active' : ''}"></span>`
            },
          },
          {
            id: "sparklines", header: "График продаж",
            template: webix.Sparklines.getTemplate({
              type: "bar",
              paddingX: 0,
              width: 4,
            }),
            width: 200,
            tooltip: false,
          },
          {
            id: "product", sort: "string", tooltip: false, header: ["Продукт", { content: "textFilter" }], adjust: "data",
            template: function (item) {
              return item.product.charAt(0).toUpperCase() + item.product.slice(1);
            }
          },
          { id: "brand", sort: "string", header: ["Бренд", { content: "multiSelectFilter" }], tooltip: false },
          { id: "seller", sort: "string", header: ["Продавец", { content: "multiSelectFilter" }], tooltip: false },
          { id: "group", sort: "string", header: ["Группа", { content: "multiSelectFilter" }], tooltip: false },
          { id: "remains", sort: "int", header: ["Остаток", { content: "numberFilter" }], tooltip: false },
          { id: "reviews", sort: "int", header: ["Отзывы", { content: "numberFilter" }], tooltip: false },
        ],
        onClick: {
          "icon-fav": function (el, cell) {
            const item = this.getItem(cell.row)
            item.isFav = !item.isFav
            this.updateItem(cell.row, item)

            if (item.isFav) {
              thisComponent.favsMap[item.id] = true
            } else {
              delete thisComponent.favsMap[item.id]
            }

            if (Object.keys(thisComponent.favsMap).length === 0) {
              localStorage.removeItem(LOCALSTORAGE_KEY)
            } else {
              localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(thisComponent.favsMap))
            }
          }
        },
        scheme: {
          $init: function (item) {
            item.isFav = !!thisComponent.favsMap[item.id]
          }
        }
      }
    }
  },

  mounted() {
    this.datatableInitialState = webix.$$('webix-datatable').getState()
  },
  methods: {
    resetTable() {
      if (this.datatableInitialState)
        webix.$$('webix-datatable').setState(this.datatableInitialState)
    }
  }
});

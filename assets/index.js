// import tableData from "./tableData.js";
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
      <h3>Товары в категории
        <!-- small>{{ tableData.length }} элементов</small -->
      </h3>

      <div class="toolbar">
        <search-input />
        <fav-checkbox v-model="showFavsOnly" />
        <table-settings :columns="config.columns" class="toolbar__table-settings" />
        <button @click="onTest">Test</button>
      </div>

      <webix-ui :config="config" id="webix-datatable" />
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
      // tableData,
      config: {
        view: 'datatable',
        id: 'webix-datatable',
        url: '/api/data.json',
        height: 500,
        autowidth: true,
        resizeColumn: { size: 6 },
        dragColumn: true,
        borderless: true,
        css: 'webix_header_border',
        tooltip: { template: "" },
        pager: {
          size: 100,
          group: 10,
        },
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
              return item.photo ? `<img class="img-rounded" src="./img/thumbs/${item.photo}" width="32" height="48" onerror="this.src='/img/thumbs/fallback.jpg'"">` : ''
            },
            tooltip: function (item) {
              return item.photo ? `<img class="img-rounded" src="./img/${item.photo}" width="524" height="786" onerror="this.src='/img/fallback.jpg'"">` : ''
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
            id: "product", sort: "string", tooltip: false, header: ["Продукт", { content: "eggheadsTextFilter" }], adjust: "data",
            template: function (item) {
              return item.product.charAt(0).toUpperCase() + item.product.slice(1);
            }
          },
          { id: "brand", sort: "string", header: ["Бренд", { content: "selectFilter" }], width: 150, fillspace: true, tooltip: false },
          { id: "seller", sort: "string", header: ["Продавец", { content: "eggheadsSelectFilter" }], width: 150, fillspace: true, tooltip: false },
          { id: "group", sort: "string", header: ["Группа", { content: "selectFilter" }], tooltip: false },
          { id: "remains", sort: "int", header: ["Остаток", { content: "eggheadsNumberFilter", text: 'Остаток' }], tooltip: false },
          {
            id: "reviews", sort: "int", header: ["Отзывы", { content: "numberFilter" }], width: 120, tooltip: false,
            format: webix.Number.numToStr({
              groupDelimiter: " ",
              groupSize: 3,
            })
          },
        ],
        onClick: {
          "icon-fav": function (el, cell) {
            const item = this.getItem(cell.row)
            item.isFav = !item.isFav
            this.updateItem(cell.row, item)

            // Update reactive vue data isFav property.
            if (item.isFav) {
              thisComponent.favsMap[item.id] = true
            } else {
              delete thisComponent.favsMap[item.id]

              // Special case for "Show favorites only" checked state.
              // Unchecked items should disappear reactively. So we should filter by all.
              if (thisComponent.showFavsOnly) {
                this.filterByAll();
              }
            }

            // We need to update localstorage every time we interact with favorites,
            // because we cannot fully trust the "beforeunload" browser event
            // (see https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#usage_notes)
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
  methods: {
    onTest() {
      // webix.$$('webix-datatable').loadNext(20, 25);
      console.log(webix.$$('$list1'));
    }
  }
});

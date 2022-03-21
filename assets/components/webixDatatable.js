function dataHandler(value) {
  const view = $$(this.webixId);

  if (typeof value === 'object') {
    if (this.copyData)
      value = webix.copy(value);

    if (view.setValues)
      view.setValues(value);
    else if (view.parse) {
      view.clearAll();
      view.parse(value)
    }
  } else if (view.setValue)
    view.setValue(value);
}

function isSubstring(value, filterValue) {
  value = value.toString().toLowerCase();
  return value.indexOf(filterValue) !== -1;
}

export default {
  name: 'webix-ui',
  props: ['config', 'value', 'copyData'],
  watch: {
    value: {
      handler: dataHandler
    }
  },

  template: '<div></div>',

  mounted() {
    const config = webix.copy(this.config);
    config.$scope = this;

    this.webixId = webix.ui(config, this.$el);
    if (this.value)
      dataHandler.call(this, this.value);

    // Register "Favorites only" filter.
    this.webixId.registerFilter(
      document.getElementById('show-favs-only'),
      {
        columnId: 'isFav',
        compare: function (cellValue, filterValue) {
          return !filterValue || Boolean(cellValue) === Boolean(filterValue)
        },
      },
      {
        getValue: function (object) {
          return object.checked;
        },
        setValue: function (object, value) {
          object.checked = value;
        },
      }
    );

    // Register search input filter.
    this.webixId.registerFilter(
      document.getElementById('datatable-search-input'),
      {
        columnId: 'sku-product-brand-seller',
        compare: function (cellValue, filterValue, item) {
          filterValue = filterValue.toString().toLowerCase();

          return isSubstring(item.sku, filterValue)
            || isSubstring(item.product, filterValue)
            || isSubstring(item.brand, filterValue)
            || isSubstring(item.seller, filterValue)
        },
      },
      {
        getValue: function (object) {
          return object.value;
        },
        setValue: function (object, value) {
          object.value = value;
        },
      }
    );

    // Store state before unload.
    webix.attachEvent('unload', function () {
      webix.storage.local.put("eggheads-state", webix.$$('webix-datatable').getState());
    });

    // Restore state if possible.
    const savedState = webix.storage.local.get("eggheads-state");
    if (savedState)
      this.webixId.setState(savedState);
  },

  destroyed: function () {
    webix.$$(this.webixId).destructor();
  }
};

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

  /* webix.ui.each(view, function (sub) {
    if (sub.hasEvent && sub.hasEvent("onValue"))
      sub.callEvent("onValue", [value]);
  }, this, true); */
}

function isEquals(a, b){
  a = a.toString().toLowerCase();
  return a.indexOf(b) !== -1;
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
        columnId: 'any',
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

    /*  this.webixId.filterByAll = function () {
       //get filter values
       var text = this.getFilter('rank').value.toString().toLowerCase();
       //unfilter for empty search text
       if (!text) return this.filter();
 
       //filter using OR logic
       this.filter(function (obj) {
         if (equals(obj.year, text)) return true;
         if (equals(obj.title, text)) return true;
         return false;
       });
     } */
  },

  destroyed: function () {
    webix.$$(this.webixId).destructor();
  }
};

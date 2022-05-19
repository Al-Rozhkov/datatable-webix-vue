export default webix.extend({
  render: (master, config) => {
      console.log('-- customTextFilter', master, config)
      const that = this;
      
      const popup = webix.ui({
        view: "popup",
        body: "<input placeholder=\"Поиск\" type='text'>"
      });

      const filter = popup.getBody();

      filter.attachEvent("onChange", () => {
        const handler = filter.getFilterFunction();

        config.compare = function (val, f, obj) {
          return handler({
            value: obj[config.columnId]
          });
        };

        master.filterByAll(); // change state after filtering

        if (config.value) that._mark_column(config.value, config.node);
      });
      console.log('-- Filter', filter)

      master.attachEvent("onScrollX", () => popup.hide());

      config.originText = config.text || '';
      config.filter = popup._settings.id;

      config.css = (config.css || "") + " webix_ss_excel_filter";
      return "<span class='webix_excel_filter webix_icon wxi-filter'></span>" + config.originText;
  },
  _mark_column: function (value, node) {
    debugger
    if (value.includes || value.condition && value.condition.filter) {
      addCss(node, "webix_ss_filter_active", true);
    } else {
      removeCss(node, "webix_ss_filter_active");
    }
  },
}, webix.ui.datafilter.excelFilter)

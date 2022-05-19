function delay(method, obj, params, delay) {
  return window.setTimeout(function () {
    if (!(obj && obj.$destructed)) {
      var ret = method.apply(obj, params || []);
      method = obj = params = null;
      return ret;
    }
  }, delay || 1);
}

const richSelectFilter = {
  getInputNode: function (node) {
    return $$(node.$webix) || null;
  },

  getValue: function (node, text) {
    var ui$$1 = this.getInputNode(node);
    if (text && ui$$1 && ui$$1.getText) return ui$$1.getText();
    return ui$$1 ? ui$$1.getValue() : "";
  },

  setValue: function (node, value) {
    var ui$$1 = this.getInputNode(node);
    return ui$$1 ? ui$$1.setValue(value) : "";
  },

  compare: function (a, b) {
    return a == b;
  },

  refresh: function (master, node, value) {
    if (master.$destructed) return;
    var select = $$(value.richselect); //IE11 can destory the content of richselect, so recreating

    if (!select.$view.parentNode) {
      var d = create("div", {
        "class": "webix_richfilter"
      });
      d.appendChild(select.$view);
    }

    node.$webix = value.richselect;
    value.compare = value.compare || this.compare;
    value.prepare = value.prepare || this.prepare;
    master.registerFilter(node, value, this);

    var data = datafilter._get_data(master, value);

    var list = select.getPopup().getList(); // reattaching node back to master container

    node.appendChild(select.$view.parentNode); // load data in list, must be after reattaching, as callback of parse can try to operate with innerHTML

    if (list.parse) {
      list.clearAll();
      list.parse(data);

      if (!this.$noEmptyOption && value.emptyOption !== false || value.emptyOption) {
        var emptyOption = {
          id: "$webix_empty",
          value: value.emptyOption || "",
          $empty: true
        };
        list.add(emptyOption, 0);
      }
    } // repaint the filter control


    select.render(); // set actual value for the filter

    if (value.value) this.setValue(node, value.value); // adjust sizes after full rendering

    delay(select.resize, select);
  },

  render: function (master, config) {
    if (!config.richselect) {
      var d = create("div", {
        "class": "webix_richfilter"
      });
      var richconfig = {
        container: d,
        view: this.inputtype,
        options: []
      };
      var inputConfig = exports.extend(this.inputConfig || {}, config.inputConfig || {}, true);
      exports.extend(richconfig, inputConfig);
      if (config.separator) richconfig.separator = config.separator;
      if (config.suggest) richconfig.suggest = config.suggest;
      var richselect = ui(richconfig);
      richselect.attachEvent("onChange", function () {
        master.filterByAll();
      });
      config.richselect = richselect._settings.id;

      master._destroy_with_me.push(richselect);
    }

    config.css = (config.css || "") + " webix_div_filter";
    return " ";
  },

  inputtype: "richselect"
};

const multiSelectFilter = {
  $noEmptyOption: true,

  inputtype: "multiselect",

  prepare: function (value, filter) {
    if (!value) return value;
    var hash = {};
    var parts = value.toString().split(filter.separator || ",");

    for (var i = 0; i < parts.length; i++) {
      hash[parts[i]] = 1;
    }

    return hash;
  },

  compare: function (a, b) {
    return !b || b[a];
  }
}

export default {
  inputtype: "multicombo",
  inputConfig: {
    tagMode: false
  }
}

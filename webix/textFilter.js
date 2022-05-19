export default {
  getInputNode: function (node) {
    return node.querySelector("input") || {
      value: null
    };
  },
  getValue: function (node) {
    return this.getInputNode(node).value;
  },
  setValue: function (node, value) {
    this.getInputNode(node).value = value;
  },
  refresh: function (master, node, value) {
    node.component = master._settings.id;
    master.registerFilter(node, value, this);
    node._comp_id = master._settings.id;
    if (value.value && this.getValue(node) != value.value) this.setValue(node, value.value);
    node.onclick = preventEvent;

    _event(node, "keydown", this._on_key_down);
  },
  render: function (master, config) {
    if (this.init) this.init(config);
    config.css = (config.css || "") + " webix_ss_filter";
    return "<input " + (config.placeholder ? "placeholder=\"" + config.placeholder + "\" " : "") + "type='text'>";
  },
  _on_key_down: function (e) {
    var id = this._comp_id; //tabbing through filters must not trigger filtering
    //we can improve this functionality by preserving initial filter value
    //and comparing new one with it

    if ((e.which || e.keyCode) == 9) return;
    if (this._filter_timer) window.clearTimeout(this._filter_timer);
    this._filter_timer = window.setTimeout(function () {
      var ui$$1 = $$(id); //ensure that ui is not destroyed yet

      if (ui$$1) ui$$1.filterByAll();
    }, datafilter.textWaitDelay);
  }
}

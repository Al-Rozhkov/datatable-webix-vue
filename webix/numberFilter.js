export default {
  init: function (config) {
    config.prepare = function (value) {
      var _this = this;

      var equality = value.indexOf("=") != -1;
      var intvalue = this.format(value);
      if (intvalue === "") return "";
      var compare;

      if (value.indexOf(">") != -1) {
        compare = this._greater;
      } else if (value.indexOf("<") != -1) {
        compare = this._lesser;
      }

      if (compare && equality) {
        config.compare = function (a, b) {
          return _this._equal(a, b) || compare(a, b);
        };
      } else {
        config.compare = compare || this._equal;
      }

      return intvalue;
    };
  },
  format: function (value) {
    return value.replace(/[^\-.0-9]/g, "");
  },
  _greater: function (a, b) {
    return a * 1 > b;
  },
  _lesser: function (a, b) {
    return a !== "" && a * 1 < b;
  },
  _equal: function (a, b) {
    return a !== "" && a * 1 == b;
  }
}

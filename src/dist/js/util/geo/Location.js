"use strict";

class Location extends util.obj.Obj {
  /**
   *
   * Parameters are for this.set
   * @param {*} obj
   */
  constructor(obj = undefined) {
    super(obj);
  }

  equals(location) {
    if (!(location instanceof Location)) {
      return false;
    }

    return super.equals(location);
  }

  /**
   * Set every members in obj but functions
   *
   * @param {json|object} obj
   *
   * @return number of set/not set members which are not a function
   *          3 values : nb_set, nb_not_set, that
   */
  set(obj) {
    return super.set(obj);
  }

  to_string() {
    let str = "{";

    if (typeof this.lat !== "undefined") {
      str += this.lat;
    }
    str += ",";

    if (typeof this.lng !== "undefined") {
      str += this.lng + " ";
    }

    str += "}";
    return str;
  }
}

Location.init(require("./Location_properties"), module);

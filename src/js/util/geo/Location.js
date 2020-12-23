"use strict";

if (typeof process !== "undefined") {
  global.Obj = require(process.env.SRC_ROOT + "dist/js/util/Obj");
}

class Location extends Obj {
  constructor(obj = undefined) {
    super();

    this.lat = null; //number
    this.lng = null; //number

    return this.set(obj).that;
  }

  clone() {
    return new Location(super.get_cloned_JSON());
  }

  equals(location) {
    if (!(location instanceof Location)) {
      return false;
    }

    return super.equals(location);
  }

  get_JSON() {
    return super.get_JSON();
  }

  get_cloned_JSON() {
    return super.get_cloned_JSON();
  }

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

if (typeof process !== "undefined") {
  module.exports = Location;
}

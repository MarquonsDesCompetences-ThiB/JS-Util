"use strict";
import { Location_props } from "./_props/Location_props.js";

export class Location extends Location_props {
  /**
   *
   * Parameters are for this.set
   * @param {*} obj
   */
  constructor(obj = undefined) {
    super();
    if (obj) {
      this.set(obj, undefined, true);
    }
  }

  equals(location) {
    if (!(location instanceof Location)) {
      return false;
    }

    return super.equals(location);
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

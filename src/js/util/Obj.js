"use strict";

if (typeof process !== "undefined") {
  global.Json = require(process.env.SRC_ROOT + "dist/js/util/Json");
}

class Obj {
  /**
   *
   * @param {string[]} cycle_reference_members Key members in this which raise
   *                                            a cyclic references
   *                                            Their value won't be converted
   *                                            to simple Json object
   *                                            => they're returned as is
   */
  constructor(cycle_reference_members = []) {
    this.cycle_reference_members = cycle_reference_members;
    return this;
  }

  static clone(obj) {
    switch (typeof obj) {
      case "boolean":
        return new Boolean(obj);
        break;

      case "number":
        return obj + 0;
        break;

      case "string":
        return obj + "";
        break;

      case "object":
        if (obj instanceof Array) {
          let arr = [];
          for (let i = 0; i < obj.length; i++) {
            let clone = Obj.clone(obj[i]);
            if (clone) {
              arr.push(clone);
            } else {
              arr.push(obj[i]);
            }
          }
        } else if (obj.get_cloned_JSON) {
          return obj.get_cloned_JSON();
        }
        break;
    }
    // function | object without get_cloned_JSON()
    return undefined;
  }

  clone() {
    return new Obj(this.get_cloned_JSON());
  }

  equals(obj) {
    if (typeof obj === "undefined" || !(obj instanceof Obj)) {
      return false;
    }

    for (let key in this) {
      //
      //process cyclic reference
      if (this.cycle_reference_members.indexOf(key) >= 0) {
        if (this[key] != obj[key]) {
          return false;
        }
      }
      //
      // other value
      else if (!Json.value_equals(this[key], obj[key])) {
        logger.log(
          "Obj#equals members " +
            key +
            " are different : " +
            this[key] +
            " !== " +
            obj[key]
        );
        return false;
      }
    }

    return true;
  }

  /**
   *
   * Key members in this.cycle_reference_members
   * aren't converted to simple Json object => they're returned as is
   */
  get_JSON(only_owned_members = false) {
    let ret = {};

    for (let key in this) {
      if (this.cycle_reference_members.indexOf(key) >= 0) {
        if (!only_owned_members) {
          ret[key] = this[key];
        }
      } else {
        ret[key] = Json.to_json_value(this[key], only_owned_members);
      }
    }

    return ret;
  }

  /**
   * Clone every members in this but functions
   * and keys in this.cycle_reference_members
   *
   * Key members in this.cycle_reference_members
   * aren't cloned => their reference is returned as is
   * @return {json}
   */
  get_cloned_JSON() {
    let ret = {};

    for (let key in this) {
      if (this.cycle_reference_members.indexOf(key) >= 0) {
        ret[key] = this[key];
      } else {
        ret[key] = Json.clone_value(this[key]);

        /*const type = typeof ret[key];
      if (type !== "undefined") {
        ret.nb_cloned++;
      }
      //type = undefined
      else if (typeof this[key] !== "function") {
        ret.nb_not_cloned++;
      }*/
      }
    }
    return ret;
  }

  /**
   * Set every members in obj but functions
   * @return number of set/not set members which are not a function
   *          3 values : nb_set, nb_not_set, that
   */
  set(obj) {
    let ret = {
      nb_set: 0,
      nb_not_set: 0,
      that: this,
    };

    if (!obj) {
      return ret;
    }

    for (let key in this) {
      const this_type = typeof this[key];
      if (
        this_type !== undefined &&
        this_type !== "function" &&
        obj[key] !== undefined
      ) {
        this[key] = obj[key];
        ret.nb_set++;
      } else {
        ret.nb_not_set++;
      }
    }

    return ret;
  }
}

if (typeof process !== "undefined") {
  module.exports = Obj;
}

"use strict";

if (typeof process !== "undefined") {
  if (!global.util) {
    global.util = {};
  }
  global.util.string = require(process.env.SRC_ROOT +
    "dist/js/util/text/String");
}

class Json {
  constructor() {}

  /**
   * Clone the specified value if it's not a function
   * @param {*} val
   * @param {bool} reference_if_cannot_clone
   */
  static clone_value(val, reference_if_cannot_clone = true) {
    const type = typeof val;
    if (type === "function" || type === "undefined") {
      return undefined;
    }

    if (val === null) {
      return null;
    }

    if (type === "number") {
      return val + 0;
    }

    if (type === "string") {
      return val + "";
    }

    if (type === "object") {
      // Array
      if (val instanceof Array) {
        let ret = [];
        for (let i = 0; i < val.length; i++) {
          ret.push(Json.clone_value(val[i]));
        }

        return ret;
      }

      if (val instanceof Number) {
        return val + 0;
      }

      if (val instanceof String) {
        return val + "";
      }

      // Object with clone function
      if (typeof val.clone === "function") {
        return val.clone();
      }

      // Date
      if (val instanceof Date) {
        return new Date(val.getTime());
      }
    }
    // Other than object
    else {
      const str = "Json#clone_value Couldn't clone " + val;
      if (reference_if_cannot_clone) {
        logger.warn(str + " ; reference given");
        return val;
      }

      {
        logger.warn(str + " ; value forgot");
        return undefined;
      }
    }
  }

  static get_nb_properties(obj) {
    if (!obj || !(obj instanceof Object)) {
      return 0;
    }

    let nb = 0;
    for (key in obj) {
      if (typeof obj[key] !== "function") {
        nb++;
      }
    }

    return nb;
  }

  /**
   * Merge 2 json objects
   * @param {json} obj_receiving
   * @param {json} obj_to_merge
   * @param {bool} keep_obj_receiving_values In case both objects have the
   *                                          same key with primitive value
   *                                          If true, value from obj_receiving
   *                                          is kept, obj_to_merge is lost
   *                                          If false, value from obj_to_merge
   *                                          is kept, obj_receiving is lost
   *
   */
  static merge(obj_receiving, obj_to_merge, keep_obj_receiving_values = true) {
    for (let key in obj_to_merge) {
      const type = typeof obj_receiving[key];
      if (obj_receiving[key] === undefined) {
        obj_receiving[key] = obj_to_merge[key];
      } else if (type !== typeof obj_to_merge[key]) {
        logger.warn(
          "Json#concat Key " +
            key +
            " has different types in objects : " +
            type +
            "; " +
            typeof obj_to_merge[key] +
            " Keeping obj_receiving's value : " +
            keep_obj_receiving_values
        );
        if (!keep_obj_receiving_values) {
          obj_receiving[key] = obj_to_merge[key];
        }
      } else if (type === "object") {
        concat(
          obj_receiving[key],
          obj_to_merge[key],
          keep_obj_receiving_values
        );
      } else {
        // primitive ype
        if (!keep_obj_receiving_values) {
          obj_receiving[key] = obj_to_merge[key];
        }
      }
    }
  }

  /**
   * Convert val to a Json storable property value
   * @param {*} val
   */
  static to_json_value(val, only_owned_members = false) {
    //if val does not exist, is not an empty string
    if (!val && !util.string.is_string(val)) {
      return undefined;
    }

    const type = typeof val;
    if (type === "function") {
      return undefined;
    }

    if (type === "object") {
      // Array
      if (val instanceof Array) {
        let ret = [];
        for (let i = 0; i < val.length; i++) {
          ret.push(Json.to_json_value(val[i], only_owned_members));
        }

        return ret;
      }
      // Object with get_JSON function
      else if (typeof val.get_JSON === "function") {
        return val.get_JSON(only_owned_members);
      }
      // Date
      else if (val instanceof Date) {
        return val.toString();
      }
    }
    // Other than object
    else {
      return val;
    }
  }

  static value_equals(val1, val2) {
    const type1 = typeof val1;
    const type2 = typeof val2;
    if (type1 !== type2) {
      if (type1 === "number" || val1 instanceof Number) {
        if (type2 !== "number" && !(val2 instanceof Number)) {
          return false;
        }
      } else if (type1 === "string" || val1 instanceof String) {
        if (type2 !== "string" && !(val2 instanceof String)) {
          return false;
        }
      }
    }

    if (val1 === null || val2 === null) {
      return val1 === val2;
    }

    //do not consider functions
    if (type1 === "function") {
      return true;
    }

    if (type1 === "object") {
      //val1 has an equals() function
      if (typeof val1.equals === "function") {
        return val1.equals(val2);
      }

      // val1 is an Array object
      if (val1 instanceof Array) {
        if (!(val2 instanceof Array) || val1.length !== val2.length) {
          return false;
        }

        for (let i = 0; i < val1.length; i++) {
          if (!Json.value_equals(val1[i], val2[i])) {
            return false;
          }
        }
        return true;
      }

      if (val1 instanceof Date) {
        return val1.getTime() === val2.getTime();
      }
    }

    return val1 == val2;
  }
}

module.exports = Json;

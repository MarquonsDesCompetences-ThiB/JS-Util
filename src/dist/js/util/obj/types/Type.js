"use strict";

class Type {
  /**
   * Return if obj is of specified type
   * Specified type can be a class instance
   *    => return true if obj is an object of this instance
   * @param {string} type_name
   * @param {*} obj
   * @param {bool} strict
   */
  static is(type_name, obj, strict = false) {
    if (/^\s*(boolean|Boolean)\s*/.test(type_name)) {
      return util.types.Bool.is(obj, strict);
    }

    if (/^\s*(number|Number)\s*/.test(type_name)) {
      return util.number.Number.is(obj, strict);
    }

    if (/^\s*(string|String)\s*/.test(type_name)) {
      return util.text.String.is(obj);
    }

    const obj_type = typeof obj;
    if (type_name === obj_type) {
      return true;
    }

    if (obj_type === "object") {
      return obj.constructor.name === obj_type;
    }

    return false;
  }
}

if (typeof process !== "undefined") {
  module.exports = Type;
}

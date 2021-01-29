"use strict";

class Bool {
  /**
   * Return if obj is a boolean/Boolean or not, strictly or not
   * @param {*} obj
   * @param {bool} strict If not strict and obj is a string or number,
   *                          check if equivalent to a boolean
   *                            ( string : {false, true}
   *                              number : {0, 1}
   *                            )
   */
  static is(obj, strict = false) {
    const type = typeof obj;
    {
      if (type === "boolean" || obj instanceof Boolean) {
        return true;
      }
    }

    if (strict) {
      return false;
    }

    {
      if (util.text.String.is(obj)) {
        return /^\s*(true|false)\s*$/.test(obj);
      }

      if (util.text.Number.is_number(obj)) {
        return /^\s*(0|1)\s*$/.test(obj);
      }
    }

    return false;
  }
}

if (typeof process !== "undefined") {
  module.exports = Bool;
}

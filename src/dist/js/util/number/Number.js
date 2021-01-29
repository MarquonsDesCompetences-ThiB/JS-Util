"use strict";

const random = require("random");

class Number_ {
  /**
   * Return true if val is a number, Number
   * If not strictly : or a string/String representing a number
   * @param {*} val
   * @param {bool} strict If not strict and obj is a string ,
   *                          check if equivalent to a number
   */
  static is(val, strict = false) {
    const type = typeof val;

    //
    // If strict -> must be a number or Number
    if (strict) {
      return type === "number" || val instanceof Number;
    }

    //
    // If not a string -> must be a number or Number
    if (!util.text.String.is(val)) {
      return type === "number" || val instanceof Number;
    }

    // if string is digits with optional decimals
    return /^\d+(\.\d*)?$/.test(val);
  }

  static sanitize(val) {
    const type = typeof val;

    if (type === "number") {
      return val;
    }

    if (val instanceof Number) {
      return val + 0;
    }

    // Not a string or String
    if (type !== "string" && !(val instanceof String)) {
      return undefined;
    }

    //
    // Convert string val to number
    {
      //
      // Is an int string ?
      const int = Number.parseInt(val);
      //if string is an int
      if (!isNaN(int)) {
        return int;
      }
    }

    {
      //
      // Is a float string ?
      const float = Number.parseFloat(val);
      if (!isNaN(float)) {
        return float;
      }

      return undefined;
    }
  }

  /**
   * Return a random int with the specified length
   * Eg. if length = 2, in [10;99]
   *      if lenggth = 3, in [100; 999]
   *      ...
   * @param {*} length
   */
  static random_int_with_length(length) {
    if (length <= 1) {
      return Math.round(Math.random.random() * 10);
    }

    const min = Math.pow(10, length);
    const max = Math.pow(10, length + 1) - 1;
    return random.int(min, max);
  }
}

if (typeof process !== "undefined") {
  module.exports = Number_;
}

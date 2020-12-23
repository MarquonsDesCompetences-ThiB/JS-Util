"use strict";
const randomstring = require("randomstring");

class String {
  constructor() {}

  static is_string(val) {
    return typeof val === "string" || val instanceof String;
  }

  static random(length) {
    return randomstring.generate({
      length: length,
    });
  }
}

if (typeof process !== "undefined") {
  module.exports = String;
}

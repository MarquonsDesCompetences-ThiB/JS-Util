"use strict";

/**
    Useful regex
*/
class Regex {
  constructor() {}

  static zip_code = {
    fr: "\\d{5}",
  };
  static website =
    "((https?):\\/\\/)?(www.)?[a-z0-9]+\\.[a-z]+(\\/[a-zA-Z0-9#]+\\/?)*";

  static has_value(val) {
    return val !== undefined && val != "";
  }

  /**
   *
   * @param {string} str
   * @param {bool | optional} only If must have only numbers or just contain numbers
   */
  static has_numbers(str, only = false) {
    if (only) {
      return /^\d+$/.test(str);
    }
    return /\d+/.test(str);
  }

  /**
   *
   * @param {number | string} val
   */
  static is_number(val) {
    //
    // Check val as a string
    if (util.text.String.is(val)) {
      return Regex.has_numbers(val, true);
    }

    return util.number.Number.is(val);
  }

  /**
   *
   * @param {string} str
   * @param {bool | optional} only If must have only lowercases or just contain numbers
   */
  static has_lower_case(str, only = false) {
    if (only) {
      return /^[a-z]+$/.test(str);
    }
    return /[a-z]+/.test(str);
  }

  /**
   *
   * @param {string} str
   * @param {bool | optional} only If must have only uppercases or just contain numbers
   */
  static has_upper_case(str, only = false) {
    if (only) {
      return /^[A-Z]+$/.test(str);
    }
    return /[A-Z]+/.test(str);
  }

  static is_email_address(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
  }

  static is_phone_number(no) {
    return /^(\+\d{11})|(\d{10})$/.test(no);
  }

  static is_website(url) {
    return new RegExp("/^" + Regex.website + "$/").test(url);
  }

  static is_zip_code(no) {
    return new RegExp("/^" + Regex.zip_code.fr + "$/").test(no);
  }
}

module.exports = Regex;

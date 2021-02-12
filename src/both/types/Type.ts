"use strict";
import * as bool from "./Bool.js";
import { number } from "#both";
import { text } from "#both";

/**
 * Return if obj is of specified type
 * Specified type can be a class instance
 *    => return true if obj is an object of this instance
 * @param {string} type_name
 * @param {*} obj
 * @param {bool} strict
 */
export function is(type_name, obj, strict = false) {
  if (/^\s*(boolean|Boolean)\s*/.test(type_name)) {
    return bool.is(obj, strict);
  }

  if (/^\s*(number|Number)\s*/.test(type_name)) {
    return number.is(obj, strict);
  }

  if (/^\s*(string|String)\s*/.test(type_name)) {
    return text.string.is(obj);
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

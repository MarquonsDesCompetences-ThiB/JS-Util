"use strict";
import { text } from "#both";
import random from "random";

export { Dimension } from "./Dimension.js";

export * as money from "./Money_statics.js";
export { Money } from "./Money.js";

/**
 * Return val if it is a number or Number,
 * null otherwise
 * @param val
 *
 * @return {string|String|null}
 */
export function if_is(val: any): number | Number {
  if (typeof val === "number" || val instanceof Number) {
    return val;
  }

  return null;
}

/**
 * Return true if val is a number, Number
 * If not strictly : or a string/String representing a number
 * @param {*} val
 * @param {bool} string_number_ok If string_number_ok and obj is a string ,
 *                                check if equivalent to a number
 */
export function is(val: any, string_number_ok: boolean = false) {
  const type = typeof val;

  //
  // If strict -> must be a number or Number
  if (!string_number_ok) {
    return type === "number" || val instanceof Number;
  }

  //
  // If not a string -> must be a number or Number
  if (!text.string.is(val)) {
    return type === "number" || val instanceof Number;
  }

  // if string is digits with optional decimals
  return /^\d+(\.\d*)?$/.test(val);
}

export function sanitize(val: any): number {
  const type = typeof val;

  if (type === "number") {
    return val;
  }

  if (val instanceof Number) {
    return +val;
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
export function random_int_with_length(length: number): number {
  if (length <= 1) {
    return Math.round(Math.random() * 10);
  }

  const min = Math.pow(10, length);
  const max = Math.pow(10, length + 1) - 1;
  return random.int(min, max);
}
